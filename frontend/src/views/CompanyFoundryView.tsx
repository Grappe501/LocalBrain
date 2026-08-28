import { useMemo, useState } from "react";
import "../styles/company-foundry.css";

type Product = {
  id: string;
  name: string;
  kind: "software" | "book" | "platform";
  readiness: number;
  disposition: string;
  annualLow: number;
  annualHigh: number;
  training: boolean;
  capstoneCandidate: boolean;
};

const products: Product[] = [
  { id: "souschef", name: "SousChef / HomeChef AI", kind: "software", readiness: 90, disposition: "ACCELERATE · TRAINING PRODUCT", annualLow: 150000, annualHigh: 600000, training: true, capstoneCandidate: false },
  { id: "localbrain", name: "LocalBrain", kind: "platform", readiness: 85, disposition: "ACCELERATE", annualLow: 180000, annualHigh: 900000, training: true, capstoneCandidate: false },
  { id: "campaignos", name: "CampaignOS", kind: "software", readiness: 80, disposition: "ACCELERATE · CLEAN EXTRACTION", annualLow: 240000, annualHigh: 1200000, training: true, capstoneCandidate: false },
  { id: "votematch", name: "VoteMatch", kind: "software", readiness: 76, disposition: "ACCELERATE · HARDEN AUTH/PRIVACY", annualLow: 120000, annualHigh: 600000, training: true, capstoneCandidate: false },
  { id: "bidassembly", name: "Bid Assembly", kind: "software", readiness: 65, disposition: "ACCELERATE · B2B VALIDATION", annualLow: 120000, annualHigh: 720000, training: true, capstoneCandidate: true },
  { id: "canonforge", name: "CanonForge Knowledge OS", kind: "platform", readiness: 70, disposition: "VALIDATE + EXTRACT", annualLow: 120000, annualHigh: 600000, training: true, capstoneCandidate: true },
  { id: "peoplebase", name: "PeopleBase / ContactList", kind: "software", readiness: 70, disposition: "INCUBATE", annualLow: 120000, annualHigh: 600000, training: true, capstoneCandidate: true },
  { id: "eventops", name: "Event Operations", kind: "software", readiness: 58, disposition: "INCUBATE", annualLow: 90000, annualHigh: 450000, training: true, capstoneCandidate: true },
  { id: "fieldspark", name: "FieldSpark / Field Command", kind: "software", readiness: 50, disposition: "INCUBATE · CAMPAIGNOS MODULE FIRST", annualLow: 120000, annualHigh: 600000, training: true, capstoneCandidate: true },
  { id: "bookfoundry", name: "Writers Dashboard / Book Foundry", kind: "platform", readiness: 45, disposition: "INCUBATE · PRODUCTIZE", annualLow: 60000, annualHigh: 300000, training: true, capstoneCandidate: true },
  { id: "constitutional-capitalism", name: "Constitutional Capitalism", kind: "book", readiness: 45, disposition: "BOOK PRODUCT", annualLow: 10000, annualHigh: 75000, training: true, capstoneCandidate: false },
  { id: "mercy-protocol", name: "The Mercy Protocol", kind: "book", readiness: 85, disposition: "BOOK PRODUCT · PUBLICATION TRACK", annualLow: 5000, annualHigh: 50000, training: true, capstoneCandidate: false },
  { id: "campti", name: "Campti / Grappe Historical Novel", kind: "book", readiness: 30, disposition: "BOOK PRODUCT · AUDIT", annualLow: 5000, annualHigh: 40000, training: true, capstoneCandidate: true },
  { id: "arkansas-history", name: "Arkansas Political History", kind: "book", readiness: 25, disposition: "BOOK PRODUCT · AUDIT", annualLow: 5000, annualHigh: 30000, training: true, capstoneCandidate: true },
];

const cohortPhases = [
  ["SC-01", "Production & security audit", 900, "Audit"],
  ["SC-02", "Billing + entitlement rail", 1400, "Build"],
  ["SC-03", "Paid onboarding funnel", 1200, "Build"],
  ["SC-04", "AI cost telemetry", 900, "Build"],
  ["SC-05", "Mobile UX hardening", 1200, "Polish"],
  ["SC-06", "Privacy & data controls", 1100, "Governance"],
  ["SC-07", "Beta feedback loop", 900, "Product"],
  ["SC-08", "Paid beta instrumentation", 1200, "Commercial"],
  ["SC-09", "Stabilization & rework", 1000, "QA"],
  ["SC-10", "V1 acceptance + launch evidence", 1000, "Acceptance"],
] as const;

const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

export function CompanyFoundryView() {
  const [tab, setTab] = useState("portfolio");
  const [dpr, setDpr] = useState(9000);
  const [companyPct, setCompanyPct] = useState(35);
  const [leadPct, setLeadPct] = useState(40);

  const teamPct = Math.max(0, 100 - companyPct - leadPct);
  const totals = useMemo(() => ({
    low: products.reduce((sum, p) => sum + p.annualLow, 0),
    high: products.reduce((sum, p) => sum + p.annualHigh, 0),
  }), []);

  return (
    <div className="foundry">
      <header className="foundry__hero">
        <div>
          <p className="foundry__eyebrow">Company Foundry · CF-006</p>
          <h1>Build people. Build products. Build owners.</h1>
          <p>Read-first operating control plane. No payroll, equity issuance, securities transfer, or money movement is enabled.</p>
        </div>
        <div className="foundry__hero-stats">
          <div><strong>{products.length}</strong><span>modeled products</span></div>
          <div><strong>{products.filter((p) => p.training).length}</strong><span>training environments</span></div>
          <div><strong>{products.filter((p) => p.capstoneCandidate).length}</strong><span>capstone candidates</span></div>
        </div>
      </header>

      <nav className="foundry__tabs" aria-label="Company Foundry sections">
        {[
          ["portfolio", "Portfolio"], ["academy", "Academy"], ["phases", "Phase Board"], ["capstones", "Capstones"],
          ["economics", "Economics"], ["doctrine", "Doctrine"],
        ].map(([id, label]) => (
          <button key={id} type="button" className={tab === id ? "is-active" : ""} onClick={() => setTab(id)}>{label}</button>
        ))}
      </nav>

      {tab === "portfolio" && (
        <section>
          <div className="foundry__summary-grid">
            <article><span>Haircut annual capacity · low</span><strong>{money(totals.low)}</strong><small>planning capacity, not forecast</small></article>
            <article><span>Haircut annual capacity · high</span><strong>{money(totals.high)}</strong><small>planning capacity, not forecast</small></article>
            <article><span>Cash forecast until customers pay</span><strong>$0</strong><small>founder doctrine</small></article>
          </div>
          <div className="foundry__table-wrap">
            <table className="foundry__table">
              <thead><tr><th>Product</th><th>Type</th><th>Ready</th><th>Disposition</th><th>50% haircut annual capacity</th><th>Use</th></tr></thead>
              <tbody>{products.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.name}</strong></td><td>{p.kind}</td>
                  <td><div className="foundry__progress"><span style={{ width: `${p.readiness}%` }} /></div><small>{p.readiness}%</small></td>
                  <td>{p.disposition}</td><td>{money(p.annualLow)}–{money(p.annualHigh)}</td>
                  <td>{p.training ? "Training" : "—"}{p.capstoneCandidate ? " · Capstone candidate" : ""}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </section>
      )}

      {tab === "academy" && (
        <section className="foundry__cards">
          <article><h2>12-week Builder Academy</h2><p><strong>$20/hour</strong> working apprentice rate, subject to legal/payroll review.</p><ol><li>Orientation & safeguards</li><li>Understand → Inspect → Plan</li><li>Guided production</li><li>Independent accepted phases</li><li>Cross-functional production</li><li>Leadership + graduation build</li></ol></article>
          <article><h2>Capability ladder</h2><ol><li>L0 · Apprentice</li><li>L1 · Guided Builder</li><li>L2 · Independent Builder</li><li>L3 · Venture Builder</li><li>L4 · Product Lead</li><li>L5 · Foundry Architect</li></ol></article>
          <article><h2>90-day proof</h2><p>Ownership-track invitation requires sustained accepted production, quality, reliability, teamwork and business impact after graduation.</p><p className="foundry__guardrail">Graduation is eligibility—not ownership, residuals, or guaranteed continued work.</p></article>
        </section>
      )}

      {tab === "phases" && (
        <section>
          <header className="foundry__section-head"><div><h2>Cohort 1 · SousChef completion board</h2><p>Training product · approximately 90% complete · $12,000 maximum completion budget</p></div><strong>$10,800 phases + $1,200 contingency</strong></header>
          <div className="foundry__table-wrap"><table className="foundry__table"><thead><tr><th>ID</th><th>Accepted phase</th><th>Budget</th><th>Class</th><th>Status</th></tr></thead><tbody>{cohortPhases.map(([id, name, budget, type]) => <tr key={id}><td>{id}</td><td>{name}</td><td>{money(budget)}</td><td>{type}</td><td><span className="foundry__status">PLANNED</span></td></tr>)}</tbody></table></div>
          <div className="foundry__cards foundry__cards--3"><article><h3>Apprentice labor</h3><strong>$7,200</strong><p>3 × 120 hours × $20</p></article><article><h3>Lead/reviewer</h3><strong>$2,400</strong><p>60 hours × $40 modeling assumption</p></article><article><h3>Tools + contingency</h3><strong>$2,400</strong><p>$1,200 tooling/testing + $1,200 reserve</p></article></div>
        </section>
      )}

      {tab === "capstones" && (
        <section className="foundry__cards">
          <article><h2>Capstone admission gate</h2><ol><li>Validated customer/problem</li><li>Accepted Master Build Plan</li><li>IP/provenance clearance</li><li>Budget + team</li><li>Security/legal classification</li><li>V1/launch definition</li><li>Commercial model</li><li>Residual waterfall</li><li>Kill/continue criteria</li></ol></article>
          <article><h2>Current candidate bench</h2>{products.filter((p) => p.capstoneCandidate).map((p) => <p key={p.id}><strong>{p.name}</strong><br /><small>{p.readiness}% current readiness · {p.disposition}</small></p>)}</article>
          <article><h2>Hard boundary</h2><p>Existing company products do not become a builder's Capstone merely because the builder works on them.</p><p>A residual-bearing Capstone exists only after a new/accepted Master Build Plan passes Foundry admission.</p></article>
        </section>
      )}

      {tab === "economics" && (
        <section>
          <div className="foundry__simulator">
            <h2>Capstone DPR simulator</h2>
            <label>Monthly Distributable Product Residual <input type="number" min="0" value={dpr} onChange={(e) => setDpr(Number(e.target.value) || 0)} /></label>
            <label>Company % <input type="range" min="25" max="75" value={companyPct} onChange={(e) => setCompanyPct(Number(e.target.value))} /><strong>{companyPct}%</strong></label>
            <label>Lead % <input type="range" min="0" max="51" value={leadPct} onChange={(e) => setLeadPct(Math.min(Number(e.target.value), 100 - companyPct))} /><strong>{leadPct}%</strong></label>
            <p>Team pool automatically receives the remainder: <strong>{teamPct}%</strong></p>
          </div>
          <div className="foundry__summary-grid"><article><span>Company</span><strong>{money(dpr * companyPct / 100)}</strong><small>{companyPct}% · minimum floor 25%</small></article><article><span>Capstone lead</span><strong>{money(dpr * leadPct / 100)}</strong><small>{leadPct}% · maximum ceiling 51%</small></article><article><span>Team pool</span><strong>{money(dpr * teamPct / 100)}</strong><small>{teamPct}% distributed by signed team schedule</small></article></div>
          <p className="foundry__guardrail">Residual is not ownership. DPR is after the approved product waterfall; gross revenue is never treated as residual.</p>
        </section>
      )}

      {tab === "doctrine" && (
        <section className="foundry__cards">
          <article><h2>Four ledgers</h2><ol><li>Parent Ownership</li><li>Production Compensation</li><li>Product Residual</li><li>Capital / Property Contribution</li></ol></article>
          <article><h2>Economic doctrine</h2><p><strong>Ownership</strong> rewards building and bearing risk in the Foundry.</p><p><strong>Phase compensation</strong> rewards accepted production.</p><p><strong>Residual participation</strong> rewards successful product economics.</p><p><strong>Capital contribution</strong> records what someone puts at risk.</p></article>
          <article><h2>CF-006 safety posture</h2><ul><li>Read-first UI</li><li>No payroll actions</li><li>No equity issuance</li><li>No securities transfer</li><li>No residual settlement</li><li>No money movement</li><li>No self-acceptance of paid work</li></ul></article>
        </section>
      )}
    </div>
  );
}
