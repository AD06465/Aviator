/**
 * Environment Configuration Constants
 * Centralized environment definitions for FlightDeck environments
 */

export interface Environment {
  name: string;
  apiUrl: string;
  flightdeckUrl: string;
}

export const ENVIRONMENTS: readonly Environment[] = [
  {
    name: 'Test 1',
    apiUrl: 'https://workmate-svc-test1.rke-odc-test.corp.intranet',
    flightdeckUrl: 'https://flightdeck-ui-test1.rke-odc-test.corp.intrane/#/auth/login',
  },
  {
    name: 'Test 2',
    apiUrl: 'https://workmate-svc-test4.rke-odc-test.corp.intranet',
    flightdeckUrl: 'https://flightdeck-ui-test4.rke-odc-test.corp.intranet/#/auth/login',
  },
  {
    name: 'Test 4',
    apiUrl: 'https://workmate-svc-test2.rke-odc-test.corp.intranet',
    flightdeckUrl: 'https://flightdeck-ui-test2.rke-odc-test.corp.intranet/#/auth/login',
  },
] as const;

export const DEFAULT_ENVIRONMENT = ENVIRONMENTS[0];
