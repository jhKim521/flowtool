import { pool } from "../config/database";
import {
  alterCaptureLogsTableSql,
  createCaptureLogsTableSql,
} from "../models/capture-log.model";
import { CaptureLog, CreateCaptureLogInput } from "../types/capture-log";

function toCaptureLog(row: Record<string, unknown>): CaptureLog {
  return {
    id: Number(row.id),
    sourceService: row.source_service ? String(row.source_service) : null,
    targetUrl: row.target_url ? String(row.target_url) : null,
    method: String(row.method),
    path: String(row.path),
    query: row.query as Record<string, unknown>,
    requestHeaders: row.request_headers as Record<string, unknown>,
    requestBody: row.request_body,
    responseHeaders: row.response_headers as Record<string, unknown>,
    responseBody: row.response_body,
    statusCode: Number(row.status_code),
    durationMs: Number(row.duration_ms),
    errorMessage: row.error_message ? String(row.error_message) : null,
    createdAt: new Date(String(row.created_at)),
  };
}

export async function initializeCaptureLogTable(): Promise<void> {
  await pool.query(createCaptureLogsTableSql);
  await pool.query(alterCaptureLogsTableSql);
}

export async function createCaptureLog(
  input: CreateCaptureLogInput,
): Promise<CaptureLog> {
  const result = await pool.query(
    `
      INSERT INTO capture_logs (
        source_service,
        target_url,
        method,
        path,
        query,
        request_headers,
        request_body,
        response_headers,
        response_body,
        status_code,
        duration_ms,
        error_message
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `,
    [
      input.sourceService,
      input.targetUrl,
      input.method,
      input.path,
      JSON.stringify(input.query),
      JSON.stringify(input.requestHeaders),
      JSON.stringify(input.requestBody),
      JSON.stringify(input.responseHeaders),
      JSON.stringify(input.responseBody),
      input.statusCode,
      input.durationMs,
      input.errorMessage,
    ],
  );

  return toCaptureLog(result.rows[0]);
}

export async function findLatestCaptureLog(): Promise<CaptureLog | null> {
  const result = await pool.query(
    "SELECT * FROM capture_logs ORDER BY id DESC LIMIT 1",
  );

  if (!result.rows[0]) {
    return null;
  }

  return toCaptureLog(result.rows[0]);
}

export async function findCaptureLogs(): Promise<CaptureLog[]> {
  const result = await pool.query(
    "SELECT * FROM capture_logs ORDER BY created_at DESC, id DESC",
  );

  return result.rows.map(toCaptureLog);
}

export async function findCaptureLogById(
  id: number,
): Promise<CaptureLog | null> {
  const result = await pool.query("SELECT * FROM capture_logs WHERE id = $1", [
    id,
  ]);

  if (!result.rows[0]) {
    return null;
  }

  return toCaptureLog(result.rows[0]);
}

export async function countCaptureLogs(): Promise<number> {
  const result = await pool.query("SELECT COUNT(*) AS count FROM capture_logs");
  return Number(result.rows[0].count);
}
