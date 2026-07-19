export interface CaptureLogListItem {
  id: number;
  sourceService: string | null;
  targetUrl: string | null;
  method: string;
  path: string;
  responseStatus: number;
  durationMs: number;
  createdAt: string;
}

export interface CaptureLogDetail extends CaptureLogListItem {
  query: Record<string, unknown>;
  requestHeaders: Record<string, unknown>;
  requestBody: unknown;
  responseHeaders: Record<string, unknown>;
  responseBody: unknown;
  errorMessage: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  failResponse: {
    code: string;
    message: string;
  } | null;
}

export class CaptureLogNotFoundError extends Error {
  constructor() {
    super("Capture Log not found.");
    this.name = "CaptureLogNotFoundError";
  }
}
