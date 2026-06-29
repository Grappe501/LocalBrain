import type { LivingWorkspace } from "@localbrain/shared";

type Props = {
  workspace: LivingWorkspace;
};

export function WorkspacePhaseCard({ workspace }: Props) {
  const p = workspace.profile;

  return (
    <section className="workspace-card">
      <h2>Mission &amp; phase</h2>
      {p.mission ? <p className="workspace-card__mission">{p.mission}</p> : null}
      {p.current_phase ? (
        <p>
          Current phase: <strong>{p.current_phase}</strong>
        </p>
      ) : null}
      {workspace.success_definition ? (
        <div className="workspace-card__success">
          <h3>Success definition</h3>
          <p>{workspace.success_definition}</p>
        </div>
      ) : null}
      <div className="workspace-slices">
        <div>
          <h3>Completed</h3>
          <ul>
            {(p.completed_slices ?? []).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Active</h3>
          <p>{p.active_slice ?? "—"}</p>
        </div>
        <div>
          <h3>Next</h3>
          <ul>
            {(p.next_slices ?? []).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
