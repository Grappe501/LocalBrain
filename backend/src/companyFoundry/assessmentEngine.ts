import { randomUUID } from "node:crypto";
import { getDatabase } from "../db/database.js";
import { academyModules, academyStages } from "./academyCurriculum.js";
import { buildLesson } from "./lessonFactory.js";

export type RubricScore={criterion:string;score:number;weight:number;note?:string};

export function migrateAssessmentTables():void{getDatabase().exec(`
CREATE TABLE IF NOT EXISTS foundry_academy_evidence_submissions (
 id TEXT PRIMARY KEY,enrollment_id TEXT NOT NULL,module_id TEXT NOT NULL,submission_no INTEGER NOT NULL,
 explanation TEXT NOT NULL,evidence_json TEXT NOT NULL DEFAULT '[]',validation_json TEXT NOT NULL DEFAULT '[]',reflection TEXT NOT NULL DEFAULT '',
 status TEXT NOT NULL DEFAULT 'submitted',created_at TEXT NOT NULL DEFAULT (datetime('now')),
 UNIQUE(enrollment_id,module_id,submission_no)
);
CREATE TABLE IF NOT EXISTS foundry_academy_assessments (
 id TEXT PRIMARY KEY,submission_id TEXT NOT NULL UNIQUE,enrollment_id TEXT NOT NULL,module_id TEXT NOT NULL,
 rubric_json TEXT NOT NULL,weighted_score REAL NOT NULL,recommendation TEXT NOT NULL,feedback_json TEXT NOT NULL DEFAULT '[]',
 human_review_required INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS foundry_academy_remediation_packets (
 id TEXT PRIMARY KEY,enrollment_id TEXT NOT NULL,module_id TEXT NOT NULL,source_submission_id TEXT NOT NULL,
 gaps_json TEXT NOT NULL DEFAULT '[]',steps_json TEXT NOT NULL DEFAULT '[]',status TEXT NOT NULL DEFAULT 'open',created_at TEXT NOT NULL DEFAULT (datetime('now')),resolved_at TEXT
);
`);}

function nextSubmissionNo(enrollmentId:string,moduleId:string){const row=getDatabase().prepare(`SELECT MAX(submission_no) n FROM foundry_academy_evidence_submissions WHERE enrollment_id=? AND module_id=?`).get(enrollmentId,moduleId) as {n:number|null};return Number(row?.n??0)+1;}
export function submitLessonEvidence(input:{enrollmentId:string;moduleId:string;explanation:string;evidence?:unknown[];validation?:unknown[];reflection?:string}){if(!academyModules.some(m=>m.id===input.moduleId))return {ok:false,error:"module_not_found"};const id=randomUUID(),n=nextSubmissionNo(input.enrollmentId,input.moduleId);getDatabase().prepare(`INSERT INTO foundry_academy_evidence_submissions (id,enrollment_id,module_id,submission_no,explanation,evidence_json,validation_json,reflection) VALUES (?,?,?,?,?,?,?,?)`).run(id,input.enrollmentId,input.moduleId,n,input.explanation,JSON.stringify(input.evidence??[]),JSON.stringify(input.validation??[]),input.reflection??"");return {ok:true,submission:getDatabase().prepare(`SELECT * FROM foundry_academy_evidence_submissions WHERE id=?`).get(id)};}

function scoreHeuristic(sub:any,criterion:string){const evidence=JSON.parse(sub.evidence_json||"[]") as unknown[];const validation=JSON.parse(sub.validation_json||"[]") as unknown[];const text=String(sub.explanation||"");if(criterion==="understanding")return Math.min(100,text.trim().length>=220?90:text.trim().length>=100?75:50);if(criterion==="bounded execution")return Math.min(100,/scope|bound|allowed|forbidden|inspect/i.test(text)?90:65);if(criterion==="evidence")return evidence.length>=2&&validation.length>=1?95:evidence.length>=1?75:45;if(criterion==="explanation and judgment")return sub.reflection?.trim()?.length>=80?90:text.length>=180?75:55;return 60;}
export function assessSubmission(submissionId:string){const db=getDatabase();const sub=db.prepare(`SELECT * FROM foundry_academy_evidence_submissions WHERE id=?`).get(submissionId) as any;if(!sub)return {ok:false,error:"submission_not_found"};const existing=db.prepare(`SELECT * FROM foundry_academy_assessments WHERE submission_id=?`).get(submissionId);if(existing)return {ok:true,assessment:existing};const lesson=buildLesson(sub.module_id);if(!lesson)return {ok:false,error:"lesson_not_found"};const rubric:RubricScore[]=lesson.rubric.map(r=>({criterion:r.criterion,weight:r.weight,score:scoreHeuristic(sub,r.criterion)}));const weighted=Math.round(rubric.reduce((sum,r)=>sum+(r.score*r.weight/100),0));const module=academyModules.find(m=>m.id===sub.module_id)!;const humanRequired=module.lessonType==="production"||module.lessonType==="assessment"||module.lessonType==="capstone";const recommendation=weighted>=80?"ready_for_review":weighted>=65?"revise":"remediation";const feedback=rubric.filter(r=>r.score<80).map(r=>`${r.criterion}: strengthen this area before acceptance.`);const id=randomUUID();db.prepare(`INSERT INTO foundry_academy_assessments (id,submission_id,enrollment_id,module_id,rubric_json,weighted_score,recommendation,feedback_json,human_review_required) VALUES (?,?,?,?,?,?,?,?,?)`).run(id,sub.id,sub.enrollment_id,sub.module_id,JSON.stringify(rubric),weighted,recommendation,JSON.stringify(feedback),humanRequired?1:0);if(recommendation!=="ready_for_review"){const gaps=rubric.filter(r=>r.score<80).map(r=>r.criterion);db.prepare(`INSERT INTO foundry_academy_remediation_packets (id,enrollment_id,module_id,source_submission_id,gaps_json,steps_json) VALUES (?,?,?,?,?,?)`).run(randomUUID(),sub.enrollment_id,sub.module_id,sub.id,JSON.stringify(gaps),JSON.stringify(gaps.map(g=>`Review the lesson section for ${g}, revise your work, add evidence, and resubmit.`)));}return {ok:true,assessment:db.prepare(`SELECT * FROM foundry_academy_assessments WHERE id=?`).get(id),authoritative:false};}

export function getLearnerAssessmentHistory(enrollmentId:string){const db=getDatabase();return {submissions:db.prepare(`SELECT * FROM foundry_academy_evidence_submissions WHERE enrollment_id=? ORDER BY created_at`).all(enrollmentId),assessments:db.prepare(`SELECT * FROM foundry_academy_assessments WHERE enrollment_id=? ORDER BY created_at`).all(enrollmentId),remediation:db.prepare(`SELECT * FROM foundry_academy_remediation_packets WHERE enrollment_id=? ORDER BY created_at`).all(enrollmentId)};}

export function getCurriculumCoverage(){const catalogue=academyModules.map(m=>{const lesson=buildLesson(m.id)!;const depth=[lesson.why,lesson.guidedExample,lesson.exercise,lesson.capstoneConnection].filter(x=>String(x).length>=40).length;return {moduleId:m.id,stageId:m.stageId,title:m.title,lessonType:m.lessonType,structured:true,authoredDepthScore:Math.round(depth/4*100),hasRubric:lesson.rubric.length>0,requiresEvidence:m.requiresEvidence};});return {modulesTotal:catalogue.length,stagesTotal:academyStages.length,structuredCoveragePct:100,deepEditorialCoveragePct:Math.round(catalogue.filter(x=>x.authoredDepthScore>=100).length/catalogue.length*100),modules:catalogue};}

export function getCohortLearningAnalytics(){const db=getDatabase();const row=db.prepare(`SELECT COUNT(*) enrollments FROM foundry_academy_enrollments`).get() as any;const a=db.prepare(`SELECT COUNT(*) assessments,AVG(weighted_score) avg_score FROM foundry_academy_assessments`).get() as any;const r=db.prepare(`SELECT COUNT(*) open_remediation FROM foundry_academy_remediation_packets WHERE status='open'`).get() as any;return {enrollments:Number(row?.enrollments??0),assessments:Number(a?.assessments??0),averageAssessmentScore:Math.round(Number(a?.avg_score??0)*10)/10,openRemediation:Number(r?.open_remediation??0),authoritativeAssessment:false};}
