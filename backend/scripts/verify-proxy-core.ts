import express from "express";
import { Server } from "node:http";

import { createApp } from "../src/app";
import {
  closeDatabaseConnection,
  verifyDatabaseConnection,
} from "../src/config/database";
import { getCaptureLogById } from "../src/services/capture-query.service";
import {
  getCaptureLogCount,
  initializeCaptureStorage,
} from "../src/services/capture-log.service";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  failResponse: {
    code: string;
    message: string;
  } | null;
}

interface CaptureLogDetail {
  id: number;
  sourceService: string | null;
  targetUrl: string | null;
  method: string;
  path: string;
  query: Record<string, unknown>;
  requestHeaders: Record<string, unknown>;
  requestBody: unknown;
  responseHeaders: Record<string, unknown>;
  responseBody: unknown;
  responseStatus: number;
  durationMs: number;
  errorMessage: string | null;
  createdAt: string;
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function listen(app: express.Express): Promise<{ server: Server; url: string }> {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const address = server.address();

      if (!address || typeof address === "string") {
        reject(new Error("Failed to start verification server."));
        return;
      }

      resolve({
        server,
        url: `http://127.0.0.1:${address.port}`,
      });
    });
  });
}

function closeServer(server: Server | null): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!server) {
      resolve();
      return;
    }

    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

async function readJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  return JSON.parse(text) as T;
}

async function main(): Promise<void> {
  await verifyDatabaseConnection();
  await initializeCaptureStorage();

  let proxyServer: Server | null = null;
  let targetServer: Server | null = null;

  try {
    const targetApp = express();
    targetApp.use(express.json());
    targetApp.post("/target/jobs", (req, res) => {
      assert(
        req.headers["x-flowtool-target-url"] === undefined,
        "Target received FlowTool target URL control header.",
      );
      assert(
        req.headers["x-flowtool-source-service"] === undefined,
        "Target received FlowTool source service control header.",
      );

      res
        .status(201)
        .setHeader("X-Target-Trace", "target-trace-001")
        .json({
          receivedMethod: req.method,
          receivedQuery: req.query,
          receivedBody: req.body,
          receivedHeader: req.headers["x-source-request"],
        });
    });

    const target = await listen(targetApp);
    targetServer = target.server;

    const proxy = await listen(createApp());
    proxyServer = proxy.server;

    const beforeProxyCount = await getCaptureLogCount();
    const targetUrl = `${target.url}/target/jobs`;

    const proxyResponse = await fetch(`${proxy.url}/proxy?debug=true`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-FlowTool-Target-Url": targetUrl,
        "X-FlowTool-Source-Service": "verify-source",
        "X-Source-Request": "source-request-001",
      },
      body: JSON.stringify({
        jobId: 10,
        prompt: "Verify proxy core.",
      }),
    });

    const proxyBody = await readJson<{
      receivedMethod: string;
      receivedQuery: Record<string, unknown>;
      receivedBody: Record<string, unknown>;
      receivedHeader: string;
    }>(proxyResponse);
    const afterProxyCount = await getCaptureLogCount();

    assert(proxyResponse.status === 201, "Proxy response status mismatch.");
    assert(
      proxyResponse.headers.get("x-target-trace") === "target-trace-001",
      "Proxy response header mismatch.",
    );
    assert(
      proxyResponse.headers.get("x-flowtool-capture-id"),
      "Proxy response missing capture id header.",
    );
    assert(
      proxyBody.receivedMethod === "POST",
      "Target did not receive POST method.",
    );
    assert(
      proxyBody.receivedQuery.debug === "true",
      "Target did not receive query parameter.",
    );
    assert(proxyBody.receivedBody.jobId === 10, "Target body mismatch.");
    assert(
      proxyBody.receivedHeader === "source-request-001",
      "Target request header mismatch.",
    );
    assert(
      afterProxyCount === beforeProxyCount + 1,
      "Proxy request did not create exactly one capture log.",
    );

    const captureId = Number(proxyResponse.headers.get("x-flowtool-capture-id"));
    const dbCaptureLog = await getCaptureLogById(captureId);

    assert(dbCaptureLog, "DB capture log was not found.");
    assert(dbCaptureLog.sourceService === "verify-source", "sourceService mismatch.");
    assert(dbCaptureLog.targetUrl === `${targetUrl}?debug=true`, "targetUrl mismatch.");
    assert(dbCaptureLog.method === "POST", "method mismatch.");
    assert(dbCaptureLog.path === "/target/jobs", "path mismatch.");
    assert(dbCaptureLog.query.debug === "true", "query mismatch.");
    assert(dbCaptureLog.statusCode === 201, "statusCode mismatch.");
    assert(dbCaptureLog.durationMs >= 0, "durationMs should be non-negative.");
    assert(dbCaptureLog.errorMessage === null, "errorMessage should be null.");

    const beforeQueryCount = await getCaptureLogCount();
    const detailResponse = await fetch(`${proxy.url}/api/captures/${captureId}`);
    const detailBody = await readJson<ApiResponse<CaptureLogDetail>>(
      detailResponse,
    );
    const afterQueryCount = await getCaptureLogCount();

    assert(detailResponse.status === 200, "Detail API status mismatch.");
    assert(detailBody.success, "Detail API success flag is false.");
    assert(detailBody.data.sourceService === "verify-source", "Detail sourceService mismatch.");
    assert(detailBody.data.targetUrl === `${targetUrl}?debug=true`, "Detail targetUrl mismatch.");
    assert(
      detailBody.data.responseHeaders["x-target-trace"] === "target-trace-001",
      "Detail responseHeaders mismatch.",
    );
    assert(
      beforeQueryCount === afterQueryCount,
      "Query API changed capture log count.",
    );

    console.log("Proxy Core verification passed.");
    console.log(
      JSON.stringify(
        {
          captureId,
          responseStatus: proxyResponse.status,
          targetUrl: detailBody.data.targetUrl,
          sourceService: detailBody.data.sourceService,
          beforeProxyCount,
          afterProxyCount,
          beforeQueryCount,
          afterQueryCount,
        },
        null,
        2,
      ),
    );
  } finally {
    await closeServer(proxyServer);
    await closeServer(targetServer);
    await closeDatabaseConnection();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Proxy Core verification failed: ${message}`);
  process.exit(1);
});
