export interface CaptureLog {
  id: number;
  sourceService: string | null;
  targetUrl: string | null;
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

export interface CreateCaptureInput {
  sourceService?: string | null;
  targetUrl?: string | null;
  method: string;
  path: string;
  query?: unknown;
  requestHeaders?: unknown;
  requestBody?: unknown;
  responseHeaders?: unknown;
  responseBody?: unknown;
  statusCode: number;
  durationMs: number;
  errorMessage?: string | null;
}

export interface CreateCaptureLogInput {
  sourceService: string | null;
  targetUrl: string | null;
  method: string;
  path: string;
  query: unknown;
  requestHeaders: unknown;
  requestBody: unknown;
  responseHeaders: unknown;
  responseBody: unknown;
  statusCode: number;
  durationMs: number;
  errorMessage: string | null;
}
