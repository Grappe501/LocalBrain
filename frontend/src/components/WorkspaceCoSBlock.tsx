import type { LivingWorkspace } from "@localbrain/shared";

type Props = {
  workspace: LivingWorkspace;
};

export function WorkspaceCoSBlock({ workspace }: Props) {
  const p = workspace.profile;

  return (
    <section className="workspace-card">
      <h2>Chief of Staff</h2>
      {p.chief_of_staff_summary ? <p>{p.chief_of_staff_summary}</p> : null}
      {p.recommended_next_action ? (
        <p className="workspace-card__action">
          Recommended next action: <strong>{p.recommended_next_action}</strong>
        </p>
      ) : null}
      {(p.recent_decisions ?? []).length > 0 ? (
        <>
          <h3>Recent decisions</h3>
          <ul>
            {p.recent_decisions!.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </>
      ) : null}
      {workspace.executive_context ? (
        <div className="workspace-card__context">
          <h3>Why this workspace exists</h3>
          <p>{workspace.executive_context}</p>
        </div>
      ) : null}
    </section>
  );
}
