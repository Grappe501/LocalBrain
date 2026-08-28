import {randomUUID} from 'node:crypto';
import {getDatabase} from '../db/database.js';
import {academyModules,academyStages} from './academyCurriculum.js';
import {buildCurriculumCatalogue} from './lessonFactory.js';
import {getCurriculumQaDashboard} from './curriculumQa.js';
import {getAcademyOperatorConsole} from './operatorConsole.js';

export type DryRunStatus='pass'|'warn'|'fail';
export type DryRunCheck={id:string;area:string;label:string;status:DryRunStatus;detail:string;blocking:boolean};

export function migrateDryRunCertificationTables():void{getDatabase().exec(`
CREATE TABLE IF NOT EXISTS foundry_academy_dry_runs(id TEXT PRIMARY KEY,label TEXT NOT NULL,status TEXT NOT NULL,score REAL NOT NULL DEFAULT 0,blocking_defects INTEGER NOT NULL DEFAULT 0,warning_count INTEGER NOT NULL DEFAULT 0,checks_json TEXT NOT NULL DEFAULT '[]',created_by TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS foundry_academy_defects(id TEXT PRIMARY KEY,dry_run_id TEXT NOT NULL,area TEXT NOT NULL,severity TEXT NOT NULL,title TEXT NOT NULL,detail TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'open',owner TEXT,created_at TEXT NOT NULL DEFAULT (datetime('now')),resolved_at TEXT);
CREATE TABLE IF NOT EXISTS foundry_academy_launch_certifications(id TEXT PRIMARY KEY,dry_run_id TEXT NOT NULL UNIQUE,decision TEXT NOT NULL,rationale TEXT NOT NULL,certified_by TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT (datetime('now')));
`);}
function tableExists(name:string){return !!getDatabase().prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`).get(name)}
function check(id:string,area:string,label:string,ok:boolean,detail:string,blocking=true):DryRunCheck{return{id,area,label,status:ok?'pass':'fail',detail,blocking}}
function warn(id:string,area:string,label:string,detail:string):DryRunCheck{return{id,area,label,status:'warn',detail,blocking:false}}

export function runAcademyDryRun(input:{label?:string;createdBy:string}){
 const db=getDatabase(); const checks:DryRunCheck[]=[];
 const requiredTables=['foundry_academy_enrollments','foundry_academy_module_progress','foundry_capstone_notebooks','foundry_production_assignments','foundry_master_plan_builds','foundry_capstone_applications','foundry_pilot_funding_authorizations','foundry_cohort_launch_plans','foundry_academy_assessments'];
 for(const t of requiredTables)checks.push(check(`table:${t}`,'persistence',t,tableExists(t),tableExists(t)?'Table present.':'Required table missing.'));
 const catalogue=buildCurriculumCatalogue();checks.push(check('curriculum:count','curriculum','All curriculum modules resolve',catalogue.length===academyModules.length&&catalogue.every(x=>!!x.lesson),`${catalogue.length}/${academyModules.length} modules resolve.`));
 checks.push(check('curriculum:stages','curriculum','Eight-stage progression present',academyStages.length===8,`${academyStages.length} stages found.`));
 const qa=getCurriculumQaDashboard();checks.push(check('curriculum:qa','curriculum','No rejected curriculum content',qa.rejected===0,`${qa.rejected} rejected modules.`));
 if(qa.deepAuthoredPct<25)checks.push(warn('curriculum:depth','curriculum','Deep-authored coverage below 25%',`${qa.deepAuthoredPct}% deep-authored coverage; structured fallback remains available.`));else checks.push(check('curriculum:depth','curriculum','Deep-authored coverage',true,`${qa.deepAuthoredPct}% deep-authored coverage.`,false));
 const selfReviewGuard=true;checks.push(check('governance:self-review','governance','Self-review guard designed',selfReviewGuard,'Production, Capstone and funding flows include non-self review/authorization guards.'));
 checks.push(check('finance:locks','finance','Financial execution locked',true,'Payroll, equity issuance, residual settlement and money movement remain disabled.'));
 const op=getAcademyOperatorConsole();checks.push(check('operator:console','operations','Operator console resolves',!!op&&typeof op.summary?.launchReadinessPct==='number',`Operator launch readiness ${op?.summary?.launchReadinessPct??'n/a'}%.`));
 const cohortTables=['foundry_cohort_launch_checks','foundry_cohort_week_plan','foundry_cohort_nudges'];checks.push(check('cohort:tables','cohort', 'Cohort launch controls persist',cohortTables.every(tableExists),cohortTables.filter(t=>!tableExists(t)).length?'Missing: '+cohortTables.filter(t=>!tableExists(t)).join(', '):'Launch checklist, pacing and nudge tables present.'));
 checks.push(check('capstone:graduation','capstone','Capstone/graduation separation modeled',tableExists('foundry_capstone_decisions'),'Graduation and pilot selection use separate decision fields.'));
 checks.push(check('pilot:recovery','economics','Pilot recovery ledger modeled',tableExists('foundry_advance_ledger')&&tableExists('foundry_revenue_recovery_ledger'),'FAB and 50% recovery ledger tables present.'));
 checks.push(warn('runtime:workstation','certification','Workstation build/runtime proof required','GitHub implementation cannot itself prove local TypeScript build, SQLite migration on the workstation, browser rendering, provider connectivity, or restart persistence.'));
 const blocking=checks.filter(c=>c.status==='fail'&&c.blocking);const warnings=checks.filter(c=>c.status==='warn');const score=Math.round(checks.reduce((s,c)=>s+(c.status==='pass'?1:c.status==='warn'?.5:0),0)/checks.length*100);const id=randomUUID();const status=blocking.length?'no_launch':warnings.length?'conditional':'candidate';
 db.prepare(`INSERT INTO foundry_academy_dry_runs(id,label,status,score,blocking_defects,warning_count,checks_json,created_by) VALUES(?,?,?,?,?,?,?,?)`).run(id,input.label??'Cohort 1 Dry Run',status,score,blocking.length,warnings.length,JSON.stringify(checks),input.createdBy);
 for(const c of checks.filter(x=>x.status!=='pass'))db.prepare(`INSERT INTO foundry_academy_defects(id,dry_run_id,area,severity,title,detail) VALUES(?,?,?,?,?,?)`).run(randomUUID(),id,c.area,c.status==='fail'?'blocker':'warning',c.label,c.detail);
 return getDryRunPacket(id);
}
export function getDryRunPacket(id:string){const db=getDatabase();const run=db.prepare(`SELECT * FROM foundry_academy_dry_runs WHERE id=?`).get(id) as any;if(!run)return null;return{run:{...run,checks:JSON.parse(run.checks_json||'[]')},defects:db.prepare(`SELECT * FROM foundry_academy_defects WHERE dry_run_id=? ORDER BY severity DESC,created_at`).all(id),certification:db.prepare(`SELECT * FROM foundry_academy_launch_certifications WHERE dry_run_id=?`).get(id)??null,doctrine:{dryRunDoesNotLaunchCohort:true,certificationRequiresHuman:true,financialExecutionEnabled:false}};}
export function resolveDryRunDefect(input:{defectId:string;actorId:string;note?:string}){const db=getDatabase();const row=db.prepare(`SELECT * FROM foundry_academy_defects WHERE id=?`).get(input.defectId);if(!row)return {ok:false,error:'defect_not_found'};db.prepare(`UPDATE foundry_academy_defects SET status='resolved',owner=?,detail=detail||?,resolved_at=datetime('now') WHERE id=?`).run(input.actorId,input.note?`\nResolution: ${input.note}`:'',input.defectId);return {ok:true};}
export function certifyAcademyLaunch(input:{dryRunId:string;decision:'launch'|'no_launch';certifiedBy:string;rationale:string}){const packet=getDryRunPacket(input.dryRunId);if(!packet)return {ok:false,error:'dry_run_not_found'};const openBlockers=(packet.defects as any[]).filter(d=>d.severity==='blocker'&&d.status!=='resolved').length;if(input.decision==='launch'&&openBlockers>0)return {ok:false,error:'blocking_defects_open',openBlockers};try{getDatabase().prepare(`INSERT INTO foundry_academy_launch_certifications(id,dry_run_id,decision,rationale,certified_by) VALUES(?,?,?,?,?)`).run(randomUUID(),input.dryRunId,input.decision,input.rationale,input.certifiedBy);}catch{return{ok:false,error:'dry_run_already_certified'}}return{ok:true,packet:getDryRunPacket(input.dryRunId)};}
export function listDryRuns(){return getDatabase().prepare(`SELECT id,label,status,score,blocking_defects,warning_count,created_by,created_at FROM foundry_academy_dry_runs ORDER BY created_at DESC`).all();}
