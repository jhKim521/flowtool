import { ApiResponse, CaptureLogListItem } from "../types/capture-log";

export async function fetchCaptureLogs(): Promise<CaptureLogListItem[]> {
  const response = await fetch("/capture-logs");

  if (!response.ok) {
    throw new Error("Capture Log API request failed.");
  }

  const body = (await response.json()) as ApiResponse<CaptureLogListItem[]>;

  if (!body.success) {
    throw new Error(body.failResponse?.message ?? "Capture Log API failed.");
  }

  return body.data;
}
