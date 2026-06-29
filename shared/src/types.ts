export const APP_VERSION = "0.1.0" as const;

export interface HealthResponse {
  ok: boolean;
  app: string;
  version: string;
  dbConnected: boolean;
  openaiKeyPresent: boolean;
}
