import { NextFunction, Request, Response } from "express";

import { saveCaptureLog } from "../services/capture-log.service";
import { parseJsonBody } from "../utils/json";

export function captureMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const startedAt = Date.now();
  const originalJson = res.json.bind(res);
  const originalSend = res.send.bind(res);
  let responseBody: unknown = null;
  let errorMessage: string | null = null;

  res.json = (body: unknown): Response => {
    responseBody = body;
    return originalJson(body);
  };

  res.send = (body?: unknown): Response => {
    responseBody = typeof body === "string" ? parseJsonBody(body) : body;
    return originalSend(body);
  };

  res.on("finish", () => {
    const durationMs = Date.now() - startedAt;

    saveCaptureLog({
      method: req.method,
      path: req.path,
      query: req.query as Record<string, unknown>,
      requestHeaders: req.headers as Record<string, unknown>,
      requestBody: req.body ?? null,
      responseHeaders: res.getHeaders() as Record<string, unknown>,
      responseBody,
      statusCode: res.statusCode,
      durationMs,
      errorMessage,
    }).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Failed to save capture log: ${message}`);
    });
  });

  try {
    next();
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : String(error);
    next(error);
  }
}
