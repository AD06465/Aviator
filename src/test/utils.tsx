/**
 * Test Utilities
 * Helper functions for testing
 */

import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AppProviders } from '@/core/providers/AppProviders';

interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  return <AppProviders>{children}</AppProviders>;
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
