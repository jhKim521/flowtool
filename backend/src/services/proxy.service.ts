import { saveCaptureLog } from "./capture-log.service";

interface ProxyRequestInput {
  targetUrl: string;
  sourceService: string | null;
  method: string;
  query: Record<string, unknown>;
  headers: Record<string, string | string[] | undefined>;
  body: unknown;
}

interface ProxyResponseOutput {
  captureId: number;
  statusCode: number;
  headers: Record<string, string>;
  body: unknown;
}

const REQUEST_HEADER_BLOCKLIST = new Set([
  "connection",
  "content-length",
  "host",
  "x-flowtool-source-service",
  "x-flowtool-target-url",
]);

const RESPONSE_HEADER_BLOCKLIST = new Set([
  "connection",
  "content-encoding",
  "content-length",
  "keep-alive",
  "transfer-encoding",
]);

export async function forwardProxyRequest(
  input: ProxyRequestInput,
): Promise<ProxyResponseOutput> {
  const startedAt = Date.now();
  const targetUrl = buildTargetUrl(input.targetUrl, input.query);
  const requestHeaders = toForwardRequestHeaders(input.headers);
  const requestBody = shouldSendBody(input.method) ? input.body : undefined;

  const targetResponse = await fetch(targetUrl, {
    method: input.method,
    headers: requestHeaders,
    body: serializeRequestBody(requestBody),
  });

  const responseHeaders = toResponseHeaders(targetResponse.headers);
  const responseBody = await readResponseBody(targetResponse);
  const durationMs = Date.now() - startedAt;

  const captureLog = await saveCaptureLog({
    sourceService: input.sourceService,
    targetUrl,
    method: input.method,
    path: new URL(targetUrl).pathname,
    query: toQueryObject(new URL(targetUrl).searchParams),
    requestHeaders,
    requestBody: requestBody ?? null,
    responseHeaders,
    responseBody,
    statusCode: targetResponse.status,
    durationMs,
    errorMessage: null,
  });

  return {
    captureId: captureLog.id,
    statusCode: targetResponse.status,
    headers: responseHeaders,
    body: responseBody,
  };
}

export function isSupportedProxyMethod(method: string): boolean {
  return ["GET", "POST", "PUT", "PATCH", "DELETE"].includes(method);
}

export function isValidTargetUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function buildTargetUrl(
  targetUrl: string,
  query: Record<string, unknown>,
): string {
  const url = new URL(targetUrl);

  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        url.searchParams.append(key, String(item));
      }
      continue;
    }

    if (value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  }

  return url.toString();
}

function toForwardRequestHeaders(
  headers: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const forwardedHeaders: Record<string, string> = {};

  for (const [key, value] of Object.entries(headers)) {
    const normalizedKey = key.toLowerCase();

    if (REQUEST_HEADER_BLOCKLIST.has(normalizedKey) || value === undefined) {
      continue;
    }

    forwardedHeaders[key] = Array.isArray(value) ? value.join(", ") : value;
  }

  return forwardedHeaders;
}

function toResponseHeaders(headers: Headers): Record<string, string> {
  const responseHeaders: Record<string, string> = {};

  headers.forEach((value, key) => {
    if (!RESPONSE_HEADER_BLOCKLIST.has(key.toLowerCase())) {
      responseHeaders[key] = value;
    }
  });

  return responseHeaders;
}

function shouldSendBody(method: string): boolean {
  return !["GET", "HEAD"].includes(method.toUpperCase());
}

function serializeRequestBody(body: unknown): BodyInit | undefined {
  if (body === undefined) {
    return undefined;
  }

  if (typeof body === "string") {
    return body;
  }

  return JSON.stringify(body);
}

async function readResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return text;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function toQueryObject(searchParams: URLSearchParams): Record<string, unknown> {
  const query: Record<string, unknown> = {};

  searchParams.forEach((value, key) => {
    if (query[key] === undefined) {
      query[key] = value;
      return;
    }

    const existingValue = query[key];
    query[key] = Array.isArray(existingValue)
      ? [...existingValue, value]
      : [existingValue, value];
  });

  return query;
}
