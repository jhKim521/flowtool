import {
  findCaptureLogById,
  findCaptureLogs,
} from "../repositories/capture-log.repository";
import { CaptureLog } from "../types/capture-log";

export async function getCaptureLogs(): Promise<CaptureLog[]> {
  return findCaptureLogs();
}

export async function getCaptureLogById(
  id: number,
): Promise<CaptureLog | null> {
  return findCaptureLogById(id);
}
