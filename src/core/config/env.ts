/**
 * Environment Variables Helper
 * Type-safe access to environment variables
 */

export const env = {
  // App Info
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'AVIATOR',
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  appEnv: process.env.NEXT_PUBLIC_APP_ENV || 'development',

  // Logging
  logLevel: parseInt(process.env.NEXT_PUBLIC_LOG_LEVEL || '1'),

  // API Configuration
  apiTimeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
  retryAttempts: parseInt(process.env.NEXT_PUBLIC_RETRY_ATTEMPTS || '3'),
  monitoringInterval: parseInt(process.env.NEXT_PUBLIC_MONITORING_INTERVAL || '30000'),

  // Feature Flags
  features: {
    autoRetry: process.env.NEXT_PUBLIC_FEATURE_AUTO_RETRY === 'true',
    parallelProcessing: process.env.NEXT_PUBLIC_FEATURE_PARALLEL_PROCESSING === 'true',
    advancedLogging: process.env.NEXT_PUBLIC_FEATURE_ADVANCED_LOGGING === 'true',
    errorReporting: process.env.NEXT_PUBLIC_FEATURE_ERROR_REPORTING === 'true',
  },

  // Defaults
  defaultEnvironment: process.env.NEXT_PUBLIC_DEFAULT_ENVIRONMENT || 'Test 1',
  storagePrefix: process.env.NEXT_PUBLIC_STORAGE_PREFIX || 'aviator',

  // Helper to check if we're in development
  isDevelopment: process.env.NEXT_PUBLIC_APP_ENV === 'development' || process.env.NODE_ENV === 'development',
  isProduction: process.env.NEXT_PUBLIC_APP_ENV === 'production' || process.env.NODE_ENV === 'production',
} as const;
