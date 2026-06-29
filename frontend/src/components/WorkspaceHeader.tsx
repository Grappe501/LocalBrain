import type { LivingWorkspace } from "@localbrain/shared";

type Props = {
  workspace: LivingWorkspace;
};

function healthLabel(score: number | null): string {
  if (score === null) return "Unknown";
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Fair";
  return "At risk";
}

export function WorkspaceHeader({ workspace }: Props) {
  return (
    <header
      className="workspace-header"
      style={{ borderLeftColor: workspace.workspace_color }}
    >
      <div className="workspace-header__avatar" aria-hidden>
        {workspace.workspace_avatar}
      </div>
      <div>
        <h1>{workspace.title}</h1>
        <p className="workspace-header__meta">
          <span className="workspace-header__type">{workspace.workspace_type}</span>
          <span className="workspace-header__id">{workspace.workspace_id}</span>
        </p>
        <p className="workspace-header__health">
          Health: <strong>{healthLabel(workspace.health_score)}</strong>
          {workspace.health_score !== null ? ` (${workspace.health_score})` : ""}
        </p>
        {workspace.current_focus ? (
          <p className="workspace-header__focus">
            Current focus: <strong>{workspace.current_focus}</strong>
          </p>
        ) : null}
      </div>
    </header>
  );
}
