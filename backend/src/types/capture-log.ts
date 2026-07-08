export interface CaptureLog {
  id: number;
  method: string;
  path: string;
  query: Record<string, unknown>;
  requestHeaders: Record<string, unknown>;
  requestBody: unknown;
  responseHeaders: Record<string, unknown>;
  responseBody: unknown;
  statusCode: number;
  durationMs: number;
  errorMessage: string | null;
  createdAt: Date;
}

export interface CreateCaptureLogInput {
  method: string;
  path: string;
  query: Record<string, unknown>;
  requestHeaders: Record<string, unknown>;
  requestBody: unknown;
  responseHeaders: Record<string, unknown>;
  responseBody: unknown;
  statusCode: number;
  durationMs: number;
  errorMessage: string | null;
}
