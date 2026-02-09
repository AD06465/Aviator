/**
 * App Providers
 * Combines all context providers
 */

'use client';

import React, { ReactNode, useEffect } from 'react';
import { TaskProvider } from '@/features/tasks/context/TaskContext';
import { OrderProvider } from '@/features/orders/context/OrderContext';
import { ConfigProvider } from '@/features/config/context/ConfigContext';
import { ErrorBoundary } from '@/shared/components';
import { DataBackupManager } from '@/lib/dataBackup';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  useEffect(() => {
    // Initialize auto-backup system when app starts
    DataBackupManager.initializeAutoBackup();
  }, []);

  return (
    <ErrorBoundary>
      <ConfigProvider>
        <OrderProvider>
          <TaskProvider>
            {children}
          </TaskProvider>
        </OrderProvider>
      </ConfigProvider>
    </ErrorBoundary>
  );
};
