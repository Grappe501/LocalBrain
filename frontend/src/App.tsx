import { BrowserRouter } from "react-router-dom";
import { ActiveWorkspaceProvider } from "./context/ActiveWorkspaceContext";
import { AppSettingsProvider } from "./context/AppSettingsContext";
import { ModuleRegistryProvider } from "./context/ModuleRegistryContext";
import { AppRouter } from "./router";

export default function App() {
  return (
    <BrowserRouter>
      <ModuleRegistryProvider>
        <ActiveWorkspaceProvider>
          <AppSettingsProvider>
            <AppRouter />
          </AppSettingsProvider>
        </ActiveWorkspaceProvider>
      </ModuleRegistryProvider>
    </BrowserRouter>
  );
}
