import { Outlet } from "react-router-dom";
import { CommandBar } from "./CommandBar";
import { ContextPanel } from "./ContextPanel";
import { DepartmentNav } from "./DepartmentNav";
import { SafetyBanner } from "./SafetyBanner";
import { SystemStatusDock } from "./SystemStatusDock";

export function AppLayout() {
  return (
    <div className="os-shell os-shell--tech">
      <CommandBar />
      <DepartmentNav />
      <div className="os-shell__body">
        <main className="os-shell__main">
          <SafetyBanner />
          <Outlet />
        </main>
        <ContextPanel />
      </div>
      <SystemStatusDock />
    </div>
  );
}
