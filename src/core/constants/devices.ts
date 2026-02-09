/**
 * Device Constants
 * Default devices and workflow types
 */

export const DEFAULT_DEVICES: readonly string[] = [
  'LAB4COZWZG001',
  'LAB4COZWZG002',
  'LAB2COZEZG001',
  'LAB2COZEW2002',
  'LAB2COZEW2001',
  'LAB4COZW4M001',
  'LAB4COZW4M002',
  'LAB4COZW4R002',
  'LAB4COZW4L003',
  'LAB4COZWYJ001',
  'LAB4COZW5M001',
] as const;

export interface WorkflowType {
  name: string;
  value: string;
}

export const WORKFLOW_TYPES: readonly WorkflowType[] = [
  { name: 'Monarch Onnet', value: 'monarch_onnet' },
  { name: 'Monarch Offnet', value: 'monarch_offnet' },
  { name: 'Colorless', value: 'colorless' },
] as const;
