import { createApp } from "../src/app";
import { closeDatabaseConnection, verifyDatabaseConnection } from "../src/config/database";
import { getLatestCaptureLog, initializeCaptureStorage } from "../src/services/capture-log.service";

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  return text ? JSON.parse(text) : null;
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
  const response = await fetch(`${baseUrl}/api/test/echo?source=verify`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      message: "flowtool capture verification",
    }),
  });

  const responseBody = await readJson(response);

  if (response.status !== 201) {
    throw new Error(`Expected 201 response, received ${response.status}.`);
  }

  await new Promise((resolve) => setTimeout(resolve, 200));

  const latestCapture = await getLatestCaptureLog();

  if (!latestCapture) {
    throw new Error("Capture log was not saved.");
  }

  if (latestCapture.method !== "POST") {
    throw new Error(`Expected POST capture, received ${latestCapture.method}.`);
  }

  if (latestCapture.path !== "/api/test/echo") {
    throw new Error(`Expected /api/test/echo path, received ${latestCapture.path}.`);
  }

  if (latestCapture.statusCode !== 201) {
    throw new Error(`Expected 201 status code, received ${latestCapture.statusCode}.`);
  }

  console.log("Capture verification passed.");
  console.log(
    JSON.stringify(
      {
        responseBody,
        captureId: latestCapture.id,
        method: latestCapture.method,
        path: latestCapture.path,
        statusCode: latestCapture.statusCode,
        durationMs: latestCapture.durationMs,
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
  console.error(`Capture verification failed: ${message}`);
  await closeDatabaseConnection();
  process.exit(1);
});
