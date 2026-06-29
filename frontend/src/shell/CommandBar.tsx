import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useActiveWorkspace } from "../context/ActiveWorkspaceContext";
import { useAppSettings } from "../context/AppSettingsContext";
import { MOCK_SIGNAL_COUNT } from "../data/mockLocalbrainWorkspace";
import { CommandPalette } from "./CommandPalette";

type CommandStubResponse = {
  intent: string;
  message: string;
};

export function CommandBar() {
  const { workspace, loading } = useActiveWorkspace();
  const { setPaletteOpen } = useAppSettings();
  const [command, setCommand] = useState("");
  const [lastResponse, setLastResponse] = useState<string | null>(null);

  const pillId = workspace?.workspace_id ?? "localbrain";
  const pillTitle = workspace?.title ?? "LocalBrain";
  const pillFocus = workspace?.current_focus;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.code === "Space") {
        event.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setPaletteOpen]);

  async function submitCommand(event: React.FormEvent) {
    event.preventDefault();
    const message = command.trim();
    if (!message) return;

    try {
      const res = await fetch("/api/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = (await res.json()) as CommandStubResponse;
      setLastResponse(`${data.intent}: ${data.message}`);
    } catch {
      setLastResponse("STUB: backend unavailable (start npm run dev)");
    }
    setCommand("");
  }

  return (
    <>
      <header className="command-bar">
        <div className="command-bar__brand">
          <span className="command-bar__cos-label">Chief of Staff</span>
          <Link to={`/workspace/${pillId}`} className="command-bar__pill">
            <span className="command-bar__pill-name">
              {loading ? "…" : pillTitle}
            </span>
            <span className="command-bar__pill-id">{pillId}</span>
            {pillFocus ? (
              <span className="command-bar__pill-focus">{pillFocus}</span>
            ) : null}
          </Link>
        </div>

        <form className="command-bar__form" onSubmit={submitCommand}>
          <input
            type="text"
            className="command-bar__input"
            placeholder="Command the OS… (Ctrl+Space for palette)"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            aria-label="Chief of Staff command input"
          />
          <button type="submit" className="command-bar__submit">
            Route
          </button>
        </form>

        <button
          type="button"
          className="command-bar__signals"
          aria-label={`${MOCK_SIGNAL_COUNT} signals`}
        >
          Signals <span className="command-bar__signals-count">{MOCK_SIGNAL_COUNT}</span>
        </button>
      </header>

      {lastResponse ? (
        <p className="command-bar__response" role="status">
          Last command: {lastResponse}
        </p>
      ) : null}

      <CommandPalette />
    </>
  );
}
