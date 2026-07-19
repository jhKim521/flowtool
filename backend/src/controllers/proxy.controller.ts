import { Request, Response } from "express";

import {
  forwardProxyRequest,
  isSupportedProxyMethod,
  isValidTargetUrl,
} from "../services/proxy.service";

const TARGET_URL_HEADER = "x-flowtool-target-url";
const SOURCE_SERVICE_HEADER = "x-flowtool-source-service";

export async function proxyRequest(
  req: Request,
  res: Response,
): Promise<void> {
  const targetUrl = getHeaderValue(req, TARGET_URL_HEADER);

  if (!targetUrl || !isValidTargetUrl(targetUrl)) {
    sendInvalidProxyRequest(res);
    return;
  }

  if (!isSupportedProxyMethod(req.method)) {
    res.status(405).json({
      success: false,
      data: null,
      failResponse: {
        code: "INVALID_PROXY_REQUEST",
        message: "Proxy method is not supported.",
      },
    });
    return;
  }

  const proxyResponse = await forwardProxyRequest({
    targetUrl,
    sourceService: getHeaderValue(req, SOURCE_SERVICE_HEADER),
    method: req.method,
    query: req.query as Record<string, unknown>,
    headers: req.headers,
    body: req.body,
  });

  for (const [key, value] of Object.entries(proxyResponse.headers)) {
    res.setHeader(key, value);
  }

  res.setHeader("X-FlowTool-Capture-Id", String(proxyResponse.captureId));
  res.status(proxyResponse.statusCode).send(proxyResponse.body);
}

function getHeaderValue(req: Request, name: string): string | null {
  const value = req.headers[name];

  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

function sendInvalidProxyRequest(res: Response): void {
  res.status(400).json({
    success: false,
    data: null,
    failResponse: {
      code: "TARGET_URL_REQUIRED",
      message: "Target URL is required.",
    },
  });
}
