/**
 * Application Configuration Service
 * Manages application-wide configuration with persistence
 */

import { logger } from '@/services/logging';

export interface AppConfig {
  version: string;
  logLevel: number;
  apiTimeout: number;
  retryAttempts: number;
  monitoringInterval: number;
  features: {
    autoRetry: boolean;
    parallelProcessing: boolean;
    advancedLogging: boolean;
  };
}

const DEFAULT_CONFIG: AppConfig = {
  version: '1.0.0',
  logLevel: 1, // INFO
  apiTimeout: 30000,
  retryAttempts: 3,
  monitoringInterval: 30000,
  features: {
    autoRetry: true,
    parallelProcessing: false,
    advancedLogging: true,
  },
};

class ConfigService {
  private static instance: ConfigService;
  private config: AppConfig;
  private readonly STORAGE_KEY = 'aviator-app-config';

  private constructor() {
    this.config = this.loadConfig();
  }

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  private loadConfig(): AppConfig {
    try {
      if (typeof window === 'undefined') {
        return DEFAULT_CONFIG;
      }

      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsedConfig = JSON.parse(stored);
        logger.info('Configuration loaded from storage', { 
          component: 'ConfigService',
          version: parsedConfig.version 
        });
        return { ...DEFAULT_CONFIG, ...parsedConfig };
      }
    } catch (error) {
      logger.error('Failed to load configuration', { component: 'ConfigService' }, error as Error);
    }

    return DEFAULT_CONFIG;
  }

  private saveConfig(): void {
    try {
      if (typeof window === 'undefined') {
        return;
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.config));
      logger.debug('Configuration saved to storage', { component: 'ConfigService' });
    } catch (error) {
      logger.error('Failed to save configuration', { component: 'ConfigService' }, error as Error);
    }
  }

  getConfig(): AppConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<AppConfig>): void {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
    logger.info('Configuration updated', { 
      component: 'ConfigService',
      updates: Object.keys(updates)
    });
  }

  resetConfig(): void {
    this.config = DEFAULT_CONFIG;
    this.saveConfig();
    logger.info('Configuration reset to defaults', { component: 'ConfigService' });
  }

  get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key];
  }

  set<K extends keyof AppConfig>(key: K, value: AppConfig[K]): void {
    this.config[key] = value;
    this.saveConfig();
  }
}

export const configService = ConfigService.getInstance();
