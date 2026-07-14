import { createApp } from "../src/app";
import {
  closeDatabaseConnection,
  verifyDatabaseConnection,
} from "../src/config/database";
import {
  getCaptureLogById,
  initializeCaptureStorage,
  saveCaptureLog,
} from "../src/services/capture-log.service";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  failResponse: {
    code: string;
    message: string;
  } | null;
}

interface CaptureLogListItem {
  id: number;
  method: string;
  path: string;
  responseStatus: number;
  durationMs: number;
  createdAt: string;
}

interface CaptureLogDetail extends CaptureLogListItem {
  query: Record<string, unknown>;
  requestHeaders: Record<string, unknown>;
  requestBody: unknown;
  responseBody: unknown;
  errorMessage: string | null;
}

async function readJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  return JSON.parse(text) as T;
}

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

async function main(): Promise<void> {
  await verifyDatabaseConnection();
  await initializeCaptureStorage();

  const app = createApp();
  const server = app.listen(0);
  const address = server.address();

  if (!address || typeof address === "string") {
    throw new Error("Failed to start verification server.");
  }

  const baseUrl = `http://127.0.0.1:${address.port}`;

  for (const message of ["capture list one", "capture list two"]) {
    await saveCaptureLog({
      method: "POST",
      path: "/verify/capture-logs",
      query: {},
      requestHeaders: {
        "content-type": "application/json",
      },
      requestBody: {
        message,
      },
      responseHeaders: {
        "content-type": "application/json",
      },
      responseBody: {
        received: {
          message,
        },
      },
      statusCode: 201,
      durationMs: 10,
      errorMessage: null,
    });
  }

  const listResponse = await fetch(`${baseUrl}/capture-logs`);
  const listBody = await readJson<ApiResponse<CaptureLogListItem[]>>(
    listResponse,
  );

  assert(listResponse.status === 200, "List API did not return 200.");
  assert(listBody.success, "List API success flag is false.");
  assert(Array.isArray(listBody.data), "List API data is not an array.");
  assert(listBody.data.length >= 2, "List API returned fewer than two rows.");

  const first = listBody.data[0];
  const second = listBody.data[1];

  assert(first.id > second.id, "List API is not ordered by latest capture first.");
  assert(first.responseStatus === 201, "List item responseStatus mismatch.");
  assert(!("requestBody" in first), "List item should not include requestBody.");

  const detailResponse = await fetch(`${baseUrl}/capture-logs/${first.id}`);
  const detailBody = await readJson<ApiResponse<CaptureLogDetail>>(
    detailResponse,
  );

  assert(detailResponse.status === 200, "Detail API did not return 200.");
  assert(detailBody.success, "Detail API success flag is false.");
  assert(detailBody.data.id === first.id, "Detail API id mismatch.");
  assert("requestBody" in detailBody.data, "Detail API missing requestBody.");
  assert("responseBody" in detailBody.data, "Detail API missing responseBody.");

  const dbCaptureLog = await getCaptureLogById(first.id);
  if (!dbCaptureLog) {
    throw new Error("DB capture log was not found.");
  }

  assert(
    dbCaptureLog.statusCode === detailBody.data.responseStatus,
    "API responseStatus does not match DB status_code.",
  );

  const missingResponse = await fetch(`${baseUrl}/capture-logs/999999999`);
  const missingBody = await readJson<ApiResponse<null>>(missingResponse);

  assert(missingResponse.status === 404, "Missing ID API did not return 404.");
  assert(!missingBody.success, "Missing ID success flag should be false.");
  assert(
    missingBody.failResponse?.code === "CAPTURE_NOT_FOUND",
    "Missing ID error code mismatch.",
  );

  console.log("Capture Log API verification passed.");
  console.log(
    JSON.stringify(
      {
        listCount: listBody.data.length,
        latestCaptureId: first.id,
        detailPath: detailBody.data.path,
        responseStatus: detailBody.data.responseStatus,
        missingStatus: missingResponse.status,
      },
      null,
      2,
    ),
  );

  server.close();
  await closeDatabaseConnection();
}

main().catch(async (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Capture Log API verification failed: ${message}`);
  await closeDatabaseConnection();
  process.exit(1);
});
