import { randomUUID } from "node:crypto";
import { getDatabase } from "../db/database.js";
import { getCapstoneNotebook } from "./capstoneNotebook.js";
import { getMasterPlanBuild, getMasterPlanDashboard, exportMasterPlan } from "./masterPlanBuilder.js";

export type CapstoneApplicationStatus = "draft" | "submitted" | "red_team" | "defense_ready" | "decided";
export type GraduationDecision = "graduate" | "remediation" | "not_graduated";
export type PilotDecision = "selected" | "phase_track" | "hold";

export function migrateCapstoneDefenseTables(): void {
  getDatabase().exec(`
    CREATE TABLE IF NOT EXISTS foundry_capstone_applications (
      id TEXT PRIMARY KEY, notebook_id TEXT NOT NULL UNIQUE, build_id TEXT NOT NULL, builder_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft', application_json TEXT NOT NULL DEFAULT '{}', submitted_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS foundry_capstone_red_team (
      id TEXT PRIMARY KEY, application_id TEXT NOT NULL, reviewer_id TEXT NOT NULL, market_score REAL NOT NULL,
      technical_score REAL NOT NULL, economic_score REAL NOT NULL, execution_score REAL NOT NULL,
      findings_json TEXT NOT NULL DEFAULT '[]', recommendation TEXT NOT NULL, rationale TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS foundry_capstone_defenses (
      id TEXT PRIMARY KEY, application_id TEXT NOT NULL, defender_id TEXT NOT NULL, panel_json TEXT NOT NULL DEFAULT '[]',
      answers_json TEXT NOT NULL DEFAULT '[]', score REAL NOT NULL, rationale TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS foundry_capstone_decisions (
      id TEXT PRIMARY KEY, application_id TEXT NOT NULL UNIQUE, decided_by TEXT NOT NULL,
      graduation_decision TEXT NOT NULL, pilot_decision TEXT NOT NULL, rationale TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

export function ensureCapstoneApplication(notebookId:string, buildId:string) {
  const notebook = getCapstoneNotebook(notebookId); const build = getMasterPlanBuild(buildId);
  if (!notebook || !build || build.notebook_id !== notebookId) return null;
  const db=getDatabase(); const existing=db.prepare(`SELECT * FROM foundry_capstone_applications WHERE notebook_id=?`).get(notebookId) as any;
  if (existing) return existing;
  const id=randomUUID();
  db.prepare(`INSERT INTO foundry_capstone_applications (id,notebook_id,build_id,builder_id) VALUES (?,?,?,?)`).run(id,notebookId,buildId,notebook.builder_id);
  return db.prepare(`SELECT * FROM foundry_capstone_applications WHERE id=?`).get(id);
}

export function submitCapstoneApplication(input:{applicationId:string;builderId:string;application:unknown}) {
  const db=getDatabase(); const app=db.prepare(`SELECT * FROM foundry_capstone_applications WHERE id=?`).get(input.applicationId) as any;
  if (!app) return {ok:false,error:"application_not_found"};
  if (app.builder_id!==input.builderId) return {ok:false,error:"builder_mismatch"};
  const plan=getMasterPlanDashboard(app.build_id);
  if (!plan?.redTeamReady || !getMasterPlanBuild(app.build_id)?.red_team_score) return {ok:false,error:"master_plan_red_team_required"};
  db.prepare(`UPDATE foundry_capstone_applications SET application_json=?,status='submitted',submitted_at=datetime('now'),updated_at=datetime('now') WHERE id=?`).run(JSON.stringify(input.application??{}),app.id);
  return {ok:true,application:getCapstoneApplication(app.id)};
}

export function getCapstoneApplication(id:string){ return (getDatabase().prepare(`SELECT * FROM foundry_capstone_applications WHERE id=?`).get(id) as any)??null; }

export function redTeamCapstone(input:{applicationId:string;reviewerId:string;marketScore:number;technicalScore:number;economicScore:number;executionScore:number;findings?:unknown[];recommendation:"defense"|"rework"|"decline";rationale:string}) {
  const app=getCapstoneApplication(input.applicationId); if(!app) return {ok:false,error:"application_not_found"};
  if(app.builder_id===input.reviewerId) return {ok:false,error:"self_review_forbidden"};
  const clamp=(n:number)=>Math.max(0,Math.min(100,Number(n)));
  getDatabase().transaction(()=>{
    getDatabase().prepare(`INSERT INTO foundry_capstone_red_team (id,application_id,reviewer_id,market_score,technical_score,economic_score,execution_score,findings_json,recommendation,rationale) VALUES (?,?,?,?,?,?,?,?,?,?)`).run(randomUUID(),app.id,input.reviewerId,clamp(input.marketScore),clamp(input.technicalScore),clamp(input.economicScore),clamp(input.executionScore),JSON.stringify(input.findings??[]),input.recommendation,input.rationale);
    getDatabase().prepare(`UPDATE foundry_capstone_applications SET status=?,updated_at=datetime('now') WHERE id=?`).run(input.recommendation==="defense"?"defense_ready":"red_team",app.id);
  })();
  return {ok:true};
}

export function recordCapstoneDefense(input:{applicationId:string;defenderId:string;panel:string[];answers?:unknown[];score:number;rationale:string}) {
  const app=getCapstoneApplication(input.applicationId); if(!app) return {ok:false,error:"application_not_found"};
  if(app.builder_id!==input.defenderId) return {ok:false,error:"defender_mismatch"};
  if(app.status!=="defense_ready") return {ok:false,error:"defense_not_ready"};
  const score=Math.max(0,Math.min(100,Number(input.score)));
  getDatabase().prepare(`INSERT INTO foundry_capstone_defenses (id,application_id,defender_id,panel_json,answers_json,score,rationale) VALUES (?,?,?,?,?,?,?)`).run(randomUUID(),app.id,input.defenderId,JSON.stringify(input.panel??[]),JSON.stringify(input.answers??[]),score,input.rationale);
  return {ok:true};
}

export function decideCapstone(input:{applicationId:string;decidedBy:string;graduationDecision:GraduationDecision;pilotDecision:PilotDecision;rationale:string}) {
  const app=getCapstoneApplication(input.applicationId); if(!app) return {ok:false,error:"application_not_found"};
  if(app.builder_id===input.decidedBy) return {ok:false,error:"self_decision_forbidden"};
  const defense=getDatabase().prepare(`SELECT * FROM foundry_capstone_defenses WHERE application_id=? ORDER BY created_at DESC LIMIT 1`).get(app.id);
  if(!defense) return {ok:false,error:"defense_required"};
  if(input.graduationDecision!=="graduate" && input.pilotDecision==="selected") return {ok:false,error:"pilot_requires_graduation"};
  getDatabase().transaction(()=>{
    getDatabase().prepare(`INSERT INTO foundry_capstone_decisions (id,application_id,decided_by,graduation_decision,pilot_decision,rationale) VALUES (?,?,?,?,?,?)`).run(randomUUID(),app.id,input.decidedBy,input.graduationDecision,input.pilotDecision,input.rationale);
    getDatabase().prepare(`UPDATE foundry_capstone_applications SET status='decided',updated_at=datetime('now') WHERE id=?`).run(app.id);
    if(input.graduationDecision==="graduate") getDatabase().prepare(`UPDATE foundry_academy_enrollments SET status='graduated',completed_at=datetime('now'),updated_at=datetime('now') WHERE builder_id=?`).run(app.builder_id);
    getDatabase().prepare(`UPDATE foundry_capstone_notebooks SET status=?,updated_at=datetime('now') WHERE id=?`).run(input.pilotDecision==="selected"?"pilot_selected":input.pilotDecision==="phase_track"?"phase_track":"graduation_ready",app.notebook_id);
  })();
  return {ok:true,decision:getDatabase().prepare(`SELECT * FROM foundry_capstone_decisions WHERE application_id=?`).get(app.id)};
}

export function getCapstoneDefenseDashboard(applicationId:string){
  const application=getCapstoneApplication(applicationId); if(!application) return null;
  const db=getDatabase();
  return { application, masterPlan:exportMasterPlan(application.build_id), redTeams:db.prepare(`SELECT * FROM foundry_capstone_red_team WHERE application_id=? ORDER BY created_at`).all(applicationId), defenses:db.prepare(`SELECT * FROM foundry_capstone_defenses WHERE application_id=? ORDER BY created_at`).all(applicationId), decision:db.prepare(`SELECT * FROM foundry_capstone_decisions WHERE application_id=?`).get(applicationId)??null, doctrine:{capstoneRequiredToGraduate:true,graduationSeparateFromPilotSelection:true,pilotFundingAuthorized:false,payrollEnabled:false,equityIssuanceEnabled:false,residualSettlementEnabled:false,moneyMovementEnabled:false} };
}
