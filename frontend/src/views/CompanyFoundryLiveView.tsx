import { useEffect, useMemo, useState } from "react";
import { fetchCompanyFoundrySnapshot, fetchCompanyFoundryValidation, type CompanyFoundrySnapshot, type FoundryProduct } from "../api/companyFoundry";
import "../styles/company-foundry.css";

const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

export function CompanyFoundryLiveView() {
  const [snapshot, setSnapshot] = useState<CompanyFoundrySnapshot | null>(null);
  const [validation, setValidation] = useState<{ valid: boolean; errors: string[] } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState("portfolio");
  const [error, setError] = useState<string | null>(null);
  const [dpr, setDpr] = useState(9000);
  const [companyPct, setCompanyPct] = useState(35);
  const [leadPct, setLeadPct] = useState(40);

  useEffect(() => {
    void Promise.all([fetchCompanyFoundrySnapshot(), fetchCompanyFoundryValidation()])
      .then(([data, check]) => { setSnapshot(data); setValidation(check); setSelectedId(data.products[0]?.id ?? null); })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load Company Foundry"));
  }, []);

  const totals = useMemo(() => snapshot ? {
    low: snapshot.products.reduce((sum, p) => sum + p.annualLow, 0),
    high: snapshot.products.reduce((sum, p) => sum + p.annualHigh, 0),
  } : { low: 0, high: 0 }, [snapshot]);

  if (error) return <div className="foundry"><p className="foundry__guardrail">Company Foundry API error: {error}</p></div>;
  if (!snapshot) return <div className="foundry"><p>Loading Company Foundry registry…</p></div>;

  const selected = snapshot.products.find((p) => p.id === selectedId) ?? null;
  const selectedPlans = snapshot.masterPlans.filter((p) => p.productId === selected?.id);
  const selectedPhases = snapshot.phases.filter((p) => p.productId === selected?.id);
  const companyFloor = snapshot.economicRules.companyResidualFloorPct;
  const leadCeiling = snapshot.economicRules.capstoneLeadResidualCeilingPct;
  const teamPct = Math.max(0, 100 - companyPct - leadPct);

  return <div className="foundry">
    <header className="foundry__hero"><div><p className="foundry__eyebrow">Company Foundry · {snapshot.meta.slice}</p><h1>Build people. Build products. Build owners.</h1><p>Validated read API · schema {snapshot.meta.schemaVersion} · financial actions disabled.</p></div><div className="foundry__hero-stats"><div><strong>{snapshot.products.length}</strong><span>products</span></div><div><strong>{snapshot.masterPlans.length}</strong><span>master plans</span></div><div><strong>{snapshot.phases.length}</strong><span>phase records</span></div><div><strong>{validation?.valid ? "PASS" : "CHECK"}</strong><span>registry validation</span></div></div></header>

    <nav className="foundry__tabs" aria-label="Company Foundry sections">{[["portfolio","Portfolio"],["product","Product Detail"],["plans","Master Plans"],["phases","Phase Value"],["economics","Economics"],["doctrine","Doctrine"]].map(([id,label]) => <button key={id} type="button" className={tab===id?"is-active":""} onClick={()=>setTab(id)}>{label}</button>)}</nav>

    {tab === "portfolio" && <section><div className="foundry__summary-grid"><article><span>50%-haircut capacity · low</span><strong>{money(totals.low)}</strong><small>planning capacity</small></article><article><span>50%-haircut capacity · high</span><strong>{money(totals.high)}</strong><small>planning capacity</small></article><article><span>Cash forecast before paid validation</span><strong>{money(snapshot.meta.cashForecastUntilPaidValidationUsd)}</strong><small>doctrine</small></article></div><div className="foundry__table-wrap"><table className="foundry__table"><thead><tr><th>Product</th><th>Type</th><th>Ready</th><th>Disposition</th><th>Annual capacity</th></tr></thead><tbody>{snapshot.products.map(p=><tr key={p.id} onClick={()=>{setSelectedId(p.id);setTab("product");}} style={{cursor:"pointer"}}><td><strong>{p.name}</strong></td><td>{p.kind}</td><td>{p.readiness}%</td><td>{p.disposition}</td><td>{money(p.annualLow)}–{money(p.annualHigh)}</td></tr>)}</tbody></table></div></section>}

    {tab === "product" && selected && <ProductDetail product={selected} plans={selectedPlans} phases={selectedPhases} />}

    {tab === "plans" && <section><h2>Master Build Plans</h2>{snapshot.masterPlans.map(plan=><article className="foundry__guardrail" key={plan.id}><strong>{plan.title}</strong> · {plan.status}<br/>{plan.purpose}<br/><small>{plan.remainingReadinessPct}% remaining · {money(plan.budgetUsd)} budget · Capstone eligible: {plan.capstoneEligible?"yes":"no"}</small></article>)}</section>}

    {tab === "phases" && <section><div className="foundry__table-wrap"><table className="foundry__table"><thead><tr><th>Phase</th><th>Product</th><th>Budget</th><th>Status</th><th>Acceptance</th><th>Evidence</th></tr></thead><tbody>{snapshot.phases.map(phase=><tr key={phase.phaseId}><td><strong>{phase.phaseId}</strong><br/>{phase.title}</td><td>{phase.productId}</td><td>{money(phase.budgetUsd)}</td><td>{phase.status}</td><td>{phase.acceptanceCriteria.join(" · ")}</td><td>{phase.evidenceRequired.join(" · ")}</td></tr>)}</tbody></table></div></section>}

    {tab === "economics" && <section><div className="foundry__simulator"><h2>Capstone DPR simulator</h2><label>Monthly DPR <input type="number" min="0" value={dpr} onChange={e=>setDpr(Number(e.target.value)||0)}/></label><label>Company % <input type="range" min={companyFloor} max="75" value={companyPct} onChange={e=>setCompanyPct(Number(e.target.value))}/><strong>{companyPct}%</strong></label><label>Lead % <input type="range" min="0" max={leadCeiling} value={leadPct} onChange={e=>setLeadPct(Math.min(Number(e.target.value),100-companyPct))}/><strong>{leadPct}%</strong></label><p>Team pool: <strong>{teamPct}%</strong></p></div><div className="foundry__summary-grid"><article><span>Company</span><strong>{money(dpr*companyPct/100)}</strong></article><article><span>Lead</span><strong>{money(dpr*leadPct/100)}</strong></article><article><span>Team</span><strong>{money(dpr*teamPct/100)}</strong></article></div></section>}

    {tab === "doctrine" && <section className="foundry__cards"><article><h2>Validation</h2><p>{validation?.valid?"Registry valid":"Registry needs attention"}</p>{validation?.errors.map(e=><p key={e}>{e}</p>)}</article><article><h2>Financial controls</h2><p>Payroll: {snapshot.economicRules.payrollEnabled?"enabled":"disabled"}</p><p>Equity issuance: {snapshot.economicRules.equityIssuanceEnabled?"enabled":"disabled"}</p><p>Money movement: {snapshot.economicRules.moneyMovementEnabled?"enabled":"disabled"}</p></article><article><h2>Residual doctrine</h2><p>Company floor: {companyFloor}%</p><p>Lead ceiling: {leadCeiling}%</p><p>Residual is not ownership.</p></article></section>}
  </div>;
}

function ProductDetail({ product, plans, phases }: { product: FoundryProduct; plans: CompanyFoundrySnapshot["masterPlans"]; phases: CompanyFoundrySnapshot["phases"] }) {
  return <section className="foundry__cards"><article><h2>{product.name}</h2><p>{product.disposition}</p><p><strong>{product.readiness}% ready</strong> · {money(product.annualLow)}–{money(product.annualHigh)} conservative annual capacity</p><p>Source: {product.sourceRepos.join(" · ")}</p>{product.notes&&<p>{product.notes}</p>}</article><article><h2>Advantages</h2>{product.advantages.length?product.advantages.map(x=><p key={x}>+ {x}</p>):<p>Detailed advantage audit pending.</p>}<h2>Disadvantages</h2>{product.disadvantages.length?product.disadvantages.map(x=><p key={x}>− {x}</p>):<p>Detailed disadvantage audit pending.</p>}</article><article><h2>Competitors / substitutes</h2>{product.competitors.length?product.competitors.map(c=><p key={c.name}><strong>{c.name}</strong> · {c.category}<br/><small>{c.pricing_note??c.evidence_status}</small></p>):<p>Competitor evidence pending.</p>}</article><article><h2>Build records</h2><p>Master Plans: {plans.length}</p><p>Phase Value Records: {phases.length}</p><p>Training: {product.training?"eligible":"not currently"}</p><p>Capstone candidate: {product.capstoneCandidate?"yes":"no"}</p></article></section>;
}
