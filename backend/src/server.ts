import { createApp } from "./app";
import { verifyDatabaseConnection } from "./config/database";
import { env } from "./config/env";
import { initializeCaptureStorage } from "./services/capture-log.service";

async function startServer(): Promise<void> {
  await verifyDatabaseConnection();
  await initializeCaptureStorage();

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`FlowTool backend listening on port ${env.port}`);
  });
}

startServer().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Failed to start FlowTool backend: ${message}`);
  process.exit(1);
});
