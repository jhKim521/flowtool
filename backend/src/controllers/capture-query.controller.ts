import { Request, Response } from "express";

import {
  getCaptureLogById,
  getCaptureLogs,
} from "../services/capture-query.service";
import { CaptureLog } from "../types/capture-log";

function toListItem(captureLog: CaptureLog) {
  return {
    id: captureLog.id,
    method: captureLog.method,
    path: captureLog.path,
    responseStatus: captureLog.statusCode,
    durationMs: captureLog.durationMs,
    createdAt: captureLog.createdAt.toISOString(),
  };
}

function toDetail(captureLog: CaptureLog) {
  return {
    ...toListItem(captureLog),
    query: captureLog.query,
    requestHeaders: captureLog.requestHeaders,
    requestBody: captureLog.requestBody,
    responseBody: captureLog.responseBody,
    errorMessage: captureLog.errorMessage,
  };
}

function sendCaptureNotFound(res: Response): void {
  res.status(404).json({
    success: false,
    data: null,
    failResponse: {
      code: "CAPTURE_NOT_FOUND",
      message: "Capture log not found.",
    },
  });
}

export async function getCaptureList(
  _req: Request,
  res: Response,
): Promise<void> {
  const captureLogs = await getCaptureLogs();

  res.json({
    success: true,
    data: captureLogs.map(toListItem),
    failResponse: null,
  });
}

export async function getCaptureDetail(
  req: Request,
  res: Response,
): Promise<void> {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    sendCaptureNotFound(res);
    return;
  }

  const captureLog = await getCaptureLogById(id);

  if (!captureLog) {
    sendCaptureNotFound(res);
    return;
  }

  res.json({
    success: true,
    data: toDetail(captureLog),
    failResponse: null,
  });
}
