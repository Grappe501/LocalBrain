import { useMemo, useState } from "react";
import {
  foundryBuilders,
  foundryCapstones,
  foundryEconomicRules,
  foundryPhases,
  foundryProducts,
  foundryRegistryMeta,
} from "../data/companyFoundryRegistry";
import "../styles/company-foundry.css";

const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export function CompanyFoundryView() {
  const [tab, setTab] = useState("portfolio");
  const [dpr, setDpr] = useState(9000);
  const [companyPct, setCompanyPct] = useState(35);
  const [leadPct, setLeadPct] = useState(40);

  const companyFloor = foundryEconomicRules.companyResidualFloorPct;
  const leadCeiling = foundryEconomicRules.capstoneLeadResidualCeilingPct;
  const teamPct = Math.max(0, 100 - companyPct - leadPct);

  const totals = useMemo(
    () => ({
      low: foundryProducts.reduce((sum, product) => sum + product.annualLow, 0),
      high: foundryProducts.reduce((sum, product) => sum + product.annualHigh, 0),
    }),
    [],
  );

  const sousChefPhases = foundryPhases.filter((phase) => phase.productId === "souschef");
  const phaseBudget = sousChefPhases.reduce((sum, phase) => sum + phase.budget, 0);
  const capstoneCandidates = foundryProducts.filter((product) => product.capstoneCandidate);

  return (
    <div className="foundry">
      <header className="foundry__hero">
        <div>
          <p className="foundry__eyebrow">Company Foundry · {foundryRegistryMeta.slice}</p>
          <h1>Build people. Build products. Build owners.</h1>
          <p>
            Canonical registry-driven control plane · {foundryRegistryMeta.mode}. No payroll, equity issuance,
            securities transfer, residual settlement, or money movement is enabled.
          </p>
        </div>
        <div className="foundry__hero-stats">
          <div><strong>{foundryProducts.length}</strong><span>modeled products</span></div>
          <div><strong>{foundryProducts.filter((product) => product.training).length}</strong><span>training environments</span></div>
          <div><strong>{capstoneCandidates.length}</strong><span>capstone candidates</span></div>
          <div><strong>{foundryBuilders.length}</strong><span>builders registered</span></div>
        </div>
      </header>

      <nav className="foundry__tabs" aria-label="Company Foundry sections">
        {[
          ["portfolio", "Portfolio"],
          ["academy", "Academy"],
          ["builders", "Builders"],
          ["phases", "Phase Board"],
          ["capstones", "Capstones"],
          ["economics", "Economics"],
          ["doctrine", "Doctrine"],
        ].map(([id, label]) => (
          <button key={id} type="button" className={tab === id ? "is-active" : ""} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </nav>

      {tab === "portfolio" && (
        <section>
          <div className="foundry__summary-grid">
            <article><span>Haircut annual capacity · low</span><strong>{money(totals.low)}</strong><small>planning capacity, not forecast</small></article>
            <article><span>Haircut annual capacity · high</span><strong>{money(totals.high)}</strong><small>planning capacity, not forecast</small></article>
            <article><span>Cash forecast until paid validation</span><strong>{money(foundryRegistryMeta.cashForecastUntilPaidValidationUsd)}</strong><small>founder doctrine</small></article>
          </div>
          <div className="foundry__table-wrap">
            <table className="foundry__table">
              <thead><tr><th>Product</th><th>Type</th><th>Ready</th><th>Disposition</th><th>50% haircut annual capacity</th><th>Source</th><th>Use</th></tr></thead>
              <tbody>
                {foundryProducts.map((product) => (
                  <tr key={product.id}>
                    <td><strong>{product.name}</strong>{product.notes ? <><br /><small>{product.notes}</small></> : null}</td>
                    <td>{product.kind}</td>
                    <td><div className="foundry__progress"><span style={{ width: `${product.readiness}%` }} /></div><small>{product.readiness}%</small></td>
                    <td>{product.disposition}</td>
                    <td>{money(product.annualLow)}–{money(product.annualHigh)}</td>
                    <td><small>{product.sourceRepos.join(" · ")}</small></td>
                    <td>{product.training ? "Training" : "—"}{product.capstoneCandidate ? " · Capstone candidate" : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === "academy" && (
        <section className="foundry__cards">
          <article>
            <h2>12-week Builder Academy</h2>
            <p><strong>{money(foundryEconomicRules.apprenticeHourlyRateUsd)}/hour</strong> working apprentice rate, subject to legal/payroll review.</p>
            <ol><li>Orientation & safeguards</li><li>Understand → Inspect → Plan</li><li>Guided production</li><li>Independent accepted phases</li><li>Cross-functional production</li><li>Leadership + graduation build</li></ol>
          </article>
          <article><h2>Capability ladder</h2><ol><li>L0 · Apprentice</li><li>L1 · Guided Builder</li><li>L2 · Independent Builder</li><li>L3 · Venture Builder</li><li>L4 · Product Lead</li><li>L5 · Foundry Architect</li></ol></article>
          <article><h2>90-day proof</h2><p>Ownership-track invitation requires sustained accepted production, quality, reliability, teamwork and business impact after graduation.</p><p className="foundry__guardrail">Graduation is eligibility—not ownership, residuals, or guaranteed continued work.</p></article>
        </section>
      )}

      {tab === "builders" && (
        <section>
          <header className="foundry__section-head"><div><h2>Builder capability ledger</h2><p>Registry source of truth for Academy and post-graduation production evidence.</p></div><strong>{foundryBuilders.length} builders</strong></header>
          {foundryBuilders.length === 0 ? (
            <p className="foundry__guardrail">No builders have been admitted yet. CF-007 intentionally starts with an empty canonical roster rather than inventing participants.</p>
          ) : (
            <div className="foundry__table-wrap"><table className="foundry__table"><thead><tr><th>Builder</th><th>Level</th><th>Status</th><th>PVP</th><th>Accepted phases</th></tr></thead><tbody>{foundryBuilders.map((builder) => <tr key={builder.id}><td>{builder.displayName}</td><td>{builder.level}</td><td>{builder.status}</td><td>{builder.phaseValuePoints}</td><td>{builder.acceptedPhases}</td></tr>)}</tbody></table></div>
          )}
        </section>
      )}

      {tab === "phases" && (
        <section>
          <header className="foundry__section-head"><div><h2>Cohort 1 · SousChef completion board</h2><p>Training product · approximately 90% complete · $12,000 maximum completion budget</p></div><strong>{money(phaseBudget)} phases + {money(12000 - phaseBudget)} contingency</strong></header>
          <div className="foundry__table-wrap"><table className="foundry__table"><thead><tr><th>ID</th><th>Accepted phase</th><th>Budget</th><th>Class</th><th>Status</th></tr></thead><tbody>{sousChefPhases.map((phase) => <tr key={phase.id}><td>{phase.id}</td><td>{phase.title}</td><td>{money(phase.budget)}</td><td>{phase.phaseClass}</td><td><span className="foundry__status">{phase.status.toUpperCase()}</span></td></tr>)}</tbody></table></div>
          <div className="foundry__cards foundry__cards--3"><article><h3>Apprentice labor</h3><strong>$7,200</strong><p>3 × 120 hours × $20</p></article><article><h3>Lead/reviewer</h3><strong>$2,400</strong><p>60 hours × $40 modeling assumption</p></article><article><h3>Tools + contingency</h3><strong>$2,400</strong><p>$1,200 tooling/testing + $1,200 reserve</p></article></div>
        </section>
      )}

      {tab === "capstones" && (
        <section className="foundry__cards">
          <article><h2>Capstone admission gate</h2><ol><li>Validated customer/problem</li><li>Accepted Master Build Plan</li><li>IP/provenance clearance</li><li>Budget + team</li><li>Security/legal classification</li><li>V1/launch definition</li><li>Commercial model</li><li>Residual waterfall</li><li>Kill/continue criteria</li></ol></article>
          <article><h2>Candidate bench</h2>{capstoneCandidates.map((product) => <p key={product.id}><strong>{product.name}</strong><br /><small>{product.readiness}% current readiness · {product.disposition}</small></p>)}</article>
          <article><h2>Admitted Capstones</h2>{foundryCapstones.length === 0 ? <p>No residual-bearing Capstones are admitted yet.</p> : foundryCapstones.map((capstone) => <p key={capstone.id}><strong>{capstone.name}</strong><br /><small>{capstone.status}</small></p>)}<p className="foundry__guardrail">Existing company products do not become a builder's Capstone merely because the builder works on them.</p></article>
        </section>
      )}

      {tab === "economics" && (
        <section>
          <div className="foundry__simulator">
            <h2>Capstone DPR simulator</h2>
            <label>Monthly Distributable Product Residual <input type="number" min="0" value={dpr} onChange={(event) => setDpr(Number(event.target.value) || 0)} /></label>
            <label>Company % <input type="range" min={companyFloor} max="75" value={companyPct} onChange={(event) => { const next = Number(event.target.value); setCompanyPct(next); if (leadPct > 100 - next) setLeadPct(Math.max(0, 100 - next)); }} /><strong>{companyPct}%</strong></label>
            <label>Lead % <input type="range" min="0" max={leadCeiling} value={leadPct} onChange={(event) => setLeadPct(Math.min(Number(event.target.value), leadCeiling, 100 - companyPct))} /><strong>{leadPct}%</strong></label>
            <p>Team pool automatically receives the remainder: <strong>{teamPct}%</strong></p>
          </div>
          <div className="foundry__summary-grid"><article><span>Company</span><strong>{money(dpr * companyPct / 100)}</strong><small>{companyPct}% · minimum floor {companyFloor}%</small></article><article><span>Capstone lead</span><strong>{money(dpr * leadPct / 100)}</strong><small>{leadPct}% · maximum ceiling {leadCeiling}%</small></article><article><span>Team pool</span><strong>{money(dpr * teamPct / 100)}</strong><small>{teamPct}% distributed by signed team schedule</small></article></div>
          <p className="foundry__guardrail">Residual is not ownership. DPR is after the approved product waterfall; gross revenue is never treated as residual.</p>
        </section>
      )}

      {tab === "doctrine" && (
        <section className="foundry__cards">
          <article><h2>Four ledgers</h2><ol><li>Parent Ownership</li><li>Production Compensation</li><li>Product Residual</li><li>Capital / Property Contribution</li></ol></article>
          <article><h2>Economic doctrine</h2><p><strong>Ownership</strong> rewards building and bearing risk in the Foundry.</p><p><strong>Phase compensation</strong> rewards accepted production.</p><p><strong>Residual participation</strong> rewards successful product economics.</p><p><strong>Capital contribution</strong> records what someone puts at risk.</p></article>
          <article><h2>CF-007 safety posture</h2><ul><li>Registry-driven read-first UI</li><li>Payroll enabled: {String(foundryEconomicRules.payrollEnabled)}</li><li>Equity issuance enabled: {String(foundryEconomicRules.equityIssuanceEnabled)}</li><li>Money movement enabled: {String(foundryEconomicRules.moneyMovementEnabled)}</li><li>Monthly settlement remains doctrine only</li><li>No self-acceptance of paid work</li></ul></article>
        </section>
      )}
    </div>
  );
}
