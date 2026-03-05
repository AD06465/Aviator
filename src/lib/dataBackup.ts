/**
 * Data Backup and Persistence Manager
 * 
 * This module handles automatic backups of critical application data
 * to ensure data is never lost across sessions or code changes.
 */

import { logger } from '@/services/logging';

export interface BackupData {
  timestamp: string;
  version: string;
  devices: any[];
  taskConfig: any;
  customAttributes?: any;
}

export interface BackupMetadata {
  lastBackupTime: string;
  backupCount: number;
  autoBackupEnabled: boolean;
}

const BACKUP_STORAGE_KEY = 'aviator_backup_data';
const BACKUP_METADATA_KEY = 'aviator_backup_metadata';
const DEVICES_STORAGE_KEY = 'aviator_devices';
const TASK_CONFIG_STORAGE_KEY = 'aviator-task-config';
const CUSTOM_ATTRIBUTES_KEY = 'aviator-custom-attributes';
const BACKUP_VERSION = '1.0.0';

export class DataBackupManager {
  /**
   * Create a complete backup of all application data
   */
  static createBackup(): BackupData {
    const devicesData = localStorage.getItem(DEVICES_STORAGE_KEY);
    const taskConfigData = localStorage.getItem(TASK_CONFIG_STORAGE_KEY);
    const customAttributesData = localStorage.getItem(CUSTOM_ATTRIBUTES_KEY);

    const backup: BackupData = {
      timestamp: new Date().toISOString(),
      version: BACKUP_VERSION,
      devices: devicesData ? JSON.parse(devicesData) : [],
      taskConfig: taskConfigData ? JSON.parse(taskConfigData) : null,
      customAttributes: customAttributesData ? JSON.parse(customAttributesData) : null,
    };

    // Store backup in localStorage
    localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(backup));

    // Update metadata
    this.updateBackupMetadata();

    // Log detailed backup info
    const workflowCount = backup.customAttributes?.itentialWorkflows?.length || 0;
    const productCount = backup.customAttributes?.productNames?.length || 0;
    
    logger.info('Data backup created', {
      component: 'DataBackupManager',
      timestamp: backup.timestamp,
      deviceCount: backup.devices.length,
      hasTaskConfig: !!backup.taskConfig,
      hasCustomAttributes: !!backup.customAttributes,
      workflowNamesCount: workflowCount,
      productNamesCount: productCount,
    });
    
    console.log('✅ Backup created with:', {
      devices: backup.devices.length,
      workflows: workflowCount,
      productNames: productCount,
      taskConfigs: backup.taskConfig?.completableTasks?.length || 0
    });

    return backup;
  }

  /**
   * Restore data from the latest backup
   */
  static restoreFromBackup(): boolean {
    try {
      const backupData = localStorage.getItem(BACKUP_STORAGE_KEY);
      
      if (!backupData) {
        logger.warn('No backup data found to restore', {
          component: 'DataBackupManager',
        });
        return false;
      }

      const backup: BackupData = JSON.parse(backupData);

      // Restore devices
      if (backup.devices && backup.devices.length > 0) {
        localStorage.setItem(DEVICES_STORAGE_KEY, JSON.stringify(backup.devices));
        logger.info('Devices restored from backup', {
          component: 'DataBackupManager',
          deviceCount: backup.devices.length,
        });
      }

      // Restore task configuration
      if (backup.taskConfig) {
        localStorage.setItem(TASK_CONFIG_STORAGE_KEY, JSON.stringify(backup.taskConfig));
        logger.info('Task configuration restored from backup', {
          component: 'DataBackupManager',
        });
      }

      // Restore custom attributes (workflows and product names)
      if (backup.customAttributes) {
        localStorage.setItem(CUSTOM_ATTRIBUTES_KEY, JSON.stringify(backup.customAttributes));
        const workflowCount = backup.customAttributes.itentialWorkflows?.length || 0;
        const productCount = backup.customAttributes.productNames?.length || 0;
        logger.info('Custom attributes restored from backup', {
          component: 'DataBackupManager',
          workflowNamesCount: workflowCount,
          productNamesCount: productCount,
        });
        console.log('✅ Restored custom attributes:', {
          workflows: workflowCount,
          productNames: productCount
        });
      }

      return true;
    } catch (error) {
      logger.error('Failed to restore from backup', {
        component: 'DataBackupManager',
      }, error as Error);
      return false;
    }
  }

  /**
   * Export backup to a downloadable JSON file
   */
  static exportBackupToFile(): void {
    const backup = this.createBackup();
    
    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aviator-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    logger.info('Backup exported to file', {
      component: 'DataBackupManager',
      filename: link.download,
    });
  }

  /**
   * Import backup from a JSON file
   */
  static async importBackupFromFile(file: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const backup: BackupData = JSON.parse(e.target?.result as string);
          
          // Validate backup structure
          if (!backup.timestamp || !backup.version) {
            throw new Error('Invalid backup file structure');
          }

          // Store the backup
          localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(backup));

          // Restore the data
          const restored = this.restoreFromBackup();
          
          if (restored) {
            logger.info('Backup imported and restored successfully', {
              component: 'DataBackupManager',
              backupTimestamp: backup.timestamp,
            });
            resolve(true);
          } else {
            reject(new Error('Failed to restore backup after import'));
          }
        } catch (error) {
          logger.error('Failed to import backup file', {
            component: 'DataBackupManager',
          }, error as Error);
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read backup file'));
      };

      reader.readAsText(file);
    });
  }

  /**
   * Update backup metadata
   */
  private static updateBackupMetadata(): void {
    const existingMetadata = localStorage.getItem(BACKUP_METADATA_KEY);
    let metadata: BackupMetadata;

    if (existingMetadata) {
      metadata = JSON.parse(existingMetadata);
      metadata.backupCount += 1;
    } else {
      metadata = {
        lastBackupTime: new Date().toISOString(),
        backupCount: 1,
        autoBackupEnabled: true,
      };
    }

    metadata.lastBackupTime = new Date().toISOString();
    localStorage.setItem(BACKUP_METADATA_KEY, JSON.stringify(metadata));
  }

  /**
   * Get backup metadata
   */
  static getBackupMetadata(): BackupMetadata | null {
    const metadataStr = localStorage.getItem(BACKUP_METADATA_KEY);
    return metadataStr ? JSON.parse(metadataStr) : null;
  }

  /**
   * Get the latest backup
   */
  static getLatestBackup(): BackupData | null {
    const backupStr = localStorage.getItem(BACKUP_STORAGE_KEY);
    return backupStr ? JSON.parse(backupStr) : null;
  }

  /**
   * Enable or disable automatic backups
   */
  static setAutoBackupEnabled(enabled: boolean): void {
    const metadata = this.getBackupMetadata() || {
      lastBackupTime: new Date().toISOString(),
      backupCount: 0,
      autoBackupEnabled: enabled,
    };

    metadata.autoBackupEnabled = enabled;
    localStorage.setItem(BACKUP_METADATA_KEY, JSON.stringify(metadata));

    logger.info('Auto-backup setting updated', {
      component: 'DataBackupManager',
      enabled,
    });
  }

  /**
   * Check if auto-backup is enabled
   */
  static isAutoBackupEnabled(): boolean {
    const metadata = this.getBackupMetadata();
    return metadata?.autoBackupEnabled ?? true;
  }

  /**
   * Initialize auto-backup system
   * This should be called when the application starts
   */
  static initializeAutoBackup(): void {
    // Create initial backup
    this.createBackup();

    // Set up periodic backups (every 5 minutes)
    if (typeof window !== 'undefined' && this.isAutoBackupEnabled()) {
      setInterval(() => {
        if (this.isAutoBackupEnabled()) {
          this.createBackup();
          logger.info('Automatic backup completed', {
            component: 'DataBackupManager',
          });
        }
      }, 5 * 60 * 1000); // 5 minutes

      logger.info('Auto-backup system initialized', {
        component: 'DataBackupManager',
      });
    }
  }

  /**
   * Create a complete data snapshot for debugging
   */
  static createDataSnapshot(): any {
    return {
      timestamp: new Date().toISOString(),
      localStorage: {
        devices: localStorage.getItem(DEVICES_STORAGE_KEY),
        taskConfig: localStorage.getItem(TASK_CONFIG_STORAGE_KEY),
        backup: localStorage.getItem(BACKUP_STORAGE_KEY),
        metadata: localStorage.getItem(BACKUP_METADATA_KEY),
      },
      sizes: {
        devicesSize: localStorage.getItem(DEVICES_STORAGE_KEY)?.length || 0,
        taskConfigSize: localStorage.getItem(TASK_CONFIG_STORAGE_KEY)?.length || 0,
        backupSize: localStorage.getItem(BACKUP_STORAGE_KEY)?.length || 0,
      },
    };
  }

  /**
   * Verify data integrity
   */
  static verifyDataIntegrity(): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];

    // Check if critical data exists
    const devicesData = localStorage.getItem(DEVICES_STORAGE_KEY);
    const taskConfigData = localStorage.getItem(TASK_CONFIG_STORAGE_KEY);

    if (!devicesData) {
      issues.push('Devices data is missing');
    } else {
      try {
        JSON.parse(devicesData);
      } catch {
        issues.push('Devices data is corrupted');
      }
    }

    if (!taskConfigData) {
      issues.push('Task configuration data is missing');
    } else {
      try {
        JSON.parse(taskConfigData);
      } catch {
        issues.push('Task configuration data is corrupted');
      }
    }

    // Check backup
    const backupData = localStorage.getItem(BACKUP_STORAGE_KEY);
    if (!backupData) {
      issues.push('No backup exists');
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  }
}
