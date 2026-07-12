import { useEffect, useState } from "react";
import { Link, Route, Routes, useParams } from "react-router-dom";

import { fetchCaptureLogById, fetchCaptureLogs } from "./api/capture-logs";
import {
  CaptureLogDetail,
  CaptureLogListItem,
  CaptureLogNotFoundError,
} from "./types/capture-log";

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

function JsonBlock({ value }: { value: unknown }) {
  return <pre>{JSON.stringify(value, null, 2)}</pre>;
}

function CaptureLogListPage() {
  const [captureLogs, setCaptureLogs] = useState<CaptureLogListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadCaptureLogs() {
      try {
        const data = await fetchCaptureLogs();

        if (!isMounted) {
          return;
        }

        setCaptureLogs(data);
        setErrorMessage(null);
      } catch {
        if (!isMounted) {
          return;
        }

        setErrorMessage("Failed to load capture logs.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCaptureLogs();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="page-shell">
      <header className="page-header">
        <h1>FlowTool Capture Logs</h1>
      </header>

      {isLoading && <p className="state-message">Loading capture logs...</p>}

      {!isLoading && errorMessage && (
        <p className="state-message state-message-error">{errorMessage}</p>
      )}

      {!isLoading && !errorMessage && captureLogs.length === 0 && (
        <p className="state-message">No capture logs found.</p>
      )}

      {!isLoading && !errorMessage && captureLogs.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Method</th>
                <th>Path</th>
                <th>Response Status</th>
                <th>Duration</th>
                <th>Created At</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {captureLogs.map((captureLog) => (
                <tr key={captureLog.id}>
                  <td>
                    <span className="method-badge">{captureLog.method}</span>
                  </td>
                  <td className="path-cell">{captureLog.path}</td>
                  <td>{captureLog.responseStatus}</td>
                  <td>{captureLog.durationMs} ms</td>
                  <td>{formatDate(captureLog.createdAt)}</td>
                  <td>
                    <Link className="detail-link" to={`/capture/${captureLog.id}`}>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

function CaptureLogDetailPage() {
  const { id } = useParams();
  const [captureLog, setCaptureLog] = useState<CaptureLogDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadCaptureLog() {
      if (!id) {
        setErrorMessage("Capture Log not found.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await fetchCaptureLogById(id);

        if (!isMounted) {
          return;
        }

        setCaptureLog(data);
        setErrorMessage(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (error instanceof CaptureLogNotFoundError) {
          setErrorMessage("Capture Log not found.");
          return;
        }

        setErrorMessage("Failed to load capture log.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCaptureLog();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <main className="page-shell">
      <header className="page-header">
        <Link className="back-link" to="/">
          Back to list
        </Link>
        <h1>Capture Log Detail</h1>
      </header>

      {isLoading && <p className="state-message">Loading capture log...</p>}

      {!isLoading && errorMessage && (
        <p className="state-message state-message-error">{errorMessage}</p>
      )}

      {!isLoading && !errorMessage && captureLog && (
        <div className="detail-sections">
          <section className="detail-section">
            <h2>Basic Information</h2>
            <dl className="detail-grid">
              <div>
                <dt>Method</dt>
                <dd>{captureLog.method}</dd>
              </div>
              <div>
                <dt>Path</dt>
                <dd>{captureLog.path}</dd>
              </div>
              <div>
                <dt>Response Status</dt>
                <dd>{captureLog.responseStatus}</dd>
              </div>
              <div>
                <dt>Duration</dt>
                <dd>{captureLog.durationMs} ms</dd>
              </div>
              <div>
                <dt>Created At</dt>
                <dd>{formatDate(captureLog.createdAt)}</dd>
              </div>
            </dl>
          </section>

          <section className="detail-section">
            <h2>Query</h2>
            <JsonBlock value={captureLog.query} />
          </section>

          <section className="detail-section">
            <h2>Request Headers</h2>
            <JsonBlock value={captureLog.requestHeaders} />
          </section>

          <section className="detail-section">
            <h2>Request Body</h2>
            <JsonBlock value={captureLog.requestBody} />
          </section>

          <section className="detail-section">
            <h2>Response Body</h2>
            <JsonBlock value={captureLog.responseBody} />
          </section>

          <section className="detail-section">
            <h2>Error Message</h2>
            <p>{captureLog.errorMessage ?? "None"}</p>
          </section>
        </div>
      )}
    </main>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<CaptureLogListPage />} />
      <Route path="/capture/:id" element={<CaptureLogDetailPage />} />
    </Routes>
  );
}
