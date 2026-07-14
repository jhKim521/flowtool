import { createApp } from "../src/app";
import {
  closeDatabaseConnection,
  verifyDatabaseConnection,
} from "../src/config/database";
import {
  getCaptureLogCount,
  initializeCaptureStorage,
  saveCaptureLog,
} from "../src/services/capture-log.service";

async function assertCountUnchanged(
  label: string,
  action: () => Promise<Response>,
): Promise<void> {
  const beforeCount = await getCaptureLogCount();
  const response = await action();
  await response.text();
  const afterCount = await getCaptureLogCount();

  if (beforeCount !== afterCount) {
    throw new Error(
      `${label} changed capture count. Before: ${beforeCount}, after: ${afterCount}.`,
    );
  }
}

async function main(): Promise<void> {
  await verifyDatabaseConnection();
  await initializeCaptureStorage();

  const existingCapture = await saveCaptureLog({
    method: "GET",
    path: "/verify/no-auto-capture",
    statusCode: 200,
    durationMs: 5,
  });

  const app = createApp();
  const server = app.listen(0);
  const address = server.address();

  if (!address || typeof address === "string") {
    throw new Error("Failed to start verification server.");
  }

  const baseUrl = `http://127.0.0.1:${address.port}`;

  await assertCountUnchanged("Health API", () => fetch(`${baseUrl}/health`));
  await assertCountUnchanged("Capture list API", () =>
    fetch(`${baseUrl}/capture-logs`),
  );
  await assertCountUnchanged("Capture detail API", () =>
    fetch(`${baseUrl}/capture-logs/${existingCapture.id}`),
  );
  await assertCountUnchanged("Capture missing detail API", () =>
    fetch(`${baseUrl}/capture-logs/999999999`),
  );

  console.log("No auto capture verification passed.");
  console.log(
    JSON.stringify(
      {
        existingCaptureId: existingCapture.id,
        finalCount: await getCaptureLogCount(),
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
  console.error(`No auto capture verification failed: ${message}`);
  await closeDatabaseConnection();
  process.exit(1);
});
