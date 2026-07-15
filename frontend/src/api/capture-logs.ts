import {
  ApiResponse,
  CaptureLogDetail,
  CaptureLogListItem,
  CaptureLogNotFoundError,
} from "../types/capture-log";

export async function fetchCaptureLogs(): Promise<CaptureLogListItem[]> {
  const response = await fetch("/api/captures");

  if (!response.ok) {
    throw new Error("Capture Log API request failed.");
  }

  const body = (await response.json()) as ApiResponse<CaptureLogListItem[]>;

  if (!body.success) {
    throw new Error(body.failResponse?.message ?? "Capture Log API failed.");
  }

  return body.data;
}

export async function fetchCaptureLogById(
  id: string,
): Promise<CaptureLogDetail> {
  const response = await fetch(`/api/captures/${id}`);

  if (response.status === 404) {
    throw new CaptureLogNotFoundError();
  }

  if (!response.ok) {
    throw new Error("Capture Log API request failed.");
  }

  const body = (await response.json()) as ApiResponse<CaptureLogDetail>;

  if (!body.success) {
    if (body.failResponse?.code === "CAPTURE_NOT_FOUND") {
      throw new CaptureLogNotFoundError();
    }

    throw new Error(body.failResponse?.message ?? "Capture Log API failed.");
  }

  return body.data;
}
