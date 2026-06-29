import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type {
  ExecutiveWorkspaceArchitectureReport,
  OrganizationTreeNode,
  Projection,
  WorkspaceBlueprint,
} from "@localbrain/shared";
import { fetchWorkspaceArchitecture } from "../api/migration";
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

function OrgTreeNode({ node, depth = 0 }: { node: OrganizationTreeNode; depth?: number }) {
  return (
    <li className={`ewa-tree__node ewa-tree__node--${node.kind}`} style={{ marginLeft: depth * 12 }}>
      <span className="ewa-tree__label">{node.label}</span>
      {node.workspace_id ? (
        <span className="ewa-tree__id">{node.workspace_id}</span>
      ) : null}
      {node.children && node.children.length > 0 ? (
        <ul className="ewa-tree">
          {node.children.map((child) => (
            <OrgTreeNode key={child.node_id} node={child} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function ProjectionList({ projections, label }: { projections: Projection[]; label: string }) {
  if (projections.length === 0) {
    return <p className="ewa__empty">No {label} projections</p>;
  }
  return (
    <ul className="ewa__projections">
      {projections.map((p) => (
        <li key={p.projection_id}>
          <code className="migration__path">{p.physical_ref}</code>
          <span className={`ewa__status ewa__status--${p.status}`}>{p.status}</span>
          <span className="ewa__kind">{p.projection_kind}</span>
        </li>
      ))}
    </ul>
  );
}

function BlueprintCard({ blueprint }: { blueprint: WorkspaceBlueprint }) {
  return (
    <article className="ewa-blueprint">
      <header className="ewa-blueprint__header">
        <h3>{blueprint.title}</h3>
        <span className="ewa-blueprint__id">{blueprint.logical_id}</span>
        <span className={`ewa-blueprint__confidence ewa-blueprint__confidence--${blueprint.confidence_label}`}>
          {blueprint.confidence_percent}% · {blueprint.confidence_label}
        </span>
      </header>
      <div className="ewa-blueprint__columns">
        <div>
          <h4>Current projection</h4>
          <ProjectionList projections={blueprint.current_projections} label="current" />
        </div>
        <div>
          <h4>Recommended projection</h4>
          <ProjectionList projections={blueprint.recommended_projections} label="recommended" />
        </div>
      </div>
      <ul className="migration__list">
        {blueprint.why.map((w) => (
          <li key={w}>{w}</li>
        ))}
      </ul>
      <p className="ewa-blueprint__impact">
        Migration impact: {blueprint.migration_impact.folder_count} folder(s) ·{" "}
        {blueprint.migration_impact.file_count} file(s) ·{" "}
        {blueprint.migration_impact.broken_workspace_refs} broken ref(s)
        {blueprint.simulation_available ? " · simulation ready (023)" : null}
      </p>
    </article>
  );
}

export function WorkspaceArchitectureView() {
  const [report, setReport] = useState<ExecutiveWorkspaceArchitectureReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setError(null);
      setReport(await fetchWorkspaceArchitecture());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load workspace architecture");
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
        <p>Loading workspace architecture…</p>
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
    <div className="migration ewa">
      <ExecutiveQuestionShell route="/migration/workspace-architecture" observedAt={report.observed_at} />

      <header className="migration__header">
        <p className="migration__crumb">
          <Link to="/program-office">Program Office</Link> /{" "}
          <Link to="/migration">Migration</Link> / Workspace Architecture
        </p>
        <h1>Executive Workspace Architecture</h1>
        <p className="migration__meta">
          {report.slice_id} · {report.engine_id} · Read-only · Updated{" "}
          {new Date(report.observed_at).toLocaleTimeString()}
        </p>
        <p className="migration__rule">
          Executive World → Logical World → Projection Layer → Physical World
        </p>
        <p className="migration__link-row">
          <Link to="/migration">Migration Planner →</Link>
          {" · "}
          <Link to="/migration/audit">Filesystem Audit (EQ-015) →</Link>
          {" · "}
          <Link to="/migration/consolidation">Consolidation Briefing →</Link>
          {" · "}
          <Link to="/migration/digital-land-survey">Digital Land Survey (022) →</Link>
        </p>
        <ul className="migration__guardrails">
          <li>Workspace identity is Logical — paths are projections only</li>
          <li>No mkdir · mv · rename · cloud sync in this slice</li>
          <li>StorageProvider: stub contract only (runtime_enabled: false)</li>
        </ul>
      </header>

      <div className="migration__grid">
        <Panel title="Organization tree (Logical World)">
          <ul className="ewa-tree ewa-tree--root">
            <OrgTreeNode node={report.organization_tree} />
          </ul>
        </Panel>

        <Panel title="Physical World survey (C: / H:)">
          <table className="migration__table">
            <thead>
              <tr>
                <th>Volume</th>
                <th>Role</th>
                <th>Health</th>
                <th>Free</th>
                <th>Available</th>
              </tr>
            </thead>
            <tbody>
              {report.physical_world.volumes.map((v) => (
                <tr key={v.provider_id}>
                  <td>{v.label}</td>
                  <td>{v.role}</td>
                  <td>{v.health}</td>
                  <td>{formatBytes(v.free_bytes)}</td>
                  <td>{v.available ? "yes" : "no"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3 className="ewa__subhead">Storage providers (stub)</h3>
          <ul className="migration__list">
            {report.physical_world.storage_providers.map((p) => (
              <li key={p.provider_id}>
                <strong>{p.label}</strong> · {p.provider_type} · {p.role} · runtime{" "}
                {p.runtime_enabled ? "on" : "off"}
              </li>
            ))}
          </ul>
          {report.physical_world.binding_issues.length > 0 ? (
            <>
              <h3 className="ewa__subhead">Binding issues</h3>
              <table className="migration__table migration__table--compact">
                <thead>
                  <tr>
                    <th>Kind</th>
                    <th>Path / workspace</th>
                    <th>Summary</th>
                  </tr>
                </thead>
                <tbody>
                  {report.physical_world.binding_issues.slice(0, 20).map((issue) => (
                    <tr key={issue.issue_id}>
                      <td>{issue.kind}</td>
                      <td className="migration__path">
                        {issue.path ?? issue.workspace_id ?? "—"}
                      </td>
                      <td>{issue.summary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p>No binding issues detected.</p>
          )}
        </Panel>

        <Panel title="Workspace DNA (projections[])">
          {report.workspace_dna.map((dna) => (
            <article key={dna.workspace_id} className="ewa-dna">
              <h3>
                {dna.title}{" "}
                <span className="ewa-dna__meta">
                  {dna.mission_category ?? "—"} · {dna.lifecycle}
                </span>
              </h3>
              <ProjectionList projections={dna.projections} label="registered" />
            </article>
          ))}
        </Panel>

        <Panel title="Workspace blueprints (current vs recommended)">
          {report.blueprints.map((bp) => (
            <BlueprintCard key={bp.workspace_id} blueprint={bp} />
          ))}
        </Panel>
      </div>
    </div>
  );
}
