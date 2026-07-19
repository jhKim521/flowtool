import express from "express";

import { captureQueryRouter } from "./routes/capture-query.routes";
import { healthRouter } from "./routes/health.routes";
import { proxyRouter } from "./routes/proxy.routes";
import { testRouter } from "./routes/test.routes";

export function createApp(): express.Express {
  const app = express();

  app.use(express.json());
  app.use(healthRouter);
  app.use(testRouter);
  app.use(proxyRouter);
  app.use(captureQueryRouter);

  return app;
}
