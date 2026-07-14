import {
  closeDatabaseConnection,
  verifyDatabaseConnection,
} from "../src/config/database";
import {
  getCaptureLogById,
  initializeCaptureStorage,
  saveCaptureLog,
} from "../src/services/capture-log.service";

async function main(): Promise<void> {
  await verifyDatabaseConnection();
  await initializeCaptureStorage();

  const createdCapture = await saveCaptureLog({
    method: "POST",
    path: "/verify/capture-storage",
    query: {
      source: "verify",
    },
    requestHeaders: {
      "content-type": "application/json",
    },
    requestBody: {
      message: "flowtool capture verification",
    },
    responseHeaders: {
      "content-type": "application/json",
    },
    responseBody: {
      received: true,
    },
    statusCode: 201,
    durationMs: 12,
    errorMessage: null,
  });

  const savedCapture = await getCaptureLogById(createdCapture.id);

  if (!savedCapture) {
    throw new Error("Capture log was not saved.");
  }

  if (savedCapture.method !== "POST") {
    throw new Error(`Expected POST capture, received ${savedCapture.method}.`);
  }

  if (savedCapture.path !== "/verify/capture-storage") {
    throw new Error(
      `Expected /verify/capture-storage path, received ${savedCapture.path}.`,
    );
  }

  if (savedCapture.statusCode !== 201) {
    throw new Error(
      `Expected 201 status code, received ${savedCapture.statusCode}.`,
    );
  }

  console.log("Capture verification passed.");
  console.log(
    JSON.stringify(
      {
        captureId: savedCapture.id,
        method: savedCapture.method,
        path: savedCapture.path,
        statusCode: savedCapture.statusCode,
        durationMs: savedCapture.durationMs,
      },
      null,
      2,
    ),
  );

  await closeDatabaseConnection();
}

main().catch(async (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Capture verification failed: ${message}`);
  await closeDatabaseConnection();
  process.exit(1);
});
