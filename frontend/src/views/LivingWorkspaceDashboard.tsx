import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { LivingWorkspace, WorkspaceEvent } from "@localbrain/shared";
import { fetchWorkspace, fetchWorkspaceEvents } from "../api/workspaces";
import { useActiveWorkspace } from "../context/ActiveWorkspaceContext";
import { WorkspaceCoSBlock } from "../components/WorkspaceCoSBlock";
import { WorkspaceEventTimeline } from "../components/WorkspaceEventTimeline";
import { WorkspaceHeader } from "../components/WorkspaceHeader";
import { WorkspacePhaseCard } from "../components/WorkspacePhaseCard";

type Props = {
  workspaceId: string;
};

export function LivingWorkspaceDashboard({ workspaceId }: Props) {
  const { selectWorkspace } = useActiveWorkspace();
  const [workspace, setWorkspace] = useState<LivingWorkspace | null>(null);
  const [events, setEvents] = useState<WorkspaceEvent[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setError(null);
        const [ws, ev] = await Promise.all([
          fetchWorkspace(workspaceId),
          fetchWorkspaceEvents(workspaceId),
        ]);
        if (cancelled) return;
        setWorkspace(ws);
        setEvents(ev);
        await selectWorkspace(workspaceId);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load workspace");
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [workspaceId, selectWorkspace]);

  if (error) {
    return (
      <article className="living-workspace">
        <p className="safety-panel__error">{error}</p>
        <Link to="/">← Executive Briefing</Link>
      </article>
    );
  }

  if (!workspace) {
    return (
      <article className="living-workspace">
        <p>Loading workspace…</p>
      </article>
    );
  }

  const flagEntries = Object.entries(workspace.flags).filter(([, v]) => v);

  return (
    <article className="living-workspace">
      <Link to="/" className="living-workspace__back">
        ← Executive Briefing
      </Link>

      <WorkspaceHeader workspace={workspace} />

      {flagEntries.length > 0 ? (
        <div className="workspace-flags">
          {flagEntries.map(([key]) => (
            <span key={key} className="workspace-flags__badge">
              {key.replace(/_/g, " ")}
            </span>
          ))}
        </div>
      ) : null}

      {workspace.filesystem_roots.length > 0 ? (
        <p className="workspace-roots">
          Roots: {workspace.filesystem_roots.map((r) => (
            <code key={r}>{r}</code>
          ))}
        </p>
      ) : null}

      <WorkspacePhaseCard workspace={workspace} />
      <WorkspaceCoSBlock workspace={workspace} />
      <WorkspaceEventTimeline events={events} />

      <section className="workspace-card workspace-card--muted">
        <h2>Links &amp; integrations</h2>
        <p>Repositories, contacts, and graph links — coming in later slices (empty stubs in 004).</p>
      </section>
    </article>
  );
}
