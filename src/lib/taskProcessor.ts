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
  areTaskDependenciesMet,
  shouldWaitForTask,
  getDelayAfterTask,
} from './taskConfig';
import { MandatoryFieldManager } from './mandatoryFieldManager';

export class TaskProcessor {
  private isProcessing: boolean = false;
  private isCycleInProgress: boolean = false; // Prevent parallel processing cycles
  private statusUpdateCallback?: (status: ProcessingStatus) => void;
  private processingInterval?: NodeJS.Timeout;
  private beInstallationCompletedTime?: Date;
  private completedTaskNames: string[] = []; // Track completed tasks for dependency checking
  private waitingForTask: string | null = null; // Track if we're waiting for a blocking task

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

    // Immediately update status to show processing has started
    this.updateStatus({
      isProcessing: true,
      totalTasks: 0,
      completedTasks: 0,
      failedTasks: [],
      lastUpdate: new Date(),
      currentTask: 'Starting automation...'
    });
    console.log('✅ Processing status updated - UI should show "Stop Processing" button');

    // Start periodic task checking
    this.processingInterval = setInterval(async () => {
      if (!this.isProcessing) {
        this.stopProcessing();
        return;
      }

      // Skip if a processing cycle is already in progress
      if (this.isCycleInProgress) {
        console.log('⏸️ Skipping interval - previous processing cycle still in progress');
        return;
      }

      this.isCycleInProgress = true;
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
        
        // Log all tasks with their statuses for debugging
        console.log('📋 All tasks found:');
        tasks.forEach(task => {
          console.log(`  - ${task.TASK_NAME} (ID: ${task.ID}, Status: ${task.TASK_STATUS})`);
        });

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

        // Update completed task names for dependency tracking
        const completedTasksFromApi = tasks.filter(t => t.TASK_STATUS.toLowerCase() === 'completed');
        this.completedTaskNames = completedTasksFromApi.map(t => t.TASK_NAME);
        console.log(`📋 Completed tasks tracked: ${this.completedTaskNames.join(', ')}`);

        // Check if we're waiting for a blocking task to complete
        if (this.waitingForTask) {
          const blockingTask = tasks.find(t => t.TASK_NAME === this.waitingForTask);
          if (blockingTask && blockingTask.TASK_STATUS.toLowerCase() === 'completed') {
            console.log(`✅ Blocking task \"${this.waitingForTask}\" is now completed, resuming processing`);
            
            // Check for delay after this task
            const delay = getDelayAfterTask(this.waitingForTask, taskConfig);
            if (delay > 0) {
              console.log(`⏳ Waiting ${delay / 1000} seconds after \"${this.waitingForTask}\" completion...`);
              await flightDeckApiService.delay(delay);
            }
            
            this.waitingForTask = null;
          } else {
            console.log(`⏸️ Still waiting for blocking task \"${this.waitingForTask}\" to complete...`);
            return; // Skip processing until blocking task completes
          }
        }

        // Process ready/assigned/created tasks if any exist
        if (processableTasks.length > 0) {
          // Handle BE Installation sequencing logic
          await this.handleBEInstallationSequencing(processableTasks);

          console.log(`🎯 Processable tasks after BE Installation sequencing: ${processableTasks.length}`);
          processableTasks.forEach(task => {
            console.log(`  - ${task.TASK_NAME} (ID: ${task.ID}, Status: ${task.TASK_STATUS})`);
          });

          if (processableTasks.length > 0) {
            // Filter tasks based on dependencies
            // Create a list of all task names in this order
            const allTaskNames = tasks.map(t => t.TASK_NAME);
            
            const tasksReadyToProcess = processableTasks.filter(task => {
              const dependenciesMet = areTaskDependenciesMet(task.TASK_NAME, this.completedTaskNames, taskConfig, allTaskNames);
              if (!dependenciesMet) {
                console.log(`⏸️ Task \"${task.TASK_NAME}\" has unmet dependencies`);
              }
              return dependenciesMet;
            });

            if (tasksReadyToProcess.length === 0) {
              console.log(`⏸️ No tasks ready to process (all waiting for dependencies)`);
              return;
            }

            // Sort tasks by priority (lower number = higher priority)
            const sortedTasks = tasksReadyToProcess.sort((a, b) => 
              getTaskPriority(a.TASK_NAME, taskConfig) - getTaskPriority(b.TASK_NAME, taskConfig)
            );

            console.log(`⚡ Starting to process ${sortedTasks.length} ready tasks (in priority order):`);
            sortedTasks.forEach((task, index) => {
              const priority = getTaskPriority(task.TASK_NAME, taskConfig);
              const sequencing = taskConfig.taskSequencing?.[task.TASK_NAME];
              const delayAfter = sequencing?.delayAfter || 0;
              const waitFor = sequencing?.waitForCompletion || false;
              console.log(`  ${index + 1}. ${task.TASK_NAME} (Priority: ${priority}, DelayAfter: ${delayAfter}s, WaitForCompletion: ${waitFor})`);
            });

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
                
                // Skip tasks that are not in the completable list
                if (!isInCompletableList) {
                  console.log(`⏭️ Skipping task "${task.TASK_NAME}" - not in Task Configuration Manager list`);
                  continue;
                }
                
                console.log(`🚀 Processing configured task: ${task.TASK_NAME} (Status: ${task.TASK_STATUS})`);
                
                try {
                  console.log(`🔧 About to call processCompleteTask for: ${task.TASK_NAME}`);
                  const success = await this.processCompleteTask(task, orderForm, taskConfig);
                  console.log(`📊 processCompleteTask result for ${task.TASK_NAME}: ${success}`);
                  
                  if (success) {
                    completedTasks++;
                    this.completedTaskNames.push(task.TASK_NAME); // Add to completed list
                    console.log(`✅ Successfully completed configured task: ${task.TASK_NAME}`);
                    
                    // Check if this task should block further processing
                    const hasWaitForCompletion = shouldWaitForTask(task.TASK_NAME, taskConfig);
                    const delayAfterMs = getDelayAfterTask(task.TASK_NAME, taskConfig);
                    console.log(`🔍 Post-completion check for "${task.TASK_NAME}": waitForCompletion=${hasWaitForCompletion}, delayAfter=${delayAfterMs / 1000}s`);
                    
                    if (hasWaitForCompletion) {
                      this.waitingForTask = task.TASK_NAME;
                      console.log(`⏸️ Task \"${task.TASK_NAME}\" requires waiting for completion before processing others`);
                      
                      // Check for delay after this task
                      if (delayAfterMs > 0) {
                        console.log(`⏳ Waiting ${delayAfterMs / 1000} seconds after \"${task.TASK_NAME}\" completion...`);
                        await flightDeckApiService.delay(delayAfterMs);
                        console.log(`✅ Delay of ${delayAfterMs / 1000} seconds completed, ready for next processing cycle`);
                        this.waitingForTask = null; // Clear wait flag after delay
                      }
                      
                      console.log(`🛑 Exiting processing cycle due to waitForCompletion=true`);
                      return; // Stop processing other tasks in this cycle
                    }
                    
                    // Check for delay after this task (if not a blocking task)
                    // With delayAfter: wait BEFORE processing next task in THIS cycle (don't exit)
                    if (delayAfterMs > 0) {
                      console.log(`⏳ Waiting ${delayAfterMs / 1000} seconds after \"${task.TASK_NAME}\" completion before processing next task in this cycle...`);
                      await flightDeckApiService.delay(delayAfterMs);
                      console.log(`✅ Delay of ${delayAfterMs / 1000} seconds completed - continuing to next task in this cycle`);
                      // Do NOT return here - continue to next task in the for loop
                    } else {
                      console.log(`➡️ No delay configured, continuing to next task in this cycle...`);
                    }
                  } else {
                    console.log(`❌ Failed to complete configured task: ${task.TASK_NAME}`);
                  }
                } catch (error) {
                  console.error(`💥 Exception in processCompleteTask for ${task.TASK_NAME}:`, error);
                }
              } else {
                console.log(`⏭️ Skipping task: ${task.TASK_NAME} (Status: ${task.TASK_STATUS}) - not completable by status`);
              }
            }
          }
        } else {
          console.log('⏸️ No processable (ready/assigned/created) tasks found');
        }

        // Process failed tasks for retry (ALWAYS check, even if no processable tasks)
        console.log(`🔍 Checking for failed tasks to retry...`);
        const allFailedTasks = tasks.filter(t => t.TASK_STATUS.toLowerCase() === 'failed');
        console.log(`Found ${allFailedTasks.length} failed tasks total:`, allFailedTasks.map(t => `${t.TASK_NAME} (${t.TASK_STATUS})`));
        
        const currentFailedTasks = allFailedTasks.filter(t => 
          shouldRetryTask(t.TASK_NAME, taskConfig)
        );
        console.log(`Found ${currentFailedTasks.length} retryable failed tasks:`, currentFailedTasks.map(t => `${t.TASK_NAME} (ID: ${t.ID})`));

        // Sort failed tasks by ID (descending) to retry latest failed tasks first
        const sortedFailedTasks = [...currentFailedTasks].sort((a, b) => {
          // Assuming higher task ID = more recent task
          const idA = parseInt(a.ID) || 0;
          const idB = parseInt(b.ID) || 0;
          return idB - idA; // Descending order (latest first)
        });
        
        if (sortedFailedTasks.length > 0) {
          console.log(`📊 Retry order (latest first):`, sortedFailedTasks.map(t => `${t.TASK_NAME} (ID: ${t.ID})`));
        }

        for (const task of sortedFailedTasks) {
          if (!this.isProcessing) break;

          console.log(`🔄 Checking retry for failed task: ${task.TASK_NAME} (ID: ${task.ID}, Ignorable: ${isIgnorableFailedTask(task.TASK_NAME)})`);
          if (!isIgnorableFailedTask(task.TASK_NAME)) {
            console.log(`🚀 Attempting to retry failed task: ${task.TASK_NAME}`);
            this.updateStatus({
              isProcessing: true,
              currentTask: `Retrying: ${task.TASK_NAME}`,
              totalTasks,
              completedTasks,
              failedTasks,
              lastUpdate: new Date(),
            });
            
            const success = await this.processRetryTask(task, orderForm, taskConfig);
            if (success) {
              console.log(`✅ Successfully retried task: ${task.TASK_NAME}`);
              // Remove from failed tasks if retry was successful
              failedTasks = failedTasks.filter(ft => ft.ID !== task.ID);
              completedTasks++;
            } else {
              console.log(`❌ Failed to retry task: ${task.TASK_NAME}`);
              // Add to failed tasks if not already present
              if (!failedTasks.find(ft => ft.ID === task.ID)) {
                failedTasks.push(task);
              }
            }
          } else {
            console.log(`⏭️ Skipping ignorable failed task: ${task.TASK_NAME}`);
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
          this.isCycleInProgress = false; // Release lock before stopping
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
      } finally {
        // Always release the lock when cycle completes
        this.isCycleInProgress = false;
        console.log('✅ Processing cycle completed - lock released');
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

    // If BE Installation task doesn't exist at all, process Confirm/Schedule immediately
    if (!beInstallationTask) {
      console.log('✅ BE Installation task not in task list - proceeding with Confirm/Schedule Activation immediately');
      return;
    }

    // If Confirm/Schedule doesn't exist, nothing to sequence
    if (!confirmScheduleTask) {
      console.log('BE Installation sequencing: Confirm/Schedule Activation not found');
      return;
    }

    // Both tasks exist - apply sequencing logic
    const beStatus = beInstallationTask.TASK_STATUS.toLowerCase();
    const confirmStatus = confirmScheduleTask.TASK_STATUS.toLowerCase();
    
    // Check if both are in processable states (created, ready, or assigned)
    const beProcessable = ['created', 'ready', 'assigned'].includes(beStatus);
    const confirmProcessable = ['created', 'ready', 'assigned'].includes(confirmStatus);
    
    console.log(`BE Installation processable: ${beProcessable}, Confirm/Schedule processable: ${confirmProcessable}`);
    
    // Only block Confirm/Schedule if BE Installation is ALSO processable (not completed yet)
    if (beProcessable && confirmProcessable) {
      console.log('BE Installation sequencing: Both tasks are processable, prioritizing BE Installation - removing Confirm/Schedule temporarily');
      const confirmIndex = tasks.findIndex(t => t.TASK_NAME === 'Confirm/Schedule Activation');
      if (confirmIndex > -1) {
        console.log('🚫 Removing Confirm/Schedule Activation - will process after BE Installation completes');
        tasks.splice(confirmIndex, 1);
      }
    } else if (!beProcessable && confirmProcessable) {
      // BE Installation is completed or in a final state, check if 3-minute wait has passed
      if (this.beInstallationCompletedTime) {
        const timeSinceCompletion = Date.now() - this.beInstallationCompletedTime.getTime();
        const threeMinutes = 3 * 60 * 1000; // 3 minutes in milliseconds
        
        if (timeSinceCompletion < threeMinutes) {
          const waitSeconds = Math.ceil((threeMinutes - timeSinceCompletion) / 1000);
          console.log(`BE Installation sequencing: Waiting ${waitSeconds}s before processing Confirm/Schedule Activation`);
          const confirmIndex = tasks.findIndex(t => t.TASK_NAME === 'Confirm/Schedule Activation');
          if (confirmIndex > -1) {
            console.log('🚫 Removing Confirm/Schedule Activation - waiting for 3-minute delay after BE Installation');
            tasks.splice(confirmIndex, 1);
          }
        } else {
          console.log('✅ BE Installation sequencing: 3-minute wait completed, Confirm/Schedule can now be processed');
        }
      } else {
        console.log('✅ BE Installation sequencing: BE Installation completed (no recent timestamp), proceeding with Confirm/Schedule');
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

        // Add delay before completion to allow data to propagate
        await flightDeckApiService.delay(2000);
        
        // Re-fetch task details to verify updated data
        console.log(`🔍 Re-fetching task details to verify field updates...`);
        const updatedDetailsResult = await flightDeckApiService.getTaskDetails(task.ID);
        
        if (!updatedDetailsResult.success || !updatedDetailsResult.data) {
          console.error('Failed to re-fetch task details after update:', updatedDetailsResult.error);
          return false;
        }
        
        const updatedTaskDetails = updatedDetailsResult.data;
        
        // Validate mandatory fields after update
        const validation = this.validateMandatoryFields(task.TASK_NAME, updatedTaskDetails, taskConfig);
        
        if (!validation.isValid) {
          console.error(`❌ Cannot complete task "${task.TASK_NAME}" - mandatory fields are not populated:`);
          console.error(`   Missing fields: ${validation.missingFields.join(', ')}`);
          console.error(`   Please check your Task Configuration settings and ensure field values are correctly mapped.`);
          return false;
        }
        
        console.log(`✅ All mandatory fields validated - proceeding with task completion`);
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
      console.log(`🔄 Starting retry process for task: ${task.TASK_NAME} (ID: ${task.ID})`);
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        console.log(`🔄 Retry attempt ${attempt}/${maxRetries} for task: ${task.TASK_NAME}`);

        // Get task details
        const detailsResult = await flightDeckApiService.getTaskDetails(task.ID);
        
        if (!detailsResult.success || !detailsResult.data) {
          console.error(`❌ Failed to get task details for retry (attempt ${attempt}):`, detailsResult.error);
          if (attempt < maxRetries) {
            console.log(`⏳ Waiting 10 seconds before next attempt...`);
            await flightDeckApiService.delay(10000);
            continue;
          } else {
            return false;
          }
        }

        const taskDetails = detailsResult.data;
        console.log(`📋 Task details retrieved for ${task.TASK_NAME}, preparing retry data...`);
        
        // Prepare task data with mandatory field checking
        const taskData = await this.prepareTaskData(taskDetails, orderForm, taskConfig);

        // Step 1: Enter field data if there are any updates needed
        if (taskData.needsUpdate && taskData.updatePayload) {
          console.log(`📝 Entering field data for task: ${task.TASK_NAME}`);
          console.log(`📤 Update payload:`, JSON.stringify(taskData.updatePayload, null, 2));
          const updateResult = await flightDeckApiService.updateTaskData(taskData.updatePayload);
          
          if (updateResult.success) {
            console.log(`✅ Field data entered successfully for task: ${task.TASK_NAME}`);
            console.log(`⏳ Waiting 15 seconds before retry action...`);
            await flightDeckApiService.delay(15000);
          } else {
            console.error(`❌ Failed to enter field data for task ${task.TASK_NAME}:`, updateResult.error);
            console.error(`❌ Update result details:`, JSON.stringify(updateResult, null, 2));
            // Don't continue if update fails - this is critical for retry
            console.log(`⚠️ Cannot proceed with retry without field data - will retry in next attempt`);
            if (attempt < maxRetries) {
              console.log(`⏳ Waiting 30 seconds before next attempt...`);
              await flightDeckApiService.delay(30000);
              continue; // Skip to next retry attempt
            }
            return false;
          }
        } else {
          console.log(`ℹ️ No field updates needed for task: ${task.TASK_NAME}, proceeding directly to retry`);
        }

        // Step 2: Perform retry action
        console.log(`📤 Sending retry request for task: ${task.TASK_NAME}`);
        console.log(`📤 Retry payload paramRequests count: ${taskData.completePayload?.paramRequests?.length || 0}`);
        const retryResult = await flightDeckApiService.retryTask(task.ID, taskData.completePayload);
        
        if (retryResult.success) {
          console.log(`✅ Retry action successful for task: ${task.TASK_NAME}`);
          console.log(`ℹ️ Task status changed to 'Created' - will be processed by FlightDeck workflow`);
          console.log(`⏳ Waiting 1 minute to allow task to be picked up by workflow...`);
          
          // Wait 1 minute to allow task to be picked up by workflow
          await flightDeckApiService.delay(60000);
          
          // Check task status - it should be in progress or completed
          console.log(`🔍 Checking task status after retry for: ${task.TASK_NAME}`);
          const statusCheck = await flightDeckApiService.getTaskDetails(task.ID);
          
          if (statusCheck.success && statusCheck.data) {
            const currentStatus = statusCheck.data.statusDetails.status.toLowerCase();
            console.log(`📊 Current status for ${task.TASK_NAME}: ${currentStatus}`);
            
            // Consider retry successful if task is no longer in failed status
            if (currentStatus === 'completed') {
              console.log(`🎉 Task ${task.TASK_NAME} completed successfully after retry`);
              return true;
            } else if (currentStatus === 'failed') {
              console.log(`❌ Task ${task.TASK_NAME} failed again after retry attempt ${attempt}`);
              if (attempt === maxRetries) {
                console.error(`❌ Task ${task.TASK_NAME} failed after ${maxRetries} retry attempts`);
                return false;
              }
              // Will retry again in next loop iteration
            } else if (currentStatus === 'in progress' || currentStatus === 'inprogress' || 
                       currentStatus === 'ready' || currentStatus === 'assigned' || currentStatus === 'created') {
              console.log(`✅ Task ${task.TASK_NAME} is now in '${currentStatus}' status - retry successful`);
              console.log(`ℹ️ Task will continue processing in FlightDeck workflow`);
              return true;
            } else {
              console.log(`⚠️ Task ${task.TASK_NAME} is in unexpected status: ${currentStatus}`);
              // Consider it successful if not failed
              return true;
            }
          } else {
            console.error(`❌ Failed to check status for task ${task.TASK_NAME}:`, statusCheck.error);
            // Assume retry was successful since the retry API call succeeded
            console.log(`ℹ️ Retry API succeeded, assuming task will process correctly`);
            return true;
          }
          
        } else {
          console.error(`❌ Retry API call failed for ${task.TASK_NAME} (attempt ${attempt}):`, retryResult.error);
          console.error(`❌ Retry result details:`, JSON.stringify(retryResult, null, 2));
          
          // If retry API fails, wait and try again
          if (attempt < maxRetries) {
            console.log(`⏳ Waiting 30 seconds before retry attempt ${attempt + 1}...`);
            await flightDeckApiService.delay(30000);
          }
        }

        // Wait before next retry
        if (attempt < maxRetries) {
          console.log(`⏳ Waiting 10 seconds before retry attempt ${attempt + 1}...`);
          await flightDeckApiService.delay(10000);
        }
      }

      console.error(`❌ Task ${task.TASK_NAME} failed after all ${maxRetries} retry attempts`);
      return false;

    } catch (error) {
      console.error(`Error processing retry task ${task.TASK_NAME}:`, error);
      return false;
    }
  }

  /**
   * Converts workgroup string to workgroupList format expected by API
   */
  private static formatWorkgroupList(workgroup: any): any[] {
    if (Array.isArray(workgroup)) {
      return workgroup;
    }
    
    if (typeof workgroup === 'string' && workgroup.trim()) {
      // Try to parse as JSON first (in case it's a JSON string)
      try {
        const parsed = JSON.parse(workgroup);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        // Not JSON, treat as workgroup name
      }
      
      // Create workgroup object from string
      return [{
        workgroupId: '', // We may not have the ID
        workgroupName: workgroup.trim()
      }];
    }
    
    return [];
  }

  /**
   * Validates that all configured mandatory fields have non-null values
   * @returns Object with validation result and list of missing fields
   */
  private validateMandatoryFields(
    taskName: string,
    taskDetails: TaskDetails,
    taskConfig: TaskManagementConfig
  ): { isValid: boolean; missingFields: string[] } {
    const missingFields: string[] = [];
    const trimmedTaskName = taskName.trim();
    
    // Get configured field mappings for this task
    const fieldMappings = taskConfig.taskFieldMappings[trimmedTaskName];
    
    if (!fieldMappings) {
      // No mandatory fields configured, validation passes
      return { isValid: true, missingFields: [] };
    }
    
    console.log(`🔍 Validating mandatory fields for task: ${taskName}`);
    console.log(`📋 Configured field keys in task config:`, Object.keys(fieldMappings).join(', '));
    
    // Check each configured field
    for (const [fieldKey, fieldValue] of Object.entries(fieldMappings)) {
      console.log(`\n🔎 Checking configured field: "${fieldKey}"`);
      
      // Strip asterisk from field key if present (indicates mandatory field in config)
      const cleanFieldKey = fieldKey.replace(/\*$/, '');
      console.log(`   Clean field key (asterisk removed): "${cleanFieldKey}"`);
      
      // Find the actual field in task details by field name OR label
      let taskParam = taskDetails.taskInstParamRequestList.find(
        param => param.name === cleanFieldKey
      );
      
      if (!taskParam) {
        // Try finding by label
        taskParam = taskDetails.taskInstParamRequestList.find(
          param => param.jsonDescriptorObject?.label === cleanFieldKey
        );
        
        if (taskParam) {
          console.log(`   Found field by label match: "${cleanFieldKey}" → field name: "${taskParam.name}"`);
        }
      } else {
        console.log(`   Found field by name match: "${cleanFieldKey}"`);
      }
      
      if (!taskParam) {
        console.warn(`⚠️ Configured field "${cleanFieldKey}" not found in task details by name or label`);
        console.warn(`   Available field names:`, taskDetails.taskInstParamRequestList.slice(0, 5).map(p => p.name).join(', '), '...');
        console.warn(`   Available labels:`, taskDetails.taskInstParamRequestList.slice(0, 5).map(p => p.jsonDescriptorObject?.label).join(', '), '...');
        missingFields.push(cleanFieldKey);
        continue;
      }
      
      // Check if the field value is null, undefined, or empty string
      const currentValue = taskParam.value;
      const isEmptyOrNull = currentValue === null || 
                           currentValue === undefined || 
                           currentValue === '' ||
                           currentValue === 'null';
      
      if (isEmptyOrNull) {
        const fieldLabel = taskParam.jsonDescriptorObject?.label || cleanFieldKey;
        console.error(`❌ Mandatory field "${fieldLabel}" (name: ${taskParam.name}) has no value (current: ${currentValue})`);
        missingFields.push(fieldLabel);
      } else {
        console.log(`✅ Mandatory field "${cleanFieldKey}" (name: ${taskParam.name}) has value: ${currentValue}`);
      }
    }
    
    const isValid = missingFields.length === 0;
    
    if (!isValid) {
      console.error(`\n❌ Validation FAILED - ${missingFields.length} mandatory field(s) missing values:`, missingFields.join(', '));
      console.error(`💡 This likely means:`);
      console.error(`   1. The field names in your Task Config don't match FlightDeck field names/labels`);
      console.error(`   2. The field values weren't set during the update step`);
      console.error(`   3. The field mapping logic couldn't find the configured field`);
    } else {
      console.log(`\n✅ All mandatory fields validated successfully for ${taskName}`);
    }
    
    return { isValid, missingFields };
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
    const trimmedTaskName = taskName.trim();
    
    console.log(`📋 Preparing task data for: ${taskName}`);
    
    // Check if task has configured field mappings in task config table
    const hasFieldMappings = !!taskConfig.taskFieldMappings[trimmedTaskName];
    
    if (hasFieldMappings) {
      console.log(`📝 Task ${taskName} has configured field mappings - will feed data from task config table`);
    } else {
      console.log(`🔧 Task ${taskName} has no configured field mappings - will proceed without field updates`);
    }
    
    const needsUpdate = hasFieldMappings;
    
    let updatePayload: any = null;
    let completePayload = {
      assignCuid: orderForm.userCuid || orderForm.userName || 'AVIATOR',
      workgroupList: TaskProcessor.formatWorkgroupList(taskDetails.workgroupList || orderForm.workgroup),
      paramRequests: [] as any[],
    };

    if (needsUpdate) {
      // Prepare update payload with required field values
      const taskInstParamRequestList: any[] = [];
      
      console.log(`🔍 Processing ${taskDetails.taskInstParamRequestList.length} fields for update payload`);
      console.log(`📋 Configured field mappings:`, Object.keys(taskConfig.taskFieldMappings[trimmedTaskName]).join(', '));
      
      for (const param of taskDetails.taskInstParamRequestList) {
        // Try to get field value by field name first, then by label
        let fieldValue = getTaskFieldValue(taskName, param.name, taskConfig, orderForm, taskDetails);
        
        // If no value found by field name, try by label
        if (!fieldValue && param.jsonDescriptorObject?.label) {
          fieldValue = getTaskFieldValue(taskName, param.jsonDescriptorObject.label, taskConfig, orderForm, taskDetails);
          if (fieldValue) {
            console.log(`🏷️ Found value for field '${param.name}' via label '${param.jsonDescriptorObject.label}': ${fieldValue}`);
          }
        }
        
        if (fieldValue) {
          console.log(`✅ Setting field '${param.name}' (label: '${param.jsonDescriptorObject?.label}') to '${fieldValue}' for update`);
          taskInstParamRequestList.push({
            ...param,
            value: fieldValue,
          });
        } else {
          // Log warning if this field is in the configured mappings but no value was found
          const isConfigured = taskConfig.taskFieldMappings[trimmedTaskName][param.name] || 
                              (param.jsonDescriptorObject?.label && taskConfig.taskFieldMappings[trimmedTaskName][param.jsonDescriptorObject.label]);
          
          if (isConfigured) {
            console.warn(`⚠️ Field '${param.name}' (label: '${param.jsonDescriptorObject?.label}') is configured but getTaskFieldValue returned empty`);
            console.warn(`   Configured value:`, taskConfig.taskFieldMappings[trimmedTaskName][param.name] || taskConfig.taskFieldMappings[trimmedTaskName][param.jsonDescriptorObject?.label || '']);
          } else {
            console.log(`⏭️ No configured value for field '${param.name}' (label: '${param.jsonDescriptorObject?.label}'), keeping existing value: ${param.value}`);
          }
          
          taskInstParamRequestList.push(param);
        }
      }

      console.log(`📊 Update payload will include ${taskInstParamRequestList.length} fields`);
      console.log(`📋 Fields with configured values:`, taskInstParamRequestList
        .filter(p => p.value)
        .map(p => `${p.name}=${p.value}`)
        .join(', '));

      updatePayload = {
        id: taskDetails.id,
        lockCounter: 0,
        sourceTaskId: taskDetails.sourceTaskId,
        description: taskDetails.description,
        sourceSystemName: 'AUTOPILOT',
        taskName: taskDetails.taskName,
        escalated: 'N',
        assignedCuid: taskDetails.assignedCuid || orderForm.userCuid || orderForm.userName || 'AUTOPILOT',
        assignedUserName: taskDetails.assignedUserName || orderForm.userFullName || orderForm.userName || 'AUTOPILOT',
        createdById: 'AUTOPILOT',
        createdByName: 'AUTOPILOT',
        workgroupList: TaskProcessor.formatWorkgroupList(taskDetails.workgroupList || orderForm.workgroup),
        statusDetails: taskDetails.statusDetails,
        taskInstParamRequestList,
      };
      
      console.log(`📋 Update payload for ${taskName}:`, {
        workgroupList: updatePayload.workgroupList,
        assignedCuid: updatePayload.assignedCuid,
        assignedUserName: updatePayload.assignedUserName,
        userCuid: orderForm.userCuid,
        userFullName: orderForm.userFullName
      });
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
      } else if (taskConfig.taskFieldMappings[trimmedTaskName]) {
        // Fallback to configured values for mapped tasks
        const fieldValue = getTaskFieldValue(taskName, param.name, taskConfig, orderForm, taskDetails);
        
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
    this.completedTaskNames = []; // Reset completed tasks
    this.waitingForTask = null; // Reset waiting flag
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
   * Now runs continuously until user manually stops
   */
  private shouldStopProcessing(tasks: Task[], sendCompletionDetailsCompleted: boolean, activationCompleteCompleted: boolean): { stop: boolean; reason: string } {
    // Count tasks by status
    const tasksByStatus = {
      ready: tasks.filter(t => t.TASK_STATUS.toLowerCase() === 'ready').length,
      assigned: tasks.filter(t => t.TASK_STATUS.toLowerCase() === 'assigned').length,
      created: tasks.filter(t => t.TASK_STATUS.toLowerCase() === 'created').length,
      inProgress: tasks.filter(t => t.TASK_STATUS.toLowerCase() === 'in-progress').length,
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
      inProgress: tasksByStatus.inProgress,
      completed: tasksByStatus.completed,
      failed: tasksByStatus.failed,
      cancelled: tasksByStatus.cancelled,
    });

    // Continue processing if there are still processable tasks
    if (processableTasks > 0) {
      console.log(`✅ Continuing processing - ${processableTasks} processable task(s) remaining`);
      return { stop: false, reason: '' };
    }

    // Continue if there are In-Progress tasks (they will spawn new Ready tasks)
    if (tasksByStatus.inProgress > 0) {
      console.log(`⏳ Waiting for In-Progress tasks to complete - ${tasksByStatus.inProgress} task(s) still processing`);
      return { stop: false, reason: '' };
    }

    // Keep running continuously - only user can stop
    // Just wait for new tasks to appear
    console.log(`🔄 No processable tasks at the moment - waiting for new tasks...`);
    return { stop: false, reason: '' };
  }

  isCurrentlyProcessing(): boolean {
    return this.isProcessing;
  }
}

export default TaskProcessor;
