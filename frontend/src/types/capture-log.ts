export interface CaptureLogListItem {
  id: number;
  method: string;
  path: string;
  responseStatus: number;
  durationMs: number;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  failResponse: {
    code: string;
    message: string;
  } | null;
}
