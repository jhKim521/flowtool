export const createCaptureLogsTableSql = `
  CREATE TABLE IF NOT EXISTS capture_logs (
    id SERIAL PRIMARY KEY,
    source_service TEXT,
    target_url TEXT,
    method TEXT NOT NULL,
    path TEXT NOT NULL,
    query JSONB NOT NULL DEFAULT '{}'::jsonb,
    request_headers JSONB NOT NULL DEFAULT '{}'::jsonb,
    request_body JSONB,
    response_headers JSONB NOT NULL DEFAULT '{}'::jsonb,
    response_body JSONB,
    status_code INTEGER NOT NULL,
    duration_ms INTEGER NOT NULL,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
`;

export const alterCaptureLogsTableSql = `
  ALTER TABLE capture_logs
    ADD COLUMN IF NOT EXISTS source_service TEXT,
    ADD COLUMN IF NOT EXISTS target_url TEXT;
`;
