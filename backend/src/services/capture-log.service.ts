import {
  createCaptureLog,
  findCaptureLogById,
  findCaptureLogs,
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

export async function getCaptureLogs(): Promise<CaptureLog[]> {
  return findCaptureLogs();
}

export async function getCaptureLogById(
  id: number,
): Promise<CaptureLog | null> {
  return findCaptureLogById(id);
}
