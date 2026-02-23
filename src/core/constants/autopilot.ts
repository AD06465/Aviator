import { AutopilotEnvironment } from '@/types';

export const AUTOPILOT_ENVIRONMENTS: AutopilotEnvironment[] = [
  {
    name: 'Test 1',
    baseUrl: 'https://usddclvapapp011-test.corp.intranet:3443',
    loginUrl: 'https://usddclvapapp011-test.corp.intranet:3443/login',
  },
  {
    name: 'Test 2',
    baseUrl: 'https://usddclvapapp021-test.corp.intranet:3443',
    loginUrl: 'https://usddclvapapp021-test.corp.intranet:3443/login',
  },
  {
    name: 'Test 4',
    baseUrl: 'https://usddclvapapp041-test.corp.intranet:3443',
    loginUrl: 'https://usddclvapapp041-test.corp.intranet:3443/login',
  },
];

export const AUTOPILOT_WORKFLOW_STATUSES = [
  'running',
  'complete',
  'canceled',
  'paused',
  'error',
] as const;

export const AUTOPILOT_REFRESH_INTERVAL = 60000; // 60 seconds (1 minute) - API responses take 60+ seconds
