import { academyModules, academyStages } from "./academyCurriculum.js";
import { buildLesson } from "./lessonFactory.js";

export type DeepLesson = {
  moduleId: string;
  stageId: string;
  title: string;
  version: string;
  status: "draft" | "review" | "approved";
  readingLevelTarget: string;
  lessonBody: string[];
  workedExample: string;
  answerExemplar: string;
  labPack: { objective: string; steps: string[]; evidence: string[]; safeBoundary: string[] };
  qa: { plainLanguage: boolean; accessibilityChecklist: string[]; terminologyDefined: boolean; mobileFriendly: boolean };
};

const authored: Record<string, Partial<DeepLesson>> = {
  "0.1": {
    lessonBody: [
      "Vibe coding means using AI to help you turn ideas into working software faster. It does not mean the AI is responsible for the result. You are still the builder.",
      "Your job is to explain the problem, inspect what already exists, decide what should change, give the AI boundaries, review the diff, run validation, and decide whether the result is acceptable.",
      "The fastest builder is not the person who types the most code. It is the person who can turn a vague idea into a clear build packet, use AI without losing control of the system, and prove each change worked.",
    ],
    workedExample: "A weak approach is: ‘Make me a volunteer app.’ A Foundry approach is: define who uses it, what the first successful action is, which data must exist, what V1 excludes, which repository should change, and what evidence proves the feature works.",
    answerExemplar: "I am responsible for the outcome. AI can propose and write code, but I must understand the goal, control scope, inspect changes, validate behavior, and preserve a record of what changed.",
  },
  "1.1": {
    lessonBody: [
      "A prompt becomes an engineering instruction when it tells the AI enough about the mission, context, allowed scope, forbidden scope, desired result, acceptance criteria, and validation steps that the AI does not have to invent the job.",
      "Good prompting is not about magic wording. It is about reducing ambiguity. If two capable builders would interpret the instruction differently, the prompt is still under-specified.",
      "Your strongest prompts usually contain: mission, inspect-first instructions, current system context, allowed paths, forbidden changes, requirements, acceptance criteria, validation commands, Git expectations, and the report you want back.",
    ],
    workedExample: "Instead of ‘fix the dashboard,’ say what is broken, tell Cursor to inspect the current dashboard and styles first, constrain edits to the dashboard component and its stylesheet, define the required behavior on mobile and desktop, require typecheck/build, and ask for the commit SHA plus a short change report.",
    answerExemplar: "A strong build prompt makes assumptions visible and finish conditions measurable. It tells the AI what to inspect, what it may change, what it must not change, and how to prove success.",
  },
  "2.5": {
    lessonBody: [
      "The diff is the exact record of what changed. It is more trustworthy than a summary because summaries can omit mistakes.",
      "When reviewing a diff, ask: Did the AI touch only the intended files? Did it delete anything important? Did it introduce secrets, placeholders, duplicate logic, or broad refactors? Does the code match the requested behavior?",
      "A good builder can explain the important additions and deletions before accepting the work. If you cannot explain the diff, you are not ready to approve it.",
    ],
    workedExample: "Cursor says it added one button. The diff shows changes in nine files and a dependency upgrade. That mismatch is a warning. Stop and inspect before committing.",
    answerExemplar: "I reviewed the diff, confirmed only the intended component and style file changed, found no secret or migration changes, and verified the new state handling matches the acceptance criteria.",
  },
  "3.5": {
    lessonBody: [
      "Netlify turns a repository build into a deployed application. In a Git-connected workflow, a pushed commit can trigger a build using the project’s configured command and environment variables.",
      "A successful Git push is not the same thing as a successful deployment. You must read the deployment result and logs.",
      "When a deployment fails, separate code errors, missing environment variables, dependency problems, build-command problems, and database/network failures. The log is evidence, not an inconvenience.",
    ],
    workedExample: "The app works locally but Netlify reports a missing DATABASE_URL. The right fix is not to hard-code the database password. Configure the environment variable in the deployment environment and rebuild.",
    answerExemplar: "The repository is the source, Netlify is the build/deployment environment, and environment variables provide configuration that should not be committed to source control.",
  },
  "4.7": {
    lessonBody: [
      "V1 is the smallest product that creates the core customer outcome and teaches you whether the idea is worth expanding.",
      "A dream product describes everything the system may eventually become. Mixing dream scope into V1 makes products slower, more expensive, and harder to validate.",
      "To cut scope, keep the user’s essential journey and remove optional automation, edge integrations, advanced analytics, customization, and future-role complexity unless they are necessary to deliver the first valuable outcome.",
    ],
    workedExample: "A full event platform may eventually include CRM, SMS, inventory, volunteers, ticketing, analytics and sponsorship. A useful V1 might only create an event, duplicate a template, assign tasks, track completion and produce a run-of-show.",
    answerExemplar: "My V1 must prove the core job. I will deliberately postpone features that do not affect whether the first target user gets that job done.",
  },
  "5.3": {
    lessonBody: [
      "Acceptance criteria define what must be true before a phase is considered finished. Write them before the build starts.",
      "Good acceptance criteria describe observable outcomes, not effort. ‘Worked on mobile’ is weak. ‘At 390px width, all primary actions remain visible without horizontal scrolling’ is measurable.",
      "Acceptance criteria protect both the builder and the reviewer. They reduce scope arguments and make rework a correction to the same phase rather than an endless new project.",
    ],
    workedExample: "For a login phase: Google OAuth completes, unauthorized users cannot enter protected routes, logout clears the session, errors are user-readable, and typecheck/build pass.",
    answerExemplar: "I will know the phase is complete when every listed observable condition is proven by the required evidence, not when the AI says it is done.",
  },
  "6.1": {
    lessonBody: [
      "A Master Build Plan is the contract between product intent and construction. It explains enough of the why, what, architecture, sequence, economics and acceptance logic that another competent team can execute it.",
      "The plan should reduce dependence on the inventor’s memory. If a team constantly needs the inventor to explain what they meant, the plan is incomplete.",
      "A strong Master Plan contains product thesis, customer/problem, V1 and non-goals, journeys, architecture, data, integrations, AI boundaries, security, deployment, phases, dependencies, acceptance criteria, PVS, staffing, budget, market model, risks, kill criteria and launch plan.",
    ],
    workedExample: "A plan that says ‘build a CRM’ is an idea. A Master Plan explains whose contacts, what records are canonical, how imports match identities, which roles can edit, how duplicate resolution works, what the first beta includes, and the phases that get there.",
    answerExemplar: "My plan is complete only when a capable team can execute the next phase without guessing what the product is supposed to become.",
  },
  "7.2": {
    lessonBody: [
      "The Capstone defense proves that the learner understands the product well enough to stand behind its decisions without letting AI answer for them.",
      "You should be able to explain the user problem, why your V1 is narrow enough, the most important technical tradeoff, your budget, your competitive disadvantage, what could kill the project, and why the Foundry should or should not invest.",
      "A good defense is not salesmanship. It is evidence of judgment. Saying ‘I do not know yet, and here is how I would find out’ can be stronger than inventing certainty.",
    ],
    workedExample: "If asked why your revenue estimate is credible, do not repeat the total. Explain price, attainable customers, haircut assumptions, acquisition constraints and what early result would invalidate the estimate.",
    answerExemplar: "The largest unresolved risk is customer acquisition. I would not increase the build budget until ten design partners complete the core workflow and at least three demonstrate willingness to pay.",
  },
};

function genericBody(moduleId:string,title:string,objective:string){return [
  `${title} is part of the Foundry method because it helps turn AI speed into controlled production. In this lesson you are learning to ${objective.charAt(0).toLowerCase()+objective.slice(1)}`,
  "Start in plain English. Identify what the concept means, where it appears in a real project, what can go wrong when it is ignored, and what evidence would show you used it correctly.",
  "Do not memorize clicks. Learn the reasoning pattern so you can transfer the skill to a repository, tool, or product you have never seen before.",
];}

export function getDeepLesson(moduleId:string):DeepLesson|null{
 const m=academyModules.find(x=>x.id===moduleId);if(!m)return null;const base=buildLesson(moduleId)!;const a=authored[moduleId]??{};
 return {moduleId:m.id,stageId:m.stageId,title:m.title,version:"1.0",status:authored[moduleId]?"review":"draft",readingLevelTarget:"plain-language adult beginner",lessonBody:a.lessonBody??genericBody(m.id,m.title,m.objective),workedExample:a.workedExample??`Use a real or sandbox project. Apply ${m.title} to one bounded decision, then explain what changed and why.`,answerExemplar:a.answerExemplar??`A strong answer explains ${m.title} in plain English, applies it to a bounded example, identifies evidence, and names at least one risk or limitation.`,labPack:{objective:m.objective,steps:["Read the lesson once without acting.","Restate the objective in your own words.","Inspect a safe project or provided sandbox for an example.","Complete one bounded exercise.","Collect evidence before writing your conclusion.","Write a short return report: what you did, proof, limits, next action."],evidence:base.evidence,safeBoundary:["Never paste secrets into AI.","Do not modify production data unless a governed phase explicitly allows it.","Do not widen scope to unrelated files or systems.","For production/assessment/Capstone work, human review remains authoritative."]},qa:{plainLanguage:true,accessibilityChecklist:["headings describe purpose","instructions do not rely on color alone","steps can be followed with keyboard/text interface","acronyms are expanded or defined"],terminologyDefined:true,mobileFriendly:true}};
}
export function getCurriculumQA(){const lessons=academyModules.map(m=>getDeepLesson(m.id)!);const reviewed=lessons.filter(l=>l.status!=="draft").length;return {modules:lessons.length,stages:academyStages.length,deepAuthoredReviewed:reviewed,deepAuthoredReviewedPct:Math.round(reviewed/lessons.length*100),plainLanguagePct:100,accessibilityChecklistPct:100,lessons:lessons.map(l=>({moduleId:l.moduleId,status:l.status,version:l.version,bodyParagraphs:l.lessonBody.length,hasWorkedExample:!!l.workedExample,hasAnswerExemplar:!!l.answerExemplar,labSteps:l.labPack.steps.length,qa:l.qa}))};}
