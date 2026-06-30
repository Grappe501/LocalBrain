import { Navigate, Route, Routes } from "react-router-dom";
import { useModuleRegistry } from "./context/ModuleRegistryContext";
import { AppLayout } from "./shell/AppLayout";
import { ExecutiveBriefing } from "./views/ExecutiveBriefing";
import { ProjectRedirect, WorkspaceRoute } from "./views/WorkspaceRoute";
import { ActionsView } from "./views/ActionsView";
import { KnowledgeExplorerView } from "./views/KnowledgeExplorerView";
import { LearnStub } from "./views/LearnStub";
import { ProgramOfficeView } from "./views/ProgramOfficeView";
import { SystemHealthView } from "./views/SystemHealthView";
import { AiProvidersView } from "./views/AiProvidersView";
import { MigrationPlannerView } from "./views/MigrationPlannerView";
import { FilesystemAuditView } from "./views/FilesystemAuditView";
import { ConsolidationBriefingView } from "./views/ConsolidationBriefingView";
import { WorkspaceArchitectureView } from "./views/WorkspaceArchitectureView";
import { DigitalLandSurveyView } from "./views/DigitalLandSurveyView";
import { MigrationProofView } from "./views/MigrationProofView";
import { MigrationPlanningView } from "./views/MigrationPlanningView";
import { MigrationApprovalView } from "./views/MigrationApprovalView";
import { MigrationCutoverView } from "./views/MigrationCutoverView";
import { SettingsPage } from "./views/SettingsPage";
import { OnboardingWizardView } from "./views/OnboardingWizardView";
import { InstanceSettingsView } from "./views/InstanceSettingsView";
import { ProvidersSettingsView } from "./views/ProvidersSettingsView";
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
        <Route path="program-office" element={<ProgramOfficeView />} />
        <Route path="system" element={<SystemHealthView />} />
        <Route path="system/providers" element={<AiProvidersView />} />
        <Route path="migration" element={<MigrationPlannerView />} />
        <Route path="migration/audit" element={<FilesystemAuditView />} />
        <Route path="migration/consolidation" element={<ConsolidationBriefingView />} />
        <Route path="migration/workspace-architecture" element={<WorkspaceArchitectureView />} />
        <Route path="migration/digital-land-survey" element={<DigitalLandSurveyView />} />
        <Route path="migration/proof" element={<MigrationProofView />} />
        <Route path="migration/planning" element={<MigrationPlanningView />} />
        <Route path="migration/approval" element={<MigrationApprovalView />} />
        <Route path="migration/cutover" element={<MigrationCutoverView />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="settings/onboarding" element={<OnboardingWizardView />} />
        <Route path="settings/providers" element={<ProvidersSettingsView />} />
        <Route path="settings/instance" element={<InstanceSettingsView />} />
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
