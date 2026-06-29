import { BrowserRouter } from "react-router-dom";
import { ActiveWorkspaceProvider } from "./context/ActiveWorkspaceContext";
import { AppSettingsProvider } from "./context/AppSettingsContext";
import { AppRouter } from "./router";

export default function App() {
  return (
    <BrowserRouter>
      <ActiveWorkspaceProvider>
        <AppSettingsProvider>
          <AppRouter />
        </AppSettingsProvider>
      </ActiveWorkspaceProvider>
    </BrowserRouter>
  );
}
