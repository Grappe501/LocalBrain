import { Navigate, useParams } from "react-router-dom";
import { LivingWorkspaceDashboard } from "./LivingWorkspaceDashboard";

export function WorkspaceRoute() {
  const { workspaceId } = useParams();
  if (!workspaceId) {
    return <Navigate to="/workspace/localbrain" replace />;
  }
  return <LivingWorkspaceDashboard workspaceId={workspaceId} />;
}

export function ProjectRedirect() {
  const { workspaceId } = useParams();
  return <Navigate to={`/workspace/${workspaceId ?? "localbrain"}`} replace />;
}
