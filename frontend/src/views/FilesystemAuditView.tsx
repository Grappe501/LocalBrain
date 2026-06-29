import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { FilesystemMappingAudit } from "@localbrain/shared";
import { auditExportUrl, fetchFilesystemAudit } from "../api/migration";
import { ExecutiveQuestionShell } from "../components/ExecutiveQuestionShell";

function formatBytes(bytes: number): string {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="migration__panel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function FilesystemAuditView() {
  const [audit, setAudit] = useState<FilesystemMappingAudit | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (refresh = false) => {
    try {
      setError(null);
      if (refresh) setRefreshing(true);
      setAudit(await fetchFilesystemAudit(refresh));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load filesystem audit");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load(false);
  }, [load]);

  if (loading && !audit) {
    return (
      <div className="migration">
        <p>Running H:/ filesystem mapping audit…</p>
      </div>
    );
  }

  if (error && !audit) {
    return (
      <div className="migration">
        <p className="migration__error">{error}</p>
      </div>
    );
  }

  if (!audit) return null;

  return (
    <div className="migration">
      <ExecutiveQuestionShell route="/migration/audit" observedAt={audit.observed_at} />

      <header className="migration__header">
        <p className="migration__crumb">
          <Link to="/migration">Migration</Link> / Filesystem Mapping Audit
        </p>
        <h1>Full Filesystem Mapping Audit</h1>
        <p className="migration__meta">
          LB-OS-019 · {audit.paths_scanned} paths scanned · confidence{" "}
          {audit.mapping_confidence}% ({audit.mapping_confidence_label}) · run {audit.run_id.slice(0, 8)}
        </p>
        <p className="migration__rule">{audit.principle}</p>
        <ul className="migration__guardrails">
          {audit.guardrails.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
        <div className="migration__actions-bar">
          <button type="button" disabled={refreshing} onClick={() => void load(true)}>
            {refreshing ? "Refreshing…" : "Refresh audit"}
          </button>
          <a href={auditExportUrl()} download="migration_inventory.json">
            Export migration_inventory.json
          </a>
        </div>
      </header>

      <div className="migration__grid">
        <Panel title="Workspace root coverage">
          <ul className="migration__list">
            {audit.workspace_coverage.map((ws) => (
              <li key={ws.workspace_id}>
                <strong>{ws.title}</strong> ({ws.workspace_id}) — {ws.indexed_asset_count} assets ·{" "}
                {formatBytes(ws.indexed_bytes)}
                <br />
                <span className="migration__note">{ws.coverage_note}</span>
                {ws.roots.length > 0 ? (
                  <ul>
                    {ws.roots.map((r) => (
                      <li key={r}>
                        <code>{r}</code>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Top-level H:/ inventory">
          <table className="migration__table migration__table--compact">
            <thead>
              <tr>
                <th>Folder</th>
                <th>Assets</th>
                <th>Size</th>
                <th>Claimed</th>
              </tr>
            </thead>
            <tbody>
              {audit.top_level_inventory.map((row) => (
                <tr key={row.path}>
                  <td className="migration__path">{row.path}</td>
                  <td>{row.asset_count}</td>
                  <td>{formatBytes(row.size_bytes)}</td>
                  <td>{row.workspace_claimed ? row.claiming_workspace_id : "unclaimed"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="Folder stats (indexed)">
          <table className="migration__table migration__table--compact">
            <thead>
              <tr>
                <th>Folder</th>
                <th>Files</th>
                <th>Dirs</th>
                <th>Size</th>
              </tr>
            </thead>
            <tbody>
              {audit.folder_stats.slice(0, 20).map((f) => (
                <tr key={f.folder_path}>
                  <td className="migration__path">{f.folder_path}</td>
                  <td>{f.file_count}</td>
                  <td>{f.directory_count}</td>
                  <td>{formatBytes(f.size_bytes)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="Stale / dormant candidates">
          {audit.stale_candidates.length === 0 ? (
            <p>None flagged from current index.</p>
          ) : (
            <ul className="migration__list">
              {audit.stale_candidates.slice(0, 15).map((s) => (
                <li key={s.folder_path}>
                  <code>{s.folder_path}</code> — {s.days_since_activity}d idle · {s.asset_count} assets
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Unclaimed folders">
          {audit.unclaimed_folders.length === 0 ? (
            <p>All top-level H: folders claimed by a workspace.</p>
          ) : (
            <ul className="migration__list">
              {audit.unclaimed_folders.map((u) => (
                <li key={u.path}>
                  <code>{u.path}</code> — {u.reason}
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Duplicate workspace candidates">
          {audit.duplicate_workspace_candidates.length === 0 ? (
            <p>No overlapping workspace roots detected.</p>
          ) : (
            <ul className="migration__list">
              {audit.duplicate_workspace_candidates.map((d) => (
                <li key={d.workspace_ids.join("-")}>
                  {d.workspace_ids.join(" ↔ ")} — {d.reason}
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="C:/ misplaced work-data (from index only)">
          {audit.c_misplaced_candidates.length === 0 ? (
            <p>No C: misplaced candidates in current index.</p>
          ) : (
            <ul className="migration__list">
              {audit.c_misplaced_candidates.slice(0, 15).map((c) => (
                <li key={c.path}>
                  <code>{c.path}</code> — {c.reason}
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Next-step recommendations">
          <p className="migration__link-row">
            <Link to="/migration/consolidation">Open Executive Consolidation Briefing (LB-OS-020) →</Link>
          </p>
          <ul className="migration__list">
            {audit.recommendations.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
