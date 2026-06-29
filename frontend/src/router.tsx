import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./shell/AppLayout";
import { ExecutiveBriefing } from "./views/ExecutiveBriefing";
import { LivingWorkspaceMock } from "./views/LivingWorkspaceMock";
import {
  ActionsStub,
  ExplorerStub,
} from "./views/StubPages";
import { LearnStub } from "./views/LearnStub";
import { StudioStub } from "./views/StudioStub";
import { SettingsPage } from "./views/SettingsPage";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<ExecutiveBriefing />} />
        <Route path="project/localbrain" element={<LivingWorkspaceMock />} />
        <Route path="explorer" element={<ExplorerStub />} />
        <Route path="studio/*" element={<StudioStub />} />
        <Route path="learn" element={<LearnStub />} />
        <Route path="actions" element={<ActionsStub />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
