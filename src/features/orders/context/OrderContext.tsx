/**
 * Order Context
 * Centralized state management for order information
 */

'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { OrderForm as OrderFormType } from '@/types';
import { logger } from '@/services/logging';

interface OrderContextValue {
  currentOrder: OrderFormType | null;
  setCurrentOrder: (order: OrderFormType | null) => void;
  updateOrder: (updates: Partial<OrderFormType>) => void;
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [currentOrder, setCurrentOrderState] = useState<OrderFormType | null>(null);

  const setCurrentOrder = useCallback((order: OrderFormType | null) => {
    setCurrentOrderState(order);
    if (order) {
      logger.info('Current order set', { 
        component: 'OrderContext',
        orderId: order.orderNumber 
      });
    }
  }, []);

  const updateOrder = useCallback((updates: Partial<OrderFormType>) => {
    setCurrentOrderState(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      logger.debug('Order updated', { 
        component: 'OrderContext',
        updates: Object.keys(updates)
      });
      return updated;
    });
  }, []);

  const value: OrderContextValue = {
    currentOrder,
    setCurrentOrder,
    updateOrder,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrderContext = (): OrderContextValue => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrderContext must be used within an OrderProvider');
  }
  return context;
};
