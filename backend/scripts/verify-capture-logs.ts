import { createApp } from "../src/app";
import {
  closeDatabaseConnection,
  verifyDatabaseConnection,
} from "../src/config/database";
import { getCaptureLogById } from "../src/services/capture-query.service";
import {
  getCaptureLogCount,
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

function assert(condition: unknown, message: string): asserts condition {
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

  const createdCaptures = [];

  for (const message of ["capture list one", "capture list two"]) {
    const createdCapture = await saveCaptureLog({
      method: "POST",
      path: "/verify/api/captures",
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

    createdCaptures.push(createdCapture);
  }

  const olderCapture = createdCaptures[0];
  const latestCapture = createdCaptures[1];

  const beforeQueryCount = await getCaptureLogCount();

  const listResponse = await fetch(`${baseUrl}/api/captures`);
  const listBody = await readJson<ApiResponse<CaptureLogListItem[]>>(
    listResponse,
  );

  assert(listResponse.status === 200, "List API did not return 200.");
  assert(listBody.success, "List API success flag is false.");
  assert(Array.isArray(listBody.data), "List API data is not an array.");
  assert(listBody.data.length >= 2, "List API returned fewer than two rows.");

  const first = listBody.data.find((item) => item.id === latestCapture.id);
  const second = listBody.data.find((item) => item.id === olderCapture.id);

  assert(first, "List API missing latest created capture.");
  assert(second, "List API missing older created capture.");
  assert(
    listBody.data.indexOf(first) < listBody.data.indexOf(second),
    "List API is not ordered by latest capture first.",
  );
  assert(first.responseStatus === 201, "List item responseStatus mismatch.");
  assert(!("requestBody" in first), "List item should not include requestBody.");

  const detailResponse = await fetch(`${baseUrl}/api/captures/${first.id}`);
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

  const missingResponse = await fetch(`${baseUrl}/api/captures/999999999`);
  const missingBody = await readJson<ApiResponse<null>>(missingResponse);

  assert(missingResponse.status === 404, "Missing ID API did not return 404.");
  assert(!missingBody.success, "Missing ID success flag should be false.");
  assert(
    missingBody.failResponse?.code === "CAPTURE_NOT_FOUND",
    "Missing ID error code mismatch.",
  );

  const legacyListResponse = await fetch(`${baseUrl}/capture-logs`);
  const legacyDetailResponse = await fetch(`${baseUrl}/capture-logs/${first.id}`);

  assert(
    legacyListResponse.status === 404,
    "Legacy list API should return 404.",
  );
  assert(
    legacyDetailResponse.status === 404,
    "Legacy detail API should return 404.",
  );

  const afterQueryCount = await getCaptureLogCount();

  assert(
    beforeQueryCount === afterQueryCount,
    "Query API changed capture log count.",
  );

  console.log("Capture Query API verification passed.");
  console.log(
    JSON.stringify(
      {
        listCount: listBody.data.length,
        latestCaptureId: first.id,
        detailPath: detailBody.data.path,
        responseStatus: detailBody.data.responseStatus,
        missingStatus: missingResponse.status,
        legacyListStatus: legacyListResponse.status,
        legacyDetailStatus: legacyDetailResponse.status,
        beforeQueryCount,
        afterQueryCount,
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
