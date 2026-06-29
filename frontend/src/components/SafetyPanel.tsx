import { useCallback, useEffect, useState } from "react";
import {
  fetchAllowedFolders,
  fetchForbiddenRules,
  fetchSafetyStatus,
  testPath,
  type AllowedFolder,
  type ForbiddenRules,
  type PathCheckResult,
  type SafetyStatus,
} from "../api/safety";

export function SafetyPanel() {
  const [status, setStatus] = useState<SafetyStatus | null>(null);
  const [folders, setFolders] = useState<AllowedFolder[]>([]);
  const [forbidden, setForbidden] = useState<ForbiddenRules | null>(null);
  const [testInput, setTestInput] = useState("H:/localAgent/README.md");
  const [testAction, setTestAction] = useState<"read" | "list" | "write" | "delete">("read");
  const [testResult, setTestResult] = useState<PathCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [forbiddenOpen, setForbiddenOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      const [s, f, rules] = await Promise.all([
        fetchSafetyStatus(),
        fetchAllowedFolders(),
        fetchForbiddenRules(),
      ]);
      setStatus(s);
      setFolders(f);
      setForbidden(rules);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load safety data");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function runTest(event: React.FormEvent) {
    event.preventDefault();
    try {
      setError(null);
      const result = await testPath(testInput, testAction);
      setTestResult(result);
    } catch (e) {
      setTestResult(null);
      setError(e instanceof Error ? e.message : "Test failed");
    }
  }

  return (
    <section className="safety-panel">
      <h2>Safety &amp; Permissions</h2>
      <p className="safety-panel__slice">LB-OS-003 — Permission engine v2</p>

      {error ? <p className="safety-panel__error">{error}</p> : null}

      <div className="safety-panel__status">
        <h3>Safety status</h3>
        {status ? (
          <ul>
            <li>
              Engine: <strong>{status.engine}</strong>{" "}
              {status.active ? "(active)" : "(inactive)"}
            </li>
            <li>Database: {status.dbConnected ? "connected" : "disconnected"}</li>
            <li>Allowed folders: {status.allowedFolderCount}</li>
            <li>Forbidden rules: {status.forbiddenRuleCount}</li>
            <li>File tools: {status.fileToolsEnabled ? "enabled" : "disabled"}</li>
          </ul>
        ) : (
          <p>Loading…</p>
        )}
        {status?.message ? <p className="safety-panel__message">{status.message}</p> : null}
      </div>

      <div className="safety-panel__section">
        <h3>Allowed folders</h3>
        {folders.length === 0 ? (
          <p className="safety-panel__muted">No allowed folders configured.</p>
        ) : (
          <ul className="safety-panel__list">
            {folders.map((folder) => (
              <li key={folder.id}>
                <code>{folder.path}</code>
                <span className="safety-panel__label">{folder.label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="safety-panel__section">
        <button
          type="button"
          className="safety-panel__toggle"
          onClick={() => setForbiddenOpen((v) => !v)}
        >
          Forbidden paths {forbiddenOpen ? "▾" : "▸"}
        </button>
        {forbiddenOpen && forbidden ? (
          <div className="safety-panel__forbidden">
            <h4>Prefixes</h4>
            <ul className="safety-panel__list safety-panel__list--compact">
              {forbidden.prefixes.map((p) => (
                <li key={p}>
                  <code>{p}</code>
                </li>
              ))}
            </ul>
            <h4>Ignored segments</h4>
            <ul className="safety-panel__list safety-panel__list--compact">
              {forbidden.segments.map((s) => (
                <li key={s}>
                  <code>{s}</code>
                </li>
              ))}
            </ul>
            <h4>Secret names / globs</h4>
            <ul className="safety-panel__list safety-panel__list--compact">
              {[...forbidden.secretNames, ...forbidden.secretGlobs].map((s) => (
                <li key={s}>
                  <code>{s}</code>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <form className="safety-panel__test" onSubmit={runTest}>
        <h3>Permission test</h3>
        <label className="safety-panel__field">
          Path
          <input
            type="text"
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            placeholder="H:/localAgent/README.md"
          />
        </label>
        <label className="safety-panel__field">
          Action
          <select
            value={testAction}
            onChange={(e) =>
              setTestAction(e.target.value as "read" | "list" | "write" | "delete")
            }
          >
            <option value="read">read</option>
            <option value="list">list</option>
            <option value="write">write</option>
            <option value="delete">delete</option>
          </select>
        </label>
        <button type="submit" className="command-bar__submit">
          Test path
        </button>
        {testResult ? (
          <div
            className={
              testResult.allowed
                ? "safety-panel__result safety-panel__result--allow"
                : "safety-panel__result safety-panel__result--deny"
            }
            role="status"
          >
            <strong>{testResult.allowed ? "ALLOWED" : "DENIED"}</strong>
            <p>{testResult.reason}</p>
            {testResult.normalizedPath ? (
              <p className="safety-panel__muted">
                Resolved: <code>{testResult.normalizedPath}</code>
              </p>
            ) : null}
          </div>
        ) : null}
      </form>
    </section>
  );
}
