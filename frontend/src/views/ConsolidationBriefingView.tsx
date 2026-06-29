import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type {
  ConsolidationCategory,
  ConsolidationSimulationResult,
  ExecutiveConsolidationBriefing,
  ExecutiveIntelligenceCard,
} from "@localbrain/shared";
import { ExecutiveQuestionShell } from "../components/ExecutiveQuestionShell";
import { ExecutiveIntelligenceCardView } from "../components/ExecutiveIntelligenceCard";
import {
  dismissConsolidationCard,
  fetchConsolidationBriefing,
  fetchConsolidationCategory,
  simulateConsolidation,
} from "../api/consolidation";

const TABS: { id: ConsolidationCategory; label: string }[] = [
  { id: "duplicates", label: "Duplicates" },
  { id: "versions", label: "Versions" },
  { id: "folders", label: "Folders" },
  { id: "programs", label: "Programs" },
  { id: "knowledge", label: "Knowledge" },
  { id: "ignored", label: "Ignored" },
];

function formatBytes(bytes: number): string {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

function simplificationLabel(level: string): string {
  return level.charAt(0).toUpperCase() + level.slice(1);
}

export function ConsolidationBriefingView() {
  const [briefing, setBriefing] = useState<ExecutiveConsolidationBriefing | null>(null);
  const [tab, setTab] = useState<ConsolidationCategory | null>(null);
  const [tabCards, setTabCards] = useState<ExecutiveIntelligenceCard[]>([]);
  const [tabStub, setTabStub] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [simulatingId, setSimulatingId] = useState<string | null>(null);
  const [simulations, setSimulations] = useState<Record<string, ConsolidationSimulationResult>>({});
  const [bulkSimulation, setBulkSimulation] = useState<ConsolidationSimulationResult | null>(null);
  const [bulkSimulating, setBulkSimulating] = useState(false);

  const loadBriefing = useCallback(async () => {
    try {
      setError(null);
      setBriefing(await fetchConsolidationBriefing());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load briefing");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBriefing();
  }, [loadBriefing]);

  const loadTab = useCallback(async (category: ConsolidationCategory) => {
    setTab(category);
    try {
      const res = await fetchConsolidationCategory(category);
      setTabCards(res.cards);
      setTabStub(res.stub ? res.stub_message : null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load category");
    }
  }, []);

  const handleSimulate = async (cardId: string) => {
    setSimulatingId(cardId);
    try {
      const result = await simulateConsolidation([cardId]);
      setSimulations((prev) => ({ ...prev, [cardId]: result }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Simulation failed");
    } finally {
      setSimulatingId(null);
    }
  };

  const handleSimulateAll = async () => {
    if (!briefing) return;
    setBulkSimulating(true);
    try {
      const ids = briefing.priority_cards.map((c) => c.card_id);
      setBulkSimulation(await simulateConsolidation(ids));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Simulation failed");
    } finally {
      setBulkSimulating(false);
    }
  };

  const handleDismiss = async (cardId: string) => {
    try {
      await dismissConsolidationCard(cardId);
      await loadBriefing();
      if (tab) await loadTab(tab);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Dismiss failed");
    }
  };

  if (loading && !briefing) {
    return (
      <div className="consolidation">
        <p>Loading Executive Consolidation Briefing…</p>
      </div>
    );
  }

  if (error && !briefing) {
    return (
      <div className="consolidation">
        <p className="consolidation__error">{error}</p>
      </div>
    );
  }

  if (!briefing) return null;

  const score = briefing.consolidation_score;
  const opp = briefing.overall_opportunity;
  const risk = briefing.risk_assessment;
  const displayCards = tab ? tabCards : briefing.priority_cards;

  return (
    <div className="consolidation">
      <ExecutiveQuestionShell route="/migration/consolidation" />

      <header className="consolidation__header">
        <p className="consolidation__crumb">
          <Link to="/program-office">Program Office</Link> /{" "}
          <Link to="/migration">Migration</Link> / Consolidation Briefing
        </p>
        <h1>Executive Consolidation Briefing</h1>
        <p className="consolidation__meta">
          LB-OS-020 · Executive Intelligence · {briefing.engine_id} · Updated{" "}
          {new Date(briefing.observed_at).toLocaleString()}
        </p>
      </header>

      <section className="consolidation__score-panel">
        <div className="consolidation__score-main">
          <span className="consolidation__score-label">Consolidation Score</span>
          <span className="consolidation__score-value">
            {score.score} / 100
          </span>
          <span className={`consolidation__score-band consolidation__score-band--${score.band}`}>
            {score.band_label}
          </span>
          {score.trend_label ? (
            <span className="consolidation__score-trend">{score.trend_label}</span>
          ) : null}
        </div>
      </section>

      <section className="consolidation__opportunity">
        <h2>Overall Opportunity</h2>
        <dl className="consolidation__dl">
          <dt>Storage reclaim</dt>
          <dd>{formatBytes(opp.reclaimable_storage_bytes)}</dd>
          <dt>Workspace simplification</dt>
          <dd>{simplificationLabel(opp.workspace_simplification)}</dd>
          <dt>Duplicate confidence</dt>
          <dd>{opp.duplicate_confidence_percent}%</dd>
          <dt>Estimated review time</dt>
          <dd>{opp.estimated_review_minutes} minutes</dd>
          <dt>Decision friction</dt>
          <dd>
            {opp.decision_friction_before} → {opp.decision_friction_after} after consolidation
          </dd>
        </dl>
        <button type="button" disabled={bulkSimulating} onClick={() => void handleSimulateAll()}>
          {bulkSimulating ? "Simulating priorities…" : "Simulate top priorities (preview)"}
        </button>
        {bulkSimulation ? (
          <p className="consolidation__sim-summary">{bulkSimulation.summary}</p>
        ) : null}
      </section>

      <section className="consolidation__risk">
        <h2>Risk Assessment</h2>
        <ul className="consolidation__risk-list">
          <li>High-risk items: {risk.high}</li>
          <li>Medium-risk: {risk.medium}</li>
          <li>Low-risk: {risk.low}</li>
        </ul>
      </section>

      <nav className="consolidation__tabs">
        <button
          type="button"
          className={tab === null ? "consolidation__tab consolidation__tab--active" : "consolidation__tab"}
          onClick={() => {
            setTab(null);
            setTabStub(null);
          }}
        >
          Top Priorities
        </button>
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={tab === t.id ? "consolidation__tab consolidation__tab--active" : "consolidation__tab"}
            onClick={() => void loadTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tabStub ? <p className="consolidation__stub">{tabStub}</p> : null}

      <section className="consolidation__cards">
        <h2>{tab ? TABS.find((t) => t.id === tab)?.label : "Top Priorities"}</h2>
        {displayCards.length === 0 ? (
          <p className="consolidation__empty">No intelligence cards in this view.</p>
        ) : (
          displayCards.map((card) => (
            <ExecutiveIntelligenceCardView
              key={card.card_id}
              card={card}
              onSimulate={tab !== "ignored" ? handleSimulate : undefined}
              onDismiss={tab !== "ignored" ? handleDismiss : undefined}
              simulating={simulatingId === card.card_id}
              simulation={simulations[card.card_id] ?? null}
            />
          ))
        )}
      </section>

      <footer className="consolidation__footer">
        <p>{briefing.safety_footer}</p>
        <p className="consolidation__guardrail">
          Analyze and simulate only · No file moves · No deletes · Proposals not generated in this
          slice
        </p>
      </footer>
    </div>
  );
}
