import { useEffect, useState } from "react";

import { fetchCaptureLogs } from "./api/capture-logs";
import { CaptureLogListItem } from "./types/capture-log";

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

export function App() {
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
