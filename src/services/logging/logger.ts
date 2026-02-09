/**
 * Centralized Logging Service
 * Provides structured logging with different log levels and context
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4,
}

export interface LogContext {
  component?: string;
  feature?: string;
  userId?: string;
  orderId?: string;
  taskId?: string | number;
  [key: string]: any;
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: Error;
  stack?: string;
}

class LoggerService {
  private static instance: LoggerService;
  private logLevel: LogLevel = LogLevel.INFO;
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;
  private listeners: Set<(entry: LogEntry) => void> = new Set();

  private constructor() {
    // Set log level from environment or default to INFO
    if (typeof window !== 'undefined') {
      const envLogLevel = localStorage.getItem('aviator-log-level');
      if (envLogLevel) {
        this.logLevel = parseInt(envLogLevel) as LogLevel;
      }
    }
  }

  static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
    if (typeof window !== 'undefined') {
      localStorage.setItem('aviator-log-level', level.toString());
    }
  }

  getLogLevel(): LogLevel {
    return this.logLevel;
  }

  subscribe(listener: (entry: LogEntry) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private log(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
    if (level < this.logLevel) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context,
      error,
      stack: error?.stack,
    };

    // Add to logs array
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift(); // Remove oldest log
    }

    // Notify listeners
    this.listeners.forEach(listener => {
      try {
        listener(entry);
      } catch (err) {
        console.error('Error in log listener:', err);
      }
    });

    // Console output with formatting
    this.consoleOutput(entry);
  }

  private consoleOutput(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const levelStr = LogLevel[entry.level];
    const contextStr = entry.context ? ` [${JSON.stringify(entry.context)}]` : '';
    const fullMessage = `[${timestamp}] ${levelStr}: ${entry.message}${contextStr}`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(fullMessage, entry.error);
        break;
      case LogLevel.INFO:
        console.info(fullMessage, entry.error);
        break;
      case LogLevel.WARN:
        console.warn(fullMessage, entry.error);
        break;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        console.error(fullMessage, entry.error);
        if (entry.stack) {
          console.error(entry.stack);
        }
        break;
    }
  }

  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: LogContext, error?: Error): void {
    this.log(LogLevel.WARN, message, context, error);
  }

  error(message: string, context?: LogContext, error?: Error): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  critical(message: string, context?: LogContext, error?: Error): void {
    this.log(LogLevel.CRITICAL, message, context, error);
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level === undefined) {
      return [...this.logs];
    }
    return this.logs.filter(log => log.level >= level);
  }

  clearLogs(): void {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  downloadLogs(): void {
    const logsJson = this.exportLogs();
    const blob = new Blob([logsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aviator-logs-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Export singleton instance
export const logger = LoggerService.getInstance();

// Helper function for creating feature loggers with context
export const createLogger = (defaultContext: LogContext) => ({
  debug: (message: string, context?: LogContext) => 
    logger.debug(message, { ...defaultContext, ...context }),
  info: (message: string, context?: LogContext) => 
    logger.info(message, { ...defaultContext, ...context }),
  warn: (message: string, context?: LogContext, error?: Error) => 
    logger.warn(message, { ...defaultContext, ...context }, error),
  error: (message: string, context?: LogContext, error?: Error) => 
    logger.error(message, { ...defaultContext, ...context }, error),
  critical: (message: string, context?: LogContext, error?: Error) => 
    logger.critical(message, { ...defaultContext, ...context }, error),
});
