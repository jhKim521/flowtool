import {
  createCaptureLog,
  countCaptureLogs,
  findLatestCaptureLog,
  initializeCaptureLogTable,
} from "../repositories/capture-log.repository";
import {
  CaptureLog,
  CreateCaptureInput,
  CreateCaptureLogInput,
} from "../types/capture-log";

export async function initializeCaptureStorage(): Promise<void> {
  await initializeCaptureLogTable();
}

export async function saveCaptureLog(
  input: CreateCaptureInput,
): Promise<CaptureLog> {
  return createCaptureLog(toCreateCaptureLogInput(input));
}

export async function getLatestCaptureLog(): Promise<CaptureLog | null> {
  return findLatestCaptureLog();
}

export async function getCaptureLogCount(): Promise<number> {
  return countCaptureLogs();
}

function toCreateCaptureLogInput(
  input: CreateCaptureInput,
): CreateCaptureLogInput {
  return {
    method: input.method,
    path: input.path,
    query: input.query ?? {},
    requestHeaders: input.requestHeaders ?? {},
    requestBody: input.requestBody ?? null,
    responseHeaders: input.responseHeaders ?? {},
    responseBody: input.responseBody ?? null,
    statusCode: input.statusCode,
    durationMs: input.durationMs,
    errorMessage: input.errorMessage ?? null,
  };
}
