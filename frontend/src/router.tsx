import { Navigate, Route, Routes } from "react-router-dom";
import { useModuleRegistry } from "./context/ModuleRegistryContext";
import { AppLayout } from "./shell/AppLayout";
import { ExecutiveBriefing } from "./views/ExecutiveBriefing";
import { ProjectRedirect, WorkspaceRoute } from "./views/WorkspaceRoute";
import { ActionsView } from "./views/ActionsView";
import { KnowledgeExplorerView } from "./views/KnowledgeExplorerView";
import { LearnStub } from "./views/LearnStub";
import { SettingsPage } from "./views/SettingsPage";
import { LazyModuleRoute } from "./views/LazyModuleRoute";

export function AppRouter() {
  const { departmentModules, loading } = useModuleRegistry();

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<ExecutiveBriefing />} />
        <Route path="workspace/:workspaceId" element={<WorkspaceRoute />} />
        <Route path="project/:workspaceId" element={<ProjectRedirect />} />
        <Route path="explorer" element={<KnowledgeExplorerView />} />
        <Route path="learn" element={<LearnStub />} />
        <Route path="actions" element={<ActionsView />} />
        <Route path="settings" element={<SettingsPage />} />
        {!loading &&
          departmentModules.flatMap((m) =>
            m.routes.map((route) => (
              <Route
                key={`${m.module_id}-${route.path}`}
                path={route.pattern}
                element={<LazyModuleRoute moduleId={m.module_id} />}
              />
            )),
          )}
        <Route path="studio/*" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
