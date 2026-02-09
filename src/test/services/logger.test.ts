/**
 * Example Test - Logger Service
 * Demonstrates testing patterns
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { logger, LogLevel } from '@/services/logging';

describe('Logger Service', () => {
  beforeEach(() => {
    logger.clearLogs();
  });

  it('should log messages at different levels', () => {
    logger.debug('Debug message');
    logger.info('Info message');
    logger.warn('Warn message');
    logger.error('Error message');

    const logs = logger.getLogs();
    expect(logs).toHaveLength(4);
  });

  it('should filter logs by level', () => {
    logger.debug('Debug');
    logger.info('Info');
    logger.warn('Warn');
    logger.error('Error');

    const errorLogs = logger.getLogs(LogLevel.ERROR);
    expect(errorLogs).toHaveLength(1);
    expect(errorLogs[0].message).toBe('Error');
  });

  it('should include context in log entries', () => {
    logger.info('Test message', { component: 'TestComponent', userId: '123' });

    const logs = logger.getLogs();
    expect(logs[0].context).toEqual({ component: 'TestComponent', userId: '123' });
  });

  it('should export logs as JSON', () => {
    logger.info('Test 1');
    logger.info('Test 2');

    const exported = logger.exportLogs();
    expect(exported).toBeTruthy();
    expect(() => JSON.parse(exported)).not.toThrow();
  });
});
