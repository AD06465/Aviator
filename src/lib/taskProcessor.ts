import { flightDeckApiService } from './api';
import {
  Task,
  TaskDetails,
  OrderForm,
  TaskManagementConfig,
  ProcessingStatus,
} from '../types';
import {
  shouldCompleteTask,
  shouldRetryTask,
  getTaskFieldValue,
  getTaskPriority,
  calculateDelayForTask,
  isIgnorableFailedTask,
} from './taskConfig';

export class TaskProcessor {
  private isProcessing: boolean = false;
  private statusUpdateCallback?: (status: ProcessingStatus) => void;
  private processingInterval?: NodeJS.Timeout;
  private beInstallationCompletedTime?: Date;

  constructor(statusUpdateCallback?: (status: ProcessingStatus) => void) {
    this.statusUpdateCallback = statusUpdateCallback;
  }

  async startProcessing(orderForm: OrderForm, taskConfig: TaskManagementConfig): Promise<void> {
    if (this.isProcessing) {
      console.log('Processing already in progress');
      return;
    }

    this.isProcessing = true;
    
    // Set up API service
    flightDeckApiService.setEnvironment(orderForm.environment);
    flightDeckApiService.setUserName(orderForm.userName);

    let completedTasks = 0;
    let failedTasks: Task[] = [];
    let sendCompletionDetailsCompleted = false;

    // Start periodic task checking
    this.processingInterval = setInterval(async () => {
      if (!this.isProcessing) {
        this.stopProcessing();
        return;
      }

      try {
        // Search for tasks
        const searchResult = await flightDeckApiService.searchTasks(orderForm.orderNumber);
        
        if (!searchResult.success || !searchResult.data) {
          console.error('Failed to search tasks:', searchResult.error);
          return;
        }

        const tasks = searchResult.data.taskResults;
        const totalTasks = tasks.length;

        // Update status
        this.updateStatus({
          isProcessing: true,
          totalTasks,
          completedTasks,
          failedTasks,
          lastUpdate: new Date(),
        });

        // Check if Send Completion Details is completed
        const sendCompletionTask = tasks.find(t => t.TASK_NAME === 'Send Completion Details');
        if (sendCompletionTask && sendCompletionTask.TASK_STATUS.toLowerCase() === 'completed') {
          sendCompletionDetailsCompleted = true;
          this.isProcessing = false;
          this.updateStatus({
            isProcessing: false,
            totalTasks,
            completedTasks,
            failedTasks,
            lastUpdate: new Date(),
          });
          console.log('Order processing completed - Send Completion Details task finished');
          return;
        }

        // Process ready, assigned, and created tasks
        const processableTasks = tasks.filter(t => {
          const status = t.TASK_STATUS.toLowerCase();
          return status === 'ready' || status === 'assigned' || status === 'created';
        });

        // Handle BE Installation sequencing logic
        await this.handleBEInstallationSequencing(processableTasks);

        // Sort tasks by priority
        const sortedTasks = processableTasks.sort((a, b) => 
          getTaskPriority(a.TASK_NAME) - getTaskPriority(b.TASK_NAME)
        );

        for (const task of sortedTasks) {
          if (!this.isProcessing) break;

          this.updateStatus({
            isProcessing: true,
            currentTask: task.TASK_NAME,
            totalTasks,
            completedTasks,
            failedTasks,
            lastUpdate: new Date(),
          });

          if (shouldCompleteTask(task.TASK_NAME, taskConfig)) {
            const success = await this.processCompleteTask(task, orderForm, taskConfig);
            if (success) {
              completedTasks++;
            }
          }
        }

        // Process failed tasks for retry
        const currentFailedTasks = tasks.filter(t => 
          t.TASK_STATUS.toLowerCase() === 'failed' && 
          shouldRetryTask(t.TASK_NAME, taskConfig)
        );

        for (const task of currentFailedTasks) {
          if (!this.isProcessing) break;

          if (!isIgnorableFailedTask(task.TASK_NAME)) {
            const success = await this.processRetryTask(task, orderForm, taskConfig);
            if (success) {
              // Remove from failed tasks if retry was successful
              failedTasks = failedTasks.filter(ft => ft.ID !== task.ID);
            } else {
              // Add to failed tasks if not already present
              if (!failedTasks.find(ft => ft.ID === task.ID)) {
                failedTasks.push(task);
              }
            }
          }
        }

        // Update final status
        this.updateStatus({
          isProcessing: true,
          totalTasks,
          completedTasks,
          failedTasks,
          lastUpdate: new Date(),
        });

      } catch (error) {
        console.error('Error during task processing:', error);
      }
    }, 60000); // Check every minute
  }

  private async handleBEInstallationSequencing(tasks: Task[]): Promise<void> {
    const beInstallationTask = tasks.find(t => 
      t.TASK_NAME === 'BE Installation Scheduled Date: BE completion notice'
    );
    const confirmScheduleTask = tasks.find(t => 
      t.TASK_NAME === 'Confirm/Schedule Activation'
    );

    // If both tasks exist and are processable
    if (beInstallationTask && confirmScheduleTask) {
      const beStatus = beInstallationTask.TASK_STATUS.toLowerCase();
      const confirmStatus = confirmScheduleTask.TASK_STATUS.toLowerCase();
      
      // Check if both are in processable states (created, ready, or assigned)
      const beProcessable = ['created', 'ready', 'assigned'].includes(beStatus);
      const confirmProcessable = ['created', 'ready', 'assigned'].includes(confirmStatus);
      
      if (beProcessable && confirmProcessable) {
        console.log('BE Installation sequencing: Both tasks are processable, prioritizing BE Installation task');
        
        // If BE Installation was recently completed, check if 3 minutes have passed
        if (this.beInstallationCompletedTime) {
          const timeSinceCompletion = Date.now() - this.beInstallationCompletedTime.getTime();
          const threeMinutes = 3 * 60 * 1000; // 3 minutes in milliseconds
          
          if (timeSinceCompletion < threeMinutes) {
            console.log(`BE Installation sequencing: Waiting ${Math.ceil((threeMinutes - timeSinceCompletion) / 1000)}s before processing Confirm/Schedule Activation`);
            // Temporarily remove Confirm/Schedule Activation from processable tasks
            const confirmIndex = tasks.findIndex(t => t.TASK_NAME === 'Confirm/Schedule Activation');
            if (confirmIndex > -1) {
              tasks.splice(confirmIndex, 1);
            }
          }
        }
      }
    }
  }

  private async processCompleteTask(
    task: Task,
    orderForm: OrderForm,
    taskConfig: TaskManagementConfig
  ): Promise<boolean> {
    try {
      // Get task details
      const detailsResult = await flightDeckApiService.getTaskDetails(task.ID);
      
      if (!detailsResult.success || !detailsResult.data) {
        console.error('Failed to get task details:', detailsResult.error);
        return false;
      }

      const taskDetails = detailsResult.data;

      // Check for mandatory fields and prepare data
      const taskData = await this.prepareTaskData(taskDetails, orderForm, taskConfig);

      // Update task data if needed
      if (taskData.needsUpdate) {
        const updateResult = await flightDeckApiService.updateTaskData(taskData.updatePayload);
        if (!updateResult.success) {
          console.error('Failed to update task data:', updateResult.error);
          return false;
        }

        // Add delay before completion
        await flightDeckApiService.delay(2000);
      }

      // Complete the task
      const completeResult = await flightDeckApiService.completeTask(task.ID, taskData.completePayload);
      
      if (completeResult.success) {
        console.log(`Successfully completed task: ${task.TASK_NAME}`);
        
        // Track BE Installation completion time for sequencing
        if (task.TASK_NAME === 'BE Installation Scheduled Date: BE completion notice') {
          this.beInstallationCompletedTime = new Date();
          console.log('BE Installation sequencing: BE Installation task completed, starting 3-minute timer');
        }
        
        // Add delay based on task type
        const delay = calculateDelayForTask(task.TASK_NAME, 0);
        await flightDeckApiService.delay(delay);
        
        return true;
      } else {
        console.error(`Failed to complete task ${task.TASK_NAME}:`, completeResult.error);
        return false;
      }

    } catch (error) {
      console.error(`Error processing complete task ${task.TASK_NAME}:`, error);
      return false;
    }
  }

  private async processRetryTask(
    task: Task,
    orderForm: OrderForm,
    taskConfig: TaskManagementConfig,
    maxRetries: number = 3
  ): Promise<boolean> {
    try {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        console.log(`Retrying task ${task.TASK_NAME}, attempt ${attempt}/${maxRetries}`);

        // Get task details
        const detailsResult = await flightDeckApiService.getTaskDetails(task.ID);
        
        if (!detailsResult.success || !detailsResult.data) {
          console.error('Failed to get task details for retry:', detailsResult.error);
          continue;
        }

        const taskDetails = detailsResult.data;
        const taskData = await this.prepareTaskData(taskDetails, orderForm, taskConfig);

        // Retry the task
        const retryResult = await flightDeckApiService.retryTask(task.ID, taskData.completePayload);
        
        if (retryResult.success) {
          console.log(`Successfully retried task: ${task.TASK_NAME}`);
          
          // Wait 5 minutes before checking status
          await flightDeckApiService.delay(5 * 60 * 1000);
          
          // Check if task completed
          const statusCheck = await flightDeckApiService.getTaskDetails(task.ID);
          if (statusCheck.success && 
              statusCheck.data?.statusDetails.status.toLowerCase() === 'completed') {
            return true;
          }
          
          if (attempt === maxRetries) {
            console.error(`Task ${task.TASK_NAME} failed after ${maxRetries} retries`);
            return false;
          }
          
        } else {
          console.error(`Retry attempt ${attempt} failed for task ${task.TASK_NAME}:`, retryResult.error);
        }

        // Wait before next retry
        if (attempt < maxRetries) {
          await flightDeckApiService.delay(5000);
        }
      }

      return false;

    } catch (error) {
      console.error(`Error processing retry task ${task.TASK_NAME}:`, error);
      return false;
    }
  }

  private async prepareTaskData(
    taskDetails: TaskDetails,
    orderForm: OrderForm,
    taskConfig: TaskManagementConfig
  ): Promise<{
    needsUpdate: boolean;
    updatePayload: any;
    completePayload: any;
  }> {
    const taskName = taskDetails.taskName;
    const needsUpdate = taskConfig.taskFieldMappings[taskName] ? true : false;
    
    let updatePayload: any = null;
    let completePayload = {
      workgroupList: taskDetails.workgroupList,
      paramRequests: [] as any[],
    };

    if (needsUpdate) {
      // Prepare update payload with required field values
      const taskInstParamRequestList: any[] = [];
      
      for (const param of taskDetails.taskInstParamRequestList) {
        const fieldValue = getTaskFieldValue(taskName, param.name, taskConfig, orderForm);
        
        if (fieldValue) {
          taskInstParamRequestList.push({
            ...param,
            value: fieldValue,
          });
        } else {
          taskInstParamRequestList.push(param);
        }
      }

      updatePayload = {
        id: taskDetails.id,
        lockCounter: 0,
        sourceTaskId: taskDetails.sourceTaskId,
        description: taskDetails.description,
        sourceSystemName: 'AUTOPILOT',
        taskName: taskDetails.taskName,
        escalated: 'N',
        assignedCuid: taskDetails.assignedCuid,
        assignedUserName: taskDetails.assignedUserName,
        createdById: 'AUTOPILOT',
        createdByName: 'AUTOPILOT',
        workgroupList: taskDetails.workgroupList,
        statusDetails: taskDetails.statusDetails,
        taskInstParamRequestList,
      };
    }

    // Prepare completion payload
    completePayload.paramRequests = [
      {
        type: 'textArea',
        header: 'ActivationCompleteLayout',
        name: 'complete_remarks',
        templateName: 'ActivationCompleteLayout',
        value: 'Automated completion by AVIATOR',
        editable: true,
        jsonDescriptorObject: {
          label: 'Complete Remarks',
          editable: true,
          required: true,
          visible: true,
          highlighted: false,
          isPersistParam: true,
          order: 6,
          tooltip: 'Complete Remarks',
          service: '',
          groupName: '',
          optionsList: [],
          filter: true,
          sort: true,
        },
      },
    ];

    return {
      needsUpdate,
      updatePayload,
      completePayload,
    };
  }

  stopProcessing(): void {
    this.isProcessing = false;
    this.beInstallationCompletedTime = undefined; // Reset BE Installation timer
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = undefined;
    }
  }

  private updateStatus(status: ProcessingStatus): void {
    if (this.statusUpdateCallback) {
      this.statusUpdateCallback(status);
    }
  }

  isCurrentlyProcessing(): boolean {
    return this.isProcessing;
  }
}

export default TaskProcessor;
