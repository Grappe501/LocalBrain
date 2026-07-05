import { useCallback, useEffect, useState } from "react";
import type { ColumnMapping, ImportSession, UcieQualityDashboard, WorkItem } from "@localbrain/shared";
import { UCIE_IMPORT_SOURCE_TYPES } from "@localbrain/shared";
import {
  approveSchema,
  claimWorkItemApi,
  createUcieSession,
  fetchQualityDashboard,
  fetchUcieSessions,
  fetchWorkItems,
  intakeCsv,
  searchVotersApi,
} from "../../api/ucie";
import { ExecutiveQuestionShell } from "../../components/ExecutiveQuestionShell";

const WORKSPACE_ID = "localbrain";

type TabId = "intake" | "work" | "voter" | "quality";

export function IngestionStudioView() {
  const [tab, setTab] = useState<TabId>("intake");
  const [sessions, setSessions] = useState<ImportSession[]>([]);
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [dashboard, setDashboard] = useState<UcieQualityDashboard | null>(null);
  const [sourceType, setSourceType] = useState<(typeof UCIE_IMPORT_SOURCE_TYPES)[number]>("csv");
  const [csvText, setCsvText] = useState("");
  const [schema, setSchema] = useState<ColumnMapping[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [county, setCounty] = useState("Benton");
  const [lastName, setLastName] = useState("");
  const [voters, setVoters] = useState<Awaited<ReturnType<typeof searchVotersApi>>>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setError(null);
    try {
      setSessions(await fetchUcieSessions(WORKSPACE_ID));
      setWorkItems(await fetchWorkItems(WORKSPACE_ID));
      setDashboard(await fetchQualityDashboard(WORKSPACE_ID));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load UCIE");
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  async function handleStartSession() {
    setMessage(null);
    setError(null);
    try {
      const session = await createUcieSession({
        workspace_id: WORKSPACE_ID,
        source_type: sourceType,
      });
      setActiveSessionId(session.session_id);
      setMessage(`Session ${session.session_id.slice(0, 8)} started — staged intake only.`);
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start session");
    }
  }

  async function handleCsvIntake() {
    if (!activeSessionId || !csvText.trim()) return;
    setError(null);
    try {
      const result = await intakeCsv(activeSessionId, "upload.csv", csvText);
      setSchema(result.schema.mappings.map((m) => ({ ...m })));
      setMessage(`Staged ${result.row_count} rows — review schema mappings before commit path.`);
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "CSV intake failed");
    }
  }

  async function handleApproveSchema() {
    if (!activeSessionId || schema.length === 0) return;
    setError(null);
    try {
      await approveSchema(activeSessionId, schema, true);
      setMessage("Schema approved — identity resolution running on staged rows.");
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Schema approval failed");
    }
  }

  async function handleVoterSearch() {
    setError(null);
    try {
      setVoters(
        await searchVotersApi({
          workspace_id: WORKSPACE_ID,
          county,
          last_name: lastName || undefined,
        }),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Voter search failed");
    }
  }

  return (
    <div className="ucie-studio">
      <ExecutiveQuestionShell route="/studio/ingestion" />
      <header className="ucie-studio__header">
        <h1>Identity Acquisition (UCIE)</h1>
        <p className="contact-dept__meta">
          CONTACT-V3-100 · peer subsystem · stage, don't commit · provenance, always
        </p>
      </header>

      {message ? <p className="contact-dept__notice">{message}</p> : null}
      {error ? <p className="contact-dept__error">{error}</p> : null}

      <div className="contact-dept__tabs" role="tablist">
        {(["intake", "work", "voter", "quality"] as TabId[]).map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            className={tab === id ? "contact-dept__tab contact-dept__tab--active" : "contact-dept__tab"}
            onClick={() => setTab(id)}
          >
            {id === "intake" ? "Intake" : id === "work" ? "Work marketplace" : id === "voter" ? "Voter assistant" : "Quality"}
          </button>
        ))}
      </div>

      {tab === "intake" ? (
        <section className="ucie-panel">
          <h2>Universal Intake Gateway</h2>
          <label>
            Source type
            <select value={sourceType} onChange={(e) => setSourceType(e.target.value as typeof sourceType)}>
              {UCIE_IMPORT_SOURCE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="contact-dept__primary" onClick={() => void handleStartSession()}>
            Start import session
          </button>
          {activeSessionId ? (
            <>
              <p className="contact-dept__meta">Active session: {activeSessionId}</p>
              <label>
                CSV text
                <textarea rows={6} value={csvText} onChange={(e) => setCsvText(e.target.value)} />
              </label>
              <button type="button" className="contact-dept__secondary" onClick={() => void handleCsvIntake()}>
                Stage CSV (no canonical write)
              </button>
              {schema.length > 0 ? (
                <div className="ucie-schema">
                  <h3>Schema discovery</h3>
                  <ul>
                    {schema.map((m) => (
                      <li key={m.source_column}>
                        {m.source_column} → {m.canonical_field} ({m.confidence})
                        <label>
                          <input
                            type="checkbox"
                            checked={m.approved}
                            onChange={(e) =>
                              setSchema((prev) =>
                                prev.map((row) =>
                                  row.source_column === m.source_column
                                    ? { ...row, approved: e.target.checked }
                                    : row,
                                ),
                              )
                            }
                          />
                          Approved
                        </label>
                      </li>
                    ))}
                  </ul>
                  <button type="button" className="contact-dept__primary" onClick={() => void handleApproveSchema()}>
                    Approve mappings &amp; resolve identity
                  </button>
                </div>
              ) : null}
            </>
          ) : null}
          <h3>Recent sessions</h3>
          <ul>
            {sessions.map((s) => (
              <li key={s.session_id}>
                {s.source_label} · {s.status} · {s.row_count} rows · {s.committed_count} committed
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {tab === "work" ? (
        <section className="ucie-panel">
          <h2>Work Marketplace</h2>
          <ul>
            {workItems.map((item) => (
              <li key={item.work_item_id}>
                <strong>{item.title}</strong> · {item.item_type} · {item.status}
                {item.status === "open" ? (
                  <button
                    type="button"
                    className="contact-dept__secondary"
                    onClick={() => void claimWorkItemApi(item.work_item_id).then(() => reload())}
                  >
                    Claim
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {tab === "voter" ? (
        <section className="ucie-panel">
          <h2>Voter Resolution Assistant</h2>
          <label>
            County
            <input value={county} onChange={(e) => setCounty(e.target.value)} />
          </label>
          <label>
            Last name
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </label>
          <button type="button" className="contact-dept__secondary" onClick={() => void handleVoterSearch()}>
            Search voters
          </button>
          <ul>
            {voters.map((v) => (
              <li key={v.voter_id}>
                {v.last_name}, {v.first_name} — {v.address_line1 ?? "no address"}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {tab === "quality" && dashboard ? (
        <section className="ucie-panel">
          <h2>Data Quality Dashboard</h2>
          <div className="rel-analytics__portfolio">
            <article>
              <strong>{dashboard.import_success_rate_percent}%</strong>
              <span>Import success</span>
            </article>
            <article>
              <strong>{dashboard.open_work_items}</strong>
              <span>Open work items</span>
            </article>
            <article>
              <strong>{dashboard.ocr_backlog}</strong>
              <span>OCR backlog</span>
            </article>
            <article>
              <strong>{dashboard.total_rows_staged}</strong>
              <span>Rows staged</span>
            </article>
          </div>
        </section>
      ) : null}
    </div>
  );
}
