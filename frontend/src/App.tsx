import { BrowserRouter } from "react-router-dom";
import { AppSettingsProvider } from "./context/AppSettingsContext";
import { AppRouter } from "./router";

export default function App() {
  return (
    <BrowserRouter>
      <AppSettingsProvider>
        <AppRouter />
      </AppSettingsProvider>
    </BrowserRouter>
  );
}
