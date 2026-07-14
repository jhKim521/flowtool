import express from "express";

import { captureLogRouter } from "./routes/capture-log.routes";
import { healthRouter } from "./routes/health.routes";
import { testRouter } from "./routes/test.routes";

export function createApp(): express.Express {
  const app = express();

  app.use(express.json());
  app.use(healthRouter);
  app.use(testRouter);
  app.use(captureLogRouter);

  return app;
}
