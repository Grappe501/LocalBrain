import { useCallback, useEffect, useState } from "react";
import type {
  WritingDraftPreview,
  WritingModeId,
  WritingOverview,
  WritingScore,
  WritingSourceFile,
  WritingVoiceId,
} from "@localbrain/shared";
import {
  fetchWritingOverview,
  fetchWritingSources,
  previewWritingDraft,
} from "../../api/writing";

type TabId = "overview" | "modes" | "projects" | "draft" | "voices" | "sources";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "modes", label: "Modes" },
  { id: "projects", label: "Projects" },
  { id: "draft", label: "Draft" },
  { id: "voices", label: "Voices" },
  { id: "sources", label: "Sources" },
];

function ScoreHero({ score }: { score: WritingScore }) {
  return (
    <section className={`eng-score eng-score--${score.label}`} aria-label="Writing score">
      <div className="eng-score__main">
        <span className="system-health__score-value">{score.score}</span>
        <span className="system-health__score-label">Writing Score</span>
        <p className="system-health__score-summary">{score.summary}</p>
      </div>
      <div className="eng-score__factors">
        {score.factors.map((f) => (
          <div key={f.id} className="eng-score__factor">
            <div className="eng-score__factor-head">
              <span>{f.name}</span>
              <strong>{f.score}</strong>
            </div>
            <div className="epo-coverage__track">
              <div className="epo-coverage__fill" style={{ width: `${f.score}%` }} />
            </div>
            <span className="eng-score__factor-detail">{f.detail}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function WritingDepartmentView() {
  const [tab, setTab] = useState<TabId>("overview");
  const [overview, setOverview] = useState<WritingOverview | null>(null);
  const [sources, setSources] = useState<WritingSourceFile[]>([]);
  const [selectedProject, setSelectedProject] = useState("localbrain");
  const [modeId, setModeId] = useState<WritingModeId>("substack_blog");
  const [voiceId, setVoiceId] = useState<WritingVoiceId>("steve_strategic");
  const [topic, setTopic] = useState("");
  const [draft, setDraft] = useState<WritingDraftPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setError(null);
      const ov = await fetchWritingOverview();
      setOverview(ov);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load Writing Department");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const id = window.setInterval(() => void load(), 60_000);
    return () => window.clearInterval(id);
  }, [load]);

  useEffect(() => {
    if (tab !== "sources" && tab !== "draft") return;
    void fetchWritingSources(selectedProject)
      .then(setSources)
      .catch(() => setSources([]));
  }, [tab, selectedProject]);

  async function runPreview() {
    try {
      const p = await previewWritingDraft({
        mode_id: modeId,
        voice_id: voiceId,
        workspace_id: selectedProject,
        topic,
      });
      setDraft(p);
    } catch {
      setDraft(null);
    }
  }

  if (loading && !overview) {
    return (
      <div className="writing-dept">
        <p>Loading Writing Department…</p>
      </div>
    );
  }

  if (error && !overview) {
    return (
      <div className="writing-dept">
        <p className="writing-dept__error">{error}</p>
      </div>
    );
  }

  if (!overview) return null;

  return (
    <div className="writing-dept">
      <header className="writing-dept__header">
        <h1>Writing Department</h1>
        <p className="writing-dept__meta">
          Narrative engine · draft/preview only · Writing Chief · LB-OS-013 · Updated{" "}
          {new Date(overview.observed_at).toLocaleTimeString()}
        </p>
      </header>

      <aside className="writing-dept__guardrails" aria-label="Writing guardrails">
        {overview.guardrails.map((g) => (
          <span key={g} className="writing-dept__guardrail-pill">
            {g}
          </span>
        ))}
      </aside>

      <nav className="eng-dept__tabs" aria-label="Writing tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`eng-dept__tab ${tab === t.id ? "eng-dept__tab--active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "overview" && (
        <div className="eng-dept__panel">
          <ScoreHero score={overview.writing_score} />
          <section>
            <h2>Chief recommendation</h2>
            <div className="eng-rec">
              <p>
                <strong>What:</strong> {overview.chief_recommendation.what}
              </p>
              <p>
                <strong>Why:</strong> {overview.chief_recommendation.why}
              </p>
              <p>
                <strong>If approved:</strong> {overview.chief_recommendation.if_approved}
              </p>
            </div>
          </section>
          <section>
            <h2>Narrative catalog</h2>
            <p className="eng-dept__hint">
              {overview.narrative_catalog.length} entries linking modes, voices, and workspaces.
            </p>
          </section>
        </div>
      )}

      {tab === "modes" && (
        <div className="eng-dept__panel">
          <section>
            <h2>Writing modes</h2>
            <ul className="writing-dept__mode-list">
              {overview.modes.map((m) => (
                <li key={m.id} className="writing-dept__mode-card">
                  <h3>{m.label}</h3>
                  <p>{m.description}</p>
                  <p className="writing-dept__examples">
                    {m.example_outputs.join(" · ")}
                  </p>
                  <button
                    type="button"
                    className="writing-dept__use-mode"
                    onClick={() => {
                      setModeId(m.id);
                      setTab("draft");
                    }}
                  >
                    Draft in this mode
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {tab === "projects" && (
        <div className="eng-dept__panel">
          <section>
            <h2>Writing projects</h2>
            <ul className="eng-dept__project-list">
              {overview.projects.map((p) => (
                <li key={p.workspace_id}>
                  <button
                    type="button"
                    className={
                      selectedProject === p.workspace_id ? "eng-dept__project--active" : ""
                    }
                    onClick={() => setSelectedProject(p.workspace_id)}
                  >
                    {p.title} <span>({p.workspace_type})</span>
                  </button>
                  {p.current_focus && <p className="writing-dept__focus">{p.current_focus}</p>}
                  <p className="writing-dept__suggested">
                    Suggested: {p.suggested_modes.join(", ")}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {tab === "draft" && (
        <div className="eng-dept__panel">
          <section>
            <h2>Draft cockpit</h2>
            <p className="eng-dept__hint">
              Preview only — nothing is saved or published until you approve via Actions.
            </p>
            <div className="writing-dept__draft-form">
              <label>
                Project
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                >
                  {overview.projects.map((p) => (
                    <option key={p.workspace_id} value={p.workspace_id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Mode
                <select
                  value={modeId}
                  onChange={(e) => setModeId(e.target.value as WritingModeId)}
                >
                  {overview.modes.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Voice
                <select
                  value={voiceId}
                  onChange={(e) => setVoiceId(e.target.value as WritingVoiceId)}
                >
                  {overview.voices.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Topic
                <input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="What are we writing?"
                />
              </label>
              <button type="button" onClick={() => void runPreview()}>
                Preview draft
              </button>
            </div>
            {draft && (
              <>
                <p className="writing-dept__publish-blocked">
                  Publish blocked — draft preview only
                </p>
                <pre className="eng-dept__burt-preview">{draft.markdown}</pre>
              </>
            )}
          </section>
        </div>
      )}

      {tab === "voices" && (
        <div className="eng-dept__panel">
          <section>
            <h2>Voice / style library</h2>
            <ul className="writing-dept__voice-list">
              {overview.voices.map((v) => (
                <li key={v.id} className="writing-dept__voice-card">
                  <h3>{v.label}</h3>
                  <p>{v.description}</p>
                  <p>
                    <strong>Best for:</strong> {v.best_for.join(", ")}
                  </p>
                  <p className="writing-dept__tone">{v.tone_notes}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setVoiceId(v.id);
                      setTab("draft");
                    }}
                  >
                    Use this voice
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {tab === "sources" && (
        <div className="eng-dept__panel">
          <section>
            <h2>Source-aware files</h2>
            <p className="eng-dept__hint">
              Approved paths only — permission engine enforced. Metadata listing, no bulk content
              reads.
            </p>
            <label>
              Project
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                {overview.projects.map((p) => (
                  <option key={p.workspace_id} value={p.workspace_id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </label>
            <ul className="writing-dept__source-list">
              {sources.length === 0 ? (
                <li>No writing files found in approved roots for this project.</li>
              ) : (
                sources.map((s) => (
                  <li key={s.path}>
                    <code>{s.name}</code>
                    <span>{s.kind}</span>
                    {!s.allowed && <span className="writing-dept__denied">denied</span>}
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
