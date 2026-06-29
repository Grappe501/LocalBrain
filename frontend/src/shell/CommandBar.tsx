import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { CommandResponse } from "@localbrain/shared";
import { fetchCommandStatus, sendCommand } from "../api/command";
import { useActiveWorkspace } from "../context/ActiveWorkspaceContext";
import { useAppSettings } from "../context/AppSettingsContext";
import { MOCK_SIGNAL_COUNT } from "../data/mockLocalbrainWorkspace";
import { CommandPalette } from "./CommandPalette";

export function CommandBar() {
  const { workspace, loading } = useActiveWorkspace();
  const { setPaletteOpen } = useAppSettings();
  const [command, setCommand] = useState("");
  const [lastResponse, setLastResponse] = useState<CommandResponse | null>(null);
  const [keyConfigured, setKeyConfigured] = useState<boolean | null>(null);
  const [model, setModel] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const pillId = workspace?.workspace_id ?? "localbrain";
  const pillTitle = workspace?.title ?? "LocalBrain";
  const pillFocus = workspace?.current_focus;

  useEffect(() => {
    void fetchCommandStatus()
      .then((s) => {
        setKeyConfigured(s.key_configured);
        setModel(s.model);
      })
      .catch(() => setKeyConfigured(false));
  }, []);

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
    if (!message || submitting) return;

    setSubmitting(true);
    try {
      const data = await sendCommand({
        message,
        workspace_id: pillId,
      });
      setLastResponse(data);
    } catch {
      setLastResponse({
        intent: "ERROR",
        action_class: "general_query",
        message: "Backend unavailable — start npm run dev",
        key_configured: false,
        model: null,
        tokens_estimate: null,
        context_used: [],
        recommend_only: true,
        logged: false,
      });
    } finally {
      setSubmitting(false);
      setCommand("");
    }
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
            placeholder={
              keyConfigured === false
                ? "Ask CoS (offline — set OPENAI_API_KEY)…"
                : "Ask the Chief of Staff… (Ctrl+Space for palette)"
            }
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            aria-label="Chief of Staff command input"
            disabled={submitting}
          />
          <button type="submit" className="command-bar__submit" disabled={submitting}>
            {submitting ? "…" : "Ask CoS"}
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

      <p className="command-bar__meta" role="status">
        {keyConfigured === null
          ? "CoS command layer · checking API key…"
          : keyConfigured
            ? `OpenAI ready · ${model || "default model"} · LB-OS-008`
            : "OpenAI key not set — offline answers from workspace + asset registry"}
      </p>

      {lastResponse ? (
        <aside className="command-bar__response-panel" role="status">
          <div className="command-bar__response-header">
            <span className={`command-bar__intent command-bar__intent--${lastResponse.intent.toLowerCase()}`}>
              {lastResponse.intent}
            </span>
            {lastResponse.tokens_estimate != null ? (
              <span className="command-bar__tokens">~{lastResponse.tokens_estimate} tokens</span>
            ) : null}
          </div>
          <p className="command-bar__response">{lastResponse.message}</p>
          {lastResponse.context_used.length > 0 ? (
            <p className="command-bar__context">
              Context: {lastResponse.context_used.join(", ")}
            </p>
          ) : null}
        </aside>
      ) : null}

      <CommandPalette />
    </>
  );
}
