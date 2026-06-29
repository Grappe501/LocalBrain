import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { CommandResponse, CosRecommendation } from "@localbrain/shared";
import { createCosProposals, fetchCommandStatus, sendCommand } from "../api/command";
import { useActiveWorkspace } from "../context/ActiveWorkspaceContext";
import { useAppSettings } from "../context/AppSettingsContext";
import { MOCK_SIGNAL_COUNT } from "../data/mockLocalbrainWorkspace";
import { CommandPalette } from "./CommandPalette";

function confidenceClass(level: string): string {
  return `command-bar__confidence command-bar__confidence--${level}`;
}

function RecommendationCard({
  rec,
  selected,
  onToggle,
}: {
  rec: CosRecommendation;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <article className={`command-bar__rec ${selected ? "command-bar__rec--selected" : ""}`}>
      <label className="command-bar__rec-check">
        <input
          type="checkbox"
          checked={selected}
          disabled={!rec.proposal_eligible}
          onChange={onToggle}
        />
        <strong>{rec.what}</strong>
      </label>
      <p className={confidenceClass(rec.confidence)}>
        Confidence: {rec.confidence.toUpperCase()}
      </p>
      <ul className="command-bar__rec-why">
        {rec.why.map((w) => (
          <li key={w}>{w}</li>
        ))}
      </ul>
      <p className="command-bar__rec-if">
        <span>If approved:</span> {rec.if_approved}
      </p>
    </article>
  );
}

export function CommandBar() {
  const { workspace, loading } = useActiveWorkspace();
  const { setPaletteOpen } = useAppSettings();
  const [command, setCommand] = useState("");
  const [lastResponse, setLastResponse] = useState<CommandResponse | null>(null);
  const [selectedRecIds, setSelectedRecIds] = useState<Set<string>>(new Set());
  const [keyConfigured, setKeyConfigured] = useState<boolean | null>(null);
  const [model, setModel] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [creatingProposals, setCreatingProposals] = useState(false);

  const pillId = workspace?.workspace_id ?? "localbrain";
  const pillTitle = workspace?.title ?? "LocalBrain";
  const pillFocus = workspace?.current_focus;

  const orchestration = lastResponse?.orchestration ?? null;
  const eligibleRecs =
    orchestration?.recommendations.filter((r) => r.proposal_eligible) ?? [];

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

  useEffect(() => {
    if (orchestration) {
      setSelectedRecIds(
        new Set(eligibleRecs.map((r) => r.id)),
      );
    }
  }, [orchestration?.orchestration_id]);

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

  async function handleCreateProposals() {
    if (!orchestration || creatingProposals) return;

    setCreatingProposals(true);
    try {
      const ids = Array.from(selectedRecIds);
      const result = await createCosProposals({
        orchestration_id: orchestration.orchestration_id,
        recommendation_ids: ids.length > 0 ? ids : undefined,
      });

      setLastResponse((prev) =>
        prev
          ? {
              ...prev,
              proposed_action_ids: result.action_ids,
              actions_queue_path: result.action_ids.length > 0 ? "/actions" : undefined,
              message:
                prev.message +
                `\n\n**${result.action_ids.length} proposal(s)** added to Actions queue. Skipped ${result.skipped}.`,
            }
          : prev,
      );
    } catch (e) {
      setLastResponse((prev) =>
        prev
          ? {
              ...prev,
              message: `${prev.message}\n\nCould not create proposals: ${e instanceof Error ? e.message : "error"}`,
            }
          : prev,
      );
    } finally {
      setCreatingProposals(false);
    }
  }

  function toggleRec(id: string) {
    setSelectedRecIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const proposalCount = lastResponse?.proposed_action_ids?.length ?? 0;

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
          ? "CoS orchestration · checking API key…"
          : keyConfigured
            ? `OpenAI ready · ${model || "default model"} · LB-OS-010.5`
            : "Offline orchestration — registry + intelligence · no auto-execution"}
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

          {orchestration && orchestration.recommendations.length > 0 ? (
            <div className="command-bar__recs">
              <h3 className="command-bar__recs-title">Recommendations</h3>
              {orchestration.recommendations.map((rec) => (
                <RecommendationCard
                  key={rec.id}
                  rec={rec}
                  selected={selectedRecIds.has(rec.id)}
                  onToggle={() => toggleRec(rec.id)}
                />
              ))}
              {eligibleRecs.length > 0 && proposalCount === 0 ? (
                <button
                  type="button"
                  className="command-bar__create-proposals"
                  disabled={creatingProposals}
                  onClick={() => void handleCreateProposals()}
                >
                  {creatingProposals ? "Creating…" : "Create proposals in Actions queue"}
                </button>
              ) : null}
            </div>
          ) : null}

          {proposalCount > 0 || lastResponse.actions_queue_path ? (
            <p className="command-bar__actions-link">
              <Link to="/actions">
                Review {proposalCount > 0 ? `${proposalCount} proposal(s)` : "Actions queue"} →
              </Link>
            </p>
          ) : null}

          {lastResponse.context_used.length > 0 ? (
            <p className="command-bar__context">
              Capabilities: {lastResponse.context_used.join(", ")}
            </p>
          ) : null}
        </aside>
      ) : null}

      <CommandPalette />
    </>
  );
}
