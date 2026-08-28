import { useEffect, useMemo, useState } from "react";
import {
  addFoundryProposalEvidence,
  createFoundryProposal,
  fetchFoundryAudit,
  fetchFoundryProposalDetail,
  fetchFoundryProposals,
  fetchFoundryWriteCapabilities,
  reviewFoundryProposal,
  submitFoundryProposal,
  type FoundryProposalKind,
  type FoundryProposalRecord,
} from "../api/companyFoundry";

const proposalKinds: Array<{ value: FoundryProposalKind; label: string }> = [
  { value: "builder_application", label: "Builder application" },
  { value: "phase_submission", label: "Phase submission" },
  { value: "master_plan_proposal", label: "Master Build Plan proposal" },
  { value: "capstone_application", label: "Capstone application" },
  { value: "product_change", label: "Product change" },
  { value: "registry_change", label: "Registry change" },
];

export function calculatePhaseValueScore(input: {
  complexity: number;
  businessValue: number;
  risk: number;
  scarcity: number;
  outcomeOwnership: number;
  urgency: number;
  reuseDiscount: number;
}): number {
  return (
    2 * input.complexity +
    3 * input.businessValue +
    2 * input.risk +
    input.scarcity +
    2 * input.outcomeOwnership +
    input.urgency -
    2 * input.reuseDiscount
  );
}

function scoreBand(score: number): string {
  if (score <= 12) return "P0 · Starter";
  if (score <= 22) return "P1 · Guided";
  if (score <= 32) return "P2 · Independent";
  if (score <= 42) return "P3 · Advanced";
  if (score <= 52) return "P4 · Strategic";
  return "P5 · Venture-defining";
}

export function FoundryGovernanceWorkbench() {
  const [proposals, setProposals] = useState<FoundryProposalRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<any>(null);
  const [audit, setAudit] = useState<any[]>([]);
  const [capabilities, setCapabilities] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [kind, setKind] = useState<FoundryProposalKind>("builder_application");
  const [subjectId, setSubjectId] = useState("");
  const [submittedBy, setSubmittedBy] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [payload, setPayload] = useState("");

  const [evidenceType, setEvidenceType] = useState("build_evidence");
  const [evidenceLabel, setEvidenceLabel] = useState("");
  const [evidenceUri, setEvidenceUri] = useState("");
  const [evidenceNotes, setEvidenceNotes] = useState("");

  const [reviewerId, setReviewerId] = useState("");
  const [rationale, setRationale] = useState("");

  const [pvs, setPvs] = useState({ complexity: 3, businessValue: 3, risk: 3, scarcity: 3, outcomeOwnership: 3, urgency: 3, reuseDiscount: 2 });
  const pvsScore = useMemo(() => calculatePhaseValueScore(pvs), [pvs]);

  async function refresh() {
    try {
      setError(null);
      const [nextProposals, nextAudit, nextCapabilities] = await Promise.all([
        fetchFoundryProposals(),
        fetchFoundryAudit(60),
        fetchFoundryWriteCapabilities(),
      ]);
      setProposals(nextProposals);
      setAudit(nextAudit as any[]);
      setCapabilities(nextCapabilities);
      if (selectedId) {
        setDetail(await fetchFoundryProposalDetail(selectedId));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load governance workbench");
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function selectProposal(id: string) {
    setSelectedId(id);
    try {
      setDetail(await fetchFoundryProposalDetail(id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load proposal");
    }
  }

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    try {
      setError(null);
      setMessage(null);
      let parsedPayload: unknown = {};
      if (payload.trim()) parsedPayload = JSON.parse(payload);
      const proposal = await createFoundryProposal({
        kind,
        subjectId: subjectId.trim() || undefined,
        submittedBy: submittedBy.trim(),
        title: title.trim(),
        summary: summary.trim(),
        payload: parsedPayload,
      });
      setMessage(`Draft created: ${proposal.id}`);
      setTitle("");
      setSummary("");
      setPayload("");
      await refresh();
      await selectProposal(proposal.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create proposal");
    }
  }

  async function handleSubmit() {
    if (!detail?.proposal) return;
    try {
      await submitFoundryProposal(detail.proposal.id, detail.proposal.submitted_by);
      setMessage("Proposal submitted for independent review.");
      await refresh();
      await selectProposal(detail.proposal.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not submit proposal");
    }
  }

  async function handleEvidence(event: React.FormEvent) {
    event.preventDefault();
    if (!detail?.proposal) return;
    try {
      await addFoundryProposalEvidence(detail.proposal.id, {
        actorId: detail.proposal.submitted_by,
        evidenceType,
        label: evidenceLabel,
        uri: evidenceUri || undefined,
        notes: evidenceNotes || undefined,
      });
      setEvidenceLabel("");
      setEvidenceUri("");
      setEvidenceNotes("");
      setMessage("Evidence attached.");
      await refresh();
      await selectProposal(detail.proposal.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not attach evidence");
    }
  }

  async function decide(decision: "accepted" | "rejected" | "rework") {
    if (!detail?.proposal) return;
    try {
      await reviewFoundryProposal(detail.proposal.id, { reviewerId: reviewerId.trim(), decision, rationale: rationale.trim() });
      setRationale("");
      setMessage(`Review recorded: ${decision}.`);
      await refresh();
      await selectProposal(detail.proposal.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Review failed");
    }
  }

  return (
    <section className="foundry-governance">
      <header className="foundry__section-head">
        <div>
          <h2>Governance Workbench · CF-010</h2>
          <p>Applications, submissions, evidence, independent review, PVS scoring and audit history.</p>
        </div>
        <button type="button" onClick={() => void refresh()}>Refresh</button>
      </header>

      {error ? <p className="foundry__guardrail">{error}</p> : null}
      {message ? <p>{message}</p> : null}

      <div className="foundry__cards foundry__cards--3">
        <article>
          <h3>Governance writes</h3>
          <strong>{String(capabilities.governanceWritesEnabled ?? false)}</strong>
          <p>Proposals, evidence and reviews may be recorded.</p>
        </article>
        <article>
          <h3>Financial execution</h3>
          <strong>LOCKED</strong>
          <p>Payroll, equity issuance, residual settlement and money movement remain disabled.</p>
        </article>
        <article>
          <h3>Independent acceptance</h3>
          <strong>REQUIRED</strong>
          <p>The submitter cannot accept their own proposal.</p>
        </article>
      </div>

      <div className="foundry__cards">
        <article>
          <h3>New governed proposal</h3>
          <form onSubmit={handleCreate} className="foundry-form">
            <label>Type<select value={kind} onChange={(e) => setKind(e.target.value as FoundryProposalKind)}>{proposalKinds.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
            <label>Submitter ID<input required value={submittedBy} onChange={(e) => setSubmittedBy(e.target.value)} placeholder="builder-or-founder-id" /></label>
            <label>Subject ID<input value={subjectId} onChange={(e) => setSubjectId(e.target.value)} placeholder="product / phase / plan ID" /></label>
            <label>Title<input required value={title} onChange={(e) => setTitle(e.target.value)} /></label>
            <label>Summary<textarea required value={summary} onChange={(e) => setSummary(e.target.value)} /></label>
            <label>Structured payload JSON<textarea value={payload} onChange={(e) => setPayload(e.target.value)} placeholder='{"goal":"..."}' /></label>
            <button type="submit">Create draft</button>
          </form>
        </article>

        <article>
          <h3>PVS calculator</h3>
          <p className="foundry__guardrail">PVS is a value/difficulty language, not money or equity.</p>
          {Object.entries(pvs).map(([key, value]) => (
            <label key={key}>{key.replace(/([A-Z])/g, " $1")}
              <input type="range" min="1" max="5" value={value} onChange={(e) => setPvs((current) => ({ ...current, [key]: Number(e.target.value) }))} /> {value}
            </label>
          ))}
          <p><strong>{pvsScore}</strong> · {scoreBand(pvsScore)}</p>
          <small>PVS=(2C+3B+2R+S+2O+U)-2D</small>
        </article>
      </div>

      <div className="foundry__table-wrap">
        <table className="foundry__table">
          <thead><tr><th>Type</th><th>Title</th><th>Submitter</th><th>Status</th><th>Updated</th></tr></thead>
          <tbody>{proposals.map((proposal) => (
            <tr key={proposal.id} onClick={() => void selectProposal(proposal.id)} style={{ cursor: "pointer" }}>
              <td>{proposal.kind}</td><td><strong>{proposal.title}</strong><br /><small>{proposal.id}</small></td><td>{proposal.submitted_by}</td><td>{proposal.status}</td><td>{proposal.updated_at}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      {detail?.proposal ? (
        <div className="foundry__cards">
          <article>
            <h3>Proposal detail</h3>
            <p><strong>{detail.proposal.title}</strong></p>
            <p>{detail.proposal.summary}</p>
            <p>Status: <strong>{detail.proposal.status}</strong></p>
            <pre className="foundry-code">{detail.proposal.payload_json}</pre>
            {detail.proposal.status === "draft" ? <button type="button" onClick={() => void handleSubmit()}>Submit for review</button> : null}
          </article>

          <article>
            <h3>Evidence bundle</h3>
            {detail.evidence?.map((item: any) => <p key={item.id}><strong>{item.label}</strong><br /><small>{item.evidence_type}{item.uri ? ` · ${item.uri}` : ""}</small></p>)}
            <form onSubmit={handleEvidence} className="foundry-form">
              <label>Evidence type<input value={evidenceType} onChange={(e) => setEvidenceType(e.target.value)} /></label>
              <label>Label<input required value={evidenceLabel} onChange={(e) => setEvidenceLabel(e.target.value)} /></label>
              <label>URI / commit / artifact<input value={evidenceUri} onChange={(e) => setEvidenceUri(e.target.value)} /></label>
              <label>Notes<textarea value={evidenceNotes} onChange={(e) => setEvidenceNotes(e.target.value)} /></label>
              <button type="submit">Attach evidence</button>
            </form>
          </article>

          <article>
            <h3>Independent review</h3>
            {detail.reviews?.map((review: any) => <p key={review.id}><strong>{review.decision}</strong> · {review.reviewer_id}<br /><small>{review.rationale}</small></p>)}
            <label>Reviewer ID<input value={reviewerId} onChange={(e) => setReviewerId(e.target.value)} /></label>
            <label>Rationale<textarea value={rationale} onChange={(e) => setRationale(e.target.value)} /></label>
            <div>
              <button type="button" onClick={() => void decide("accepted")}>Accept</button>{" "}
              <button type="button" onClick={() => void decide("rework")}>Rework</button>{" "}
              <button type="button" onClick={() => void decide("rejected")}>Reject</button>
            </div>
          </article>
        </div>
      ) : null}

      <section>
        <h3>Audit timeline</h3>
        <div className="foundry__table-wrap"><table className="foundry__table"><thead><tr><th>Event</th><th>Subject</th><th>Actor</th><th>Time</th></tr></thead><tbody>{audit.map((event, index) => <tr key={event.id ?? index}><td>{event.event_type}</td><td>{event.subject_type}:{event.subject_id}</td><td>{event.actor_id}</td><td>{event.created_at}</td></tr>)}</tbody></table></div>
      </section>
    </section>
  );
}
