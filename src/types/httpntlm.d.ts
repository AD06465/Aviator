declare module 'httpntlm' {
  export interface HttpNtlmOptions {
    url: string;
    username: string;
    password: string;
    workstation: string;
    domain: string;
    qs?: any;
  }

  export function get(
    options: HttpNtlmOptions,
    callback: (err: any, res: any) => void
  ): void;

  export function post(
    options: HttpNtlmOptions,
    callback: (err: any, res: any) => void
  ): void;
}
