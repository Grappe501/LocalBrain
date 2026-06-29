import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { DigitalLandSurveyReport } from "@localbrain/shared";
import { fetchDigitalLandSurvey } from "../api/migration";
import { ExecutiveQuestionShell } from "../components/ExecutiveQuestionShell";

function formatBytes(bytes: number | null): string {
  if (bytes === null) return "—";
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="migration__panel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function DigitalLandSurveyView() {
  const [report, setReport] = useState<DigitalLandSurveyReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setError(null);
      setReport(await fetchDigitalLandSurvey());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load digital land survey");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !report) {
    return (
      <div className="migration">
        <p>Loading digital land survey…</p>
      </div>
    );
  }

  if (error && !report) {
    return (
      <div className="migration">
        <p className="migration__error">{error}</p>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="migration dls">
      <ExecutiveQuestionShell route="/migration/digital-land-survey" observedAt={report.observed_at} />

      <header className="migration__header">
        <p className="migration__crumb">
          <Link to="/program-office">Program Office</Link> /{" "}
          <Link to="/migration">Migration</Link> / Digital Land Survey
        </p>
        <h1>Digital Land Survey</h1>
        <p className="migration__meta">
          {report.slice_id} · {report.engine_id} · Read-only · Mapping confidence{" "}
          {report.mapping_confidence_percent}% ({report.mapping_confidence_label}) · Updated{" "}
          {new Date(report.observed_at).toLocaleTimeString()}
        </p>
        <p className="migration__rule">{report.core_rule}</p>
        <p className="migration__link-row">
          <Link to="/migration/workspace-architecture">Workspace Architecture (021) →</Link>
          {" · "}
          <Link to="/migration/proof">Migration Proof (023) →</Link>
          {" · "}
          <Link to="/migration/planning">Migration Planning (024) →</Link>
          {" · "}
          <Link to="/migration/audit">Filesystem Audit (019) →</Link>
        </p>
        <ul className="migration__guardrails">
          {report.guardrails.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </header>

      <section className="dls__summary">
        <p>{report.storage_topology.summary}</p>
        <p>{report.migration_complexity.summary}</p>
        <p>{report.activity_signals.summary}</p>
      </section>

      <div className="migration__grid">
        <Panel title="Physical storage topology">
          <table className="migration__table">
            <thead>
              <tr>
                <th>Volume</th>
                <th>Role</th>
                <th>Health</th>
                <th>Available</th>
              </tr>
            </thead>
            <tbody>
              {report.storage_topology.volumes.map((v) => (
                <tr key={v.provider_id}>
                  <td>{v.label}</td>
                  <td>{v.role}</td>
                  <td>{v.health}</td>
                  <td>{v.available ? "yes" : "no"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="dls__note">
            {report.storage_topology.h_top_level_count} H: top-level namespace(s) ·{" "}
            {report.storage_topology.scanned_roots.length} scanned root(s)
          </p>
        </Panel>

        <Panel title="Drive utilization">
          <table className="migration__table">
            <thead>
              <tr>
                <th>Drive</th>
                <th>Used</th>
                <th>Free</th>
                <th>Indexed</th>
                <th>Headroom</th>
              </tr>
            </thead>
            <tbody>
              {report.drive_utilization.map((d) => (
                <tr key={d.drive}>
                  <td>{d.drive}</td>
                  <td>{d.used_percent !== null ? `${d.used_percent}%` : "—"}</td>
                  <td>{formatBytes(d.free_bytes)}</td>
                  <td>
                    {d.indexed_asset_count} ({formatBytes(d.indexed_bytes)})
                  </td>
                  <td>{d.headroom_label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="Migration complexity">
          <p>
            Overall: <strong>{report.migration_complexity.overall_score}/100</strong> (
            {report.migration_complexity.overall_label})
          </p>
          <table className="migration__table migration__table--compact">
            <thead>
              <tr>
                <th>Workspace</th>
                <th>Score</th>
                <th>Folders</th>
                <th>Files</th>
                <th>Blueprint</th>
              </tr>
            </thead>
            <tbody>
              {report.migration_complexity.workspace_scores.slice(0, 15).map((w) => (
                <tr key={w.workspace_id}>
                  <td>{w.title}</td>
                  <td>{w.complexity_score}</td>
                  <td>{w.folder_count}</td>
                  <td>{w.file_count}</td>
                  <td>{w.blueprint_confidence_percent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="Projection coverage (Location-aware)">
          {report.projection_coverage.map((p) => (
            <article key={p.workspace_id} className="dls__coverage">
              <h3>
                {p.title}{" "}
                <span className="dls__pct">{p.coverage_percent}% role coverage</span>
              </h3>
              {p.bound_locations.length > 0 ? (
                <ul className="migration__list">
                  {p.bound_locations.map((loc) => (
                    <li key={`${loc.location_id}-${loc.physical_ref}`}>
                      <strong>{loc.location_label}</strong> ({loc.location_role}) ·{" "}
                      <code className="migration__path">{loc.physical_ref}</code> · {loc.status}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No bound locations</p>
              )}
              {p.missing_location_roles.length > 0 ? (
                <p className="dls__missing">
                  Missing roles: {p.missing_location_roles.join(", ")}
                </p>
              ) : null}
            </article>
          ))}
        </Panel>

        <Panel title="Folder ownership confidence">
          <table className="migration__table migration__table--compact">
            <thead>
              <tr>
                <th>Confidence</th>
                <th>Path</th>
                <th>Workspace</th>
                <th>Size</th>
              </tr>
            </thead>
            <tbody>
              {report.folder_ownership.slice(0, 20).map((f) => (
                <tr key={f.path}>
                  <td>
                    {f.confidence_percent}% ({f.confidence_label})
                  </td>
                  <td className="migration__path">{f.path}</td>
                  <td>{f.workspace_title ?? "—"}</td>
                  <td>{formatBytes(f.size_bytes)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="Workspace coverage">
          <table className="migration__table migration__table--compact">
            <thead>
              <tr>
                <th>Workspace</th>
                <th>Roots</th>
                <th>Indexed</th>
                <th>Blueprint</th>
              </tr>
            </thead>
            <tbody>
              {report.workspace_coverage.map((w) => (
                <tr key={w.workspace_id}>
                  <td>{w.title}</td>
                  <td>{w.roots_registered}</td>
                  <td>
                    {w.indexed_asset_count} ({formatBytes(w.indexed_bytes)})
                  </td>
                  <td>{w.blueprint_confidence_percent ?? "—"}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="Orphaned data">
          <p>
            <strong>{report.orphaned_data.unclaimed_folders.length}</strong> unclaimed folder(s) ·{" "}
            <strong>{report.orphaned_data.orphan_workspaces.length}</strong> orphan workspace(s) ·{" "}
            <strong>{report.orphaned_data.c_drive_misplaced.length}</strong> C: misplaced
          </p>
          {report.orphaned_data.unclaimed_folders.slice(0, 10).map((u) => (
            <p key={u.path} className="migration__path">
              {u.path} — {formatBytes(u.size_bytes)}
            </p>
          ))}
        </Panel>

        <Panel title="Duplicate storage regions">
          {report.duplicate_storage_regions.length === 0 ? (
            <p>No duplicate regions detected.</p>
          ) : (
            report.duplicate_storage_regions.map((d) => (
              <article key={d.region_id} className="dls__dup">
                <p>
                  Workspaces: {d.workspace_ids.join(", ")}
                </p>
                <ul className="migration__list">
                  {d.overlapping_paths.map((p) => (
                    <li key={p}>
                      <code>{p}</code>
                    </li>
                  ))}
                </ul>
                <p>{d.reason}</p>
              </article>
            ))
          )}
        </Panel>

        <Panel title="Empty folder chains">
          {report.empty_folder_chains.length === 0 ? (
            <p>No empty folder chains detected.</p>
          ) : (
            <ul className="migration__list">
              {report.empty_folder_chains.slice(0, 15).map((e) => (
                <li key={e.path}>
                  <code className="migration__path">{e.path}</code> — {e.summary}
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Oversized media collections">
          {report.oversized_media_collections.length === 0 ? (
            <p>No significant media collections in index.</p>
          ) : (
            <table className="migration__table migration__table--compact">
              <thead>
                <tr>
                  <th>Folder</th>
                  <th>Files</th>
                  <th>Size</th>
                  <th>Kind</th>
                </tr>
              </thead>
              <tbody>
                {report.oversized_media_collections.map((m) => (
                  <tr key={m.folder_path}>
                    <td className="migration__path">{m.folder_path}</td>
                    <td>{m.media_file_count}</td>
                    <td>{formatBytes(m.total_bytes)}</td>
                    <td>{m.dominant_kind}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>

        <Panel title="Archive candidates">
          {report.archive_candidates.length === 0 ? (
            <p>No archive candidates from stale folder analysis.</p>
          ) : (
            <ul className="migration__list">
              {report.archive_candidates.slice(0, 15).map((a) => (
                <li key={a.folder_path}>
                  <code className="migration__path">{a.folder_path}</code> — {a.days_since_activity}d
                  inactive · {formatBytes(a.size_bytes)}
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Recommendations">
          <ul className="migration__list">
            {report.recommendations.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
