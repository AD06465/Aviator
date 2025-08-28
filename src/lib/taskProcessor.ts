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
import { MandatoryFieldManager } from './mandatoryFieldManager';

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
    let activationCompleteCompleted = false;

    // Start periodic task checking
    this.processingInterval = setInterval(async () => {
      if (!this.isProcessing) {
        this.stopProcessing();
        return;
      }

      console.log(`🔄 Processing interval tick - checking for tasks...`);

      try {
        // Search for tasks
        const searchResult = await flightDeckApiService.searchTasks(orderForm.orderNumber);
        
        if (!searchResult.success || !searchResult.data) {
          console.error('Failed to search tasks:', searchResult.error);
          return;
        }

        const tasks = searchResult.data.taskResults;
        const totalTasks = tasks.length;
        console.log(`📊 Found ${totalTasks} total tasks in search`);

        // Update status
        this.updateStatus({
          isProcessing: true,
          totalTasks,
          completedTasks,
          failedTasks,
          lastUpdate: new Date(),
        });

        // Track if Send Completion Details is completed (for logging purposes)
        const sendCompletionTask = tasks.find(t => t.TASK_NAME === 'Send Completion Details');
        if (sendCompletionTask && sendCompletionTask.TASK_STATUS.toLowerCase() === 'completed') {
          if (!sendCompletionDetailsCompleted) {
            sendCompletionDetailsCompleted = true;
            console.log('✅ Send Completion Details task is completed - but continuing to process other Ready tasks');
          }
        }

        // Track if Activation Complete is completed (for logging purposes)
        const activationCompleteTask = tasks.find(t => t.TASK_NAME === 'Activation Complete');
        if (activationCompleteTask && activationCompleteTask.TASK_STATUS.toLowerCase() === 'completed') {
          if (!activationCompleteCompleted) {
            activationCompleteCompleted = true;
            console.log('✅ Activation Complete task is completed - but continuing to process other Ready tasks');
          }
        }

        // Process ready, assigned, and created tasks
        const processableTasks = tasks.filter(t => {
          const status = t.TASK_STATUS.toLowerCase();
          return status === 'ready' || status === 'assigned' || status === 'created';
        });

        console.log(`🔍 Found ${processableTasks.length} processable tasks out of ${totalTasks} total tasks`);
        processableTasks.forEach(task => {
          console.log(`  - ${task.TASK_NAME} (ID: ${task.ID}, Status: ${task.TASK_STATUS})`);
        });

        if (processableTasks.length === 0) {
          console.log('⏸️ No processable tasks found, continuing to monitor...');
          return;
        }

        // Handle BE Installation sequencing logic
        await this.handleBEInstallationSequencing(processableTasks);

        console.log(`🎯 Processable tasks after BE Installation sequencing: ${processableTasks.length}`);
        processableTasks.forEach(task => {
          console.log(`  - ${task.TASK_NAME} (ID: ${task.ID}, Status: ${task.TASK_STATUS})`);
        });

        if (processableTasks.length === 0) {
          console.log('⏸️ No processable tasks remaining after BE Installation sequencing, continuing to monitor...');
          return;
        }

        // Sort tasks by priority
        const sortedTasks = processableTasks.sort((a, b) => 
          getTaskPriority(a.TASK_NAME) - getTaskPriority(b.TASK_NAME)
        );

        console.log(`⚡ Starting to process ${sortedTasks.length} processable tasks...`);

        for (const task of sortedTasks) {
          if (!this.isProcessing) break;

          console.log(`🔄 Processing task: ${task.TASK_NAME} (ID: ${task.ID}, Status: ${task.TASK_STATUS})`);

          this.updateStatus({
            isProcessing: true,
            currentTask: task.TASK_NAME,
            totalTasks,
            completedTasks,
            failedTasks,
            lastUpdate: new Date(),
          });

          // Check if task should be completed based on status
          console.log(`🧭 Checking if task should be completed by status...`);
          if (this.shouldCompleteTaskByStatus(task)) {
            const isInCompletableList = shouldCompleteTask(task.TASK_NAME, taskConfig);
            const taskType = isInCompletableList ? "configured" : "auto-detected";
            
            console.log(`🚀 Processing ${taskType} task: ${task.TASK_NAME} (Status: ${task.TASK_STATUS})`);
            
            try {
              console.log(`🔧 About to call processCompleteTask for: ${task.TASK_NAME}`);
              const success = await this.processCompleteTask(task, orderForm, taskConfig);
              console.log(`📊 processCompleteTask result for ${task.TASK_NAME}: ${success}`);
              
              if (success) {
                completedTasks++;
                console.log(`✅ Successfully completed ${taskType} task: ${task.TASK_NAME}`);
              } else {
                console.log(`❌ Failed to complete ${taskType} task: ${task.TASK_NAME}`);
              }
            } catch (error) {
              console.error(`💥 Exception in processCompleteTask for ${task.TASK_NAME}:`, error);
            }
          } else {
            console.log(`⏭️ Skipping task: ${task.TASK_NAME} (Status: ${task.TASK_STATUS}) - not completable by status`);
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

        // Check if we should stop processing (smarter termination logic)
        const shouldStopProcessing = this.shouldStopProcessing(tasks, sendCompletionDetailsCompleted, activationCompleteCompleted);
        if (shouldStopProcessing.stop) {
          console.log(`🛑 Stopping task processing: ${shouldStopProcessing.reason}`);
          
          // Enhanced completion message based on which task completed
          let orderCompletionMessage = 'Order processing completed';
          if (sendCompletionDetailsCompleted) {
            orderCompletionMessage = '🎉 Order processing completed - Send Completion Details task finished';
          } else if (activationCompleteCompleted) {
            orderCompletionMessage = '🎉 Order processing completed - Activation Complete task finished';
          } else {
            orderCompletionMessage = '🎉 Order processing completed - All tasks processed';
          }
          
          console.log(orderCompletionMessage);
          
          this.isProcessing = false;
          this.updateStatus({
            isProcessing: false,
            totalTasks,
            completedTasks,
            failedTasks,
            lastUpdate: new Date(),
          });
          return;
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
    console.log(`🔧 Checking BE Installation sequencing logic...`);
    
    const beInstallationTask = tasks.find(t => 
      t.TASK_NAME === 'BE Installation Scheduled Date: BE completion notice'
    );
    const confirmScheduleTask = tasks.find(t => 
      t.TASK_NAME === 'Confirm/Schedule Activation'
    );

    console.log(`BE Installation task found: ${beInstallationTask ? `Yes (Status: ${beInstallationTask.TASK_STATUS})` : 'No'}`);
    console.log(`Confirm/Schedule task found: ${confirmScheduleTask ? `Yes (Status: ${confirmScheduleTask.TASK_STATUS})` : 'No'}`);

    // If both tasks exist and are processable
    if (beInstallationTask && confirmScheduleTask) {
      const beStatus = beInstallationTask.TASK_STATUS.toLowerCase();
      const confirmStatus = confirmScheduleTask.TASK_STATUS.toLowerCase();
      
      // Check if both are in processable states (created, ready, or assigned)
      const beProcessable = ['created', 'ready', 'assigned'].includes(beStatus);
      const confirmProcessable = ['created', 'ready', 'assigned'].includes(confirmStatus);
      
      console.log(`BE Installation processable: ${beProcessable}, Confirm/Schedule processable: ${confirmProcessable}`);
      
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
              console.log('🚫 Removing Confirm/Schedule Activation from processable tasks due to BE Installation sequencing');
              tasks.splice(confirmIndex, 1);
            }
          }
        }
      }
    } else {
      console.log('BE Installation sequencing: Not applicable (one or both tasks missing)');
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
    
    console.log(`📋 Preparing task data for: ${taskName}`);
    
    // Check for missing mandatory fields and prompt user if needed
    console.log(`🔍 Checking mandatory fields for task: ${taskName}`);
    const canProceed = await MandatoryFieldManager.checkMissingValues(taskDetails);
    
    if (!canProceed) {
      console.log(`❌ Task ${taskName} cannot proceed - user cancelled mandatory field input`);
      throw new Error('Task completion cancelled - mandatory fields not provided');
    }
    
    console.log(`✅ All mandatory fields validated for task: ${taskName}`);
    
    const needsUpdate = taskConfig.taskFieldMappings[taskName] ? true : false;
    const hasFieldMappings = !!taskConfig.taskFieldMappings[taskName];
    
    if (hasFieldMappings) {
      console.log(`📝 Task ${taskName} has configured field mappings`);
    } else {
      console.log(`🔧 Task ${taskName} has no configured field mappings - using dynamic field detection`);
    }
    
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
          console.log(`Setting field '${param.name}' to '${fieldValue}' for task '${taskName}'`);
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

    // Add any required field values to completion payload
    for (const param of taskDetails.taskInstParamRequestList) {
      // Skip if already added
      if (completePayload.paramRequests.some(p => p.name === param.name)) {
        continue;
      }

      // Add field if it's required and has a value (either from config or user input)
      if (param.jsonDescriptorObject?.required && param.value) {
        console.log(`Adding required field '${param.name}' with value '${param.value}' to completion payload`);
        completePayload.paramRequests.push({
          type: param.type || 'text',
          header: param.header,
          name: param.name,
          value: param.value,
          editable: param.jsonDescriptorObject.editable,
          jsonDescriptorObject: param.jsonDescriptorObject,
        });
      } else if (taskConfig.taskFieldMappings[taskName]) {
        // Fallback to configured values for mapped tasks
        const fieldValue = getTaskFieldValue(taskName, param.name, taskConfig, orderForm);
        
        if (fieldValue && param.jsonDescriptorObject?.required) {
          console.log(`Adding configured field '${param.name}' with value '${fieldValue}' to completion payload`);
          completePayload.paramRequests.push({
            type: param.type || 'text',
            header: param.header,
            name: param.name,
            value: fieldValue,
            editable: param.jsonDescriptorObject.editable,
            jsonDescriptorObject: param.jsonDescriptorObject,
          });
        }
      }
    }

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

  /**
   * Determines if a task should be completed based on its status
   */
  private shouldCompleteTaskByStatus(task: Task): boolean {
    const completableStatuses = ['ready', 'assigned', 'created'];
    const isCompletableByStatus = completableStatuses.includes(task.TASK_STATUS.toLowerCase());
    
    if (isCompletableByStatus) {
      console.log(`✅ Task "${task.TASK_NAME}" is completable (Status: ${task.TASK_STATUS})`);
    } else {
      console.log(`❌ Task "${task.TASK_NAME}" is not completable (Status: ${task.TASK_STATUS})`);
    }
    
    return isCompletableByStatus;
  }

  /**
   * Determines if processing should stop based on comprehensive task analysis
   */
  private shouldStopProcessing(tasks: Task[], sendCompletionDetailsCompleted: boolean, activationCompleteCompleted: boolean): { stop: boolean; reason: string } {
    // Count tasks by status
    const tasksByStatus = {
      ready: tasks.filter(t => t.TASK_STATUS.toLowerCase() === 'ready').length,
      assigned: tasks.filter(t => t.TASK_STATUS.toLowerCase() === 'assigned').length,
      created: tasks.filter(t => t.TASK_STATUS.toLowerCase() === 'created').length,
      completed: tasks.filter(t => t.TASK_STATUS.toLowerCase() === 'completed').length,
      failed: tasks.filter(t => t.TASK_STATUS.toLowerCase() === 'failed').length,
      cancelled: tasks.filter(t => t.TASK_STATUS.toLowerCase() === 'cancelled').length,
    };

    const processableTasks = tasksByStatus.ready + tasksByStatus.assigned + tasksByStatus.created;
    const totalTasks = tasks.length;

    console.log(`🔍 Task status analysis:`, {
      processableTasks,
      totalTasks,
      ready: tasksByStatus.ready,
      assigned: tasksByStatus.assigned,
      created: tasksByStatus.created,
      completed: tasksByStatus.completed,
      failed: tasksByStatus.failed,
      cancelled: tasksByStatus.cancelled,
      sendCompletionDetailsCompleted,
      activationCompleteCompleted
    });

    // Continue processing if there are still processable tasks, regardless of completion task status
    if (processableTasks > 0) {
      console.log(`✅ Continuing processing - ${processableTasks} processable task(s) remaining`);
      return { stop: false, reason: '' };
    }

    // Stop if no processable tasks remain and Send Completion Details is done
    if (sendCompletionDetailsCompleted && processableTasks === 0) {
      return { 
        stop: true, 
        reason: 'Send Completion Details completed and no processable tasks remaining' 
      };
    }

    // Stop if no processable tasks remain and Activation Complete is done
    if (activationCompleteCompleted && processableTasks === 0) {
      return { 
        stop: true, 
        reason: 'Activation Complete completed and no processable tasks remaining' 
      };
    }

    // Stop if all tasks are in final states (completed, failed, cancelled)
    if (processableTasks === 0) {
      return { 
        stop: true, 
        reason: 'No processable tasks remaining - all tasks are in final states' 
      };
    }

    return { stop: false, reason: '' };
  }

  isCurrentlyProcessing(): boolean {
    return this.isProcessing;
  }
}

export default TaskProcessor;
