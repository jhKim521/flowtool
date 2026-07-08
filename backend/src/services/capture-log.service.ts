import {
  createCaptureLog,
  findLatestCaptureLog,
  initializeCaptureLogTable,
} from "../repositories/capture-log.repository";
import { CaptureLog, CreateCaptureLogInput } from "../types/capture-log";

export async function initializeCaptureStorage(): Promise<void> {
  await initializeCaptureLogTable();
}

export async function saveCaptureLog(
  input: CreateCaptureLogInput,
): Promise<CaptureLog> {
  return createCaptureLog(input);
}

export async function getLatestCaptureLog(): Promise<CaptureLog | null> {
  return findLatestCaptureLog();
}
