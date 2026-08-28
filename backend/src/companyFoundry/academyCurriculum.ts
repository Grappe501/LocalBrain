export type AcademyModule = {
  id: string;
  stageId: string;
  title: string;
  objective: string;
  lessonType: "concept" | "lab" | "production" | "assessment" | "capstone";
  requiresEvidence: boolean;
  capstoneCheckpoint?: string;
};

export type AcademyStage = {
  id: string;
  order: number;
  title: string;
  goal: string;
  gate: string;
  capstoneCheckpoint: string;
  moduleIds: string[];
};

export const academyStages: AcademyStage[] = [
  { id: "stage_0", order: 0, title: "Welcome to Building", goal: "Software and AI fundamentals", gate: "Explain software components and the human/AI roles", capstoneCheckpoint: "Problem inventory", moduleIds: ["0.1","0.2","0.3","0.4","0.5","0.6"] },
  { id: "stage_1", order: 1, title: "Talking to AI Like a Builder", goal: "Prompt specification and multi-AI orchestration", gate: "Produce a bounded, verifiable build prompt", capstoneCheckpoint: "Top three problem statements", moduleIds: ["1.1","1.2","1.3","1.4","1.5","1.6"] },
  { id: "stage_2", order: 2, title: "Cursor Fundamentals", goal: "Safe AI-native repository operation", gate: "Complete and explain a bounded repository change", capstoneCheckpoint: "Provisional idea and technical layers", moduleIds: ["2.1","2.2","2.3","2.4","2.5","2.6"] },
  { id: "stage_3", order: 3, title: "GitHub + Deployment", goal: "Durable delivery and production literacy", gate: "Push a safe change and trace the deployment path", capstoneCheckpoint: "Hosting, secrets and data map", moduleIds: ["3.1","3.2","3.3","3.4","3.5","3.6","3.7"] },
  { id: "stage_4", order: 4, title: "Concept to Construction", goal: "Product engineering before coding", gate: "Pass Problem/Solution Clarity Review", capstoneCheckpoint: "Problem, user, V1 and architecture", moduleIds: ["4.1","4.2","4.3","4.4","4.5","4.6","4.7","4.8"] },
  { id: "stage_5", order: 5, title: "Phase-Based Production", goal: "Accepted work on real Foundry products", gate: "Minimum accepted production evidence", capstoneCheckpoint: "Capstone phase decomposition and Foundry reuse", moduleIds: ["5.1","5.2","5.3","5.4","5.5","5.6","5.7","5.8","5.9"] },
  { id: "stage_6", order: 6, title: "Master Build Plan Engineering", goal: "Convert product vision into an executable company plan", gate: "A team that did not invent the idea can execute the plan", capstoneCheckpoint: "Complete Master Build Plan draft", moduleIds: ["6.1","6.2","6.3","6.4","6.5","6.6","6.7","6.8","6.9","6.10"] },
  { id: "stage_7", order: 7, title: "Capstone Application + Graduation", goal: "Defend product judgment and build readiness", gate: "Graduation panel", capstoneCheckpoint: "Final Capstone application and defense", moduleIds: ["7.1","7.2","7.3"] }
];

export const academyModules: AcademyModule[] = [
  { id:"0.1",stageId:"stage_0",title:"What vibe coding actually is",objective:"Understand AI-assisted building versus production engineering.",lessonType:"concept",requiresEvidence:false },
  { id:"0.2",stageId:"stage_0",title:"How software fits together",objective:"Understand frontend, backend, API, database, server, domain and auth.",lessonType:"concept",requiresEvidence:true },
  { id:"0.3",stageId:"stage_0",title:"Files, folders, terminals and paths",objective:"Navigate a project safely without editing it.",lessonType:"lab",requiresEvidence:true },
  { id:"0.4",stageId:"stage_0",title:"Foundry terminology I",objective:"Use core software vocabulary accurately.",lessonType:"assessment",requiresEvidence:true },
  { id:"0.5",stageId:"stage_0",title:"Meet your AI team",objective:"Distinguish strategic AI, Cursor/repository AI and reviewer AI roles.",lessonType:"lab",requiresEvidence:true },
  { id:"0.6",stageId:"stage_0",title:"Your Capstone Notebook",objective:"Create the first problem and opportunity inventory.",lessonType:"capstone",requiresEvidence:true,capstoneCheckpoint:"problem_inventory" },

  { id:"1.1",stageId:"stage_1",title:"Prompt anatomy",objective:"Write context, outcome, constraints and acceptance into prompts.",lessonType:"concept",requiresEvidence:true },
  { id:"1.2",stageId:"stage_1",title:"Weak prompts versus strong prompts",objective:"Repair vague instructions into engineering briefs.",lessonType:"lab",requiresEvidence:true },
  { id:"1.3",stageId:"stage_1",title:"Inspect before acting",objective:"Use read-first prompting to reduce assumptions and regressions.",lessonType:"lab",requiresEvidence:true },
  { id:"1.4",stageId:"stage_1",title:"Give AI boundaries",objective:"Define allowed paths, forbidden changes, secrets and migration gates.",lessonType:"lab",requiresEvidence:true },
  { id:"1.5",stageId:"stage_1",title:"Ask for proof",objective:"Require tests, builds, typechecks and implementation evidence.",lessonType:"lab",requiresEvidence:true },
  { id:"1.6",stageId:"stage_1",title:"Multi-AI orchestration",objective:"Run strategic AI → Cursor implementation → report → critique → next-slice loop.",lessonType:"lab",requiresEvidence:true,capstoneCheckpoint:"top_three_problem_statements" },

  { id:"2.1",stageId:"stage_2",title:"Cursor interface",objective:"Use explorer, editor, terminal, AI surfaces, context and diffs.",lessonType:"concept",requiresEvidence:false },
  { id:"2.2",stageId:"stage_2",title:"Open the correct repository",objective:"Confirm lane, root and project before commands or edits.",lessonType:"lab",requiresEvidence:true },
  { id:"2.3",stageId:"stage_2",title:"Let Cursor inspect",objective:"Have Cursor identify stack, routes, data, scripts, deployment and risks.",lessonType:"lab",requiresEvidence:true },
  { id:"2.4",stageId:"stage_2",title:"Small safe edits",objective:"Complete a bounded low-risk repository modification.",lessonType:"production",requiresEvidence:true },
  { id:"2.5",stageId:"stage_2",title:"Diffs are your truth",objective:"Read and explain additions/deletions before acceptance.",lessonType:"lab",requiresEvidence:true },
  { id:"2.6",stageId:"stage_2",title:"Cursor return reports",objective:"Report changes, validation, blockers and next recommendations.",lessonType:"assessment",requiresEvidence:true,capstoneCheckpoint:"provisional_idea_technical_layers" },

  { id:"3.1",stageId:"stage_3",title:"Git mental model",objective:"Understand working tree, stage, commit and remote.",lessonType:"concept",requiresEvidence:true },
  { id:"3.2",stageId:"stage_3",title:"Essential Git commands",objective:"Use status, diff, add, commit, push, pull/fetch and log.",lessonType:"lab",requiresEvidence:true },
  { id:"3.3",stageId:"stage_3",title:"Branches and recovery",objective:"Isolate work and understand safe recovery.",lessonType:"lab",requiresEvidence:true },
  { id:"3.4",stageId:"stage_3",title:"GitHub as institutional memory",objective:"Use commits and repository records as durable project history.",lessonType:"concept",requiresEvidence:true },
  { id:"3.5",stageId:"stage_3",title:"Netlify fundamentals",objective:"Understand repo-connected deploys, builds, previews and production.",lessonType:"lab",requiresEvidence:true },
  { id:"3.6",stageId:"stage_3",title:"Environment variables and secrets",objective:"Separate config/secrets from source code.",lessonType:"assessment",requiresEvidence:true },
  { id:"3.7",stageId:"stage_3",title:"Diagnose a failed deploy",objective:"Read logs, reproduce, fix, validate and redeploy.",lessonType:"lab",requiresEvidence:true,capstoneCheckpoint:"hosting_secrets_data_map" },

  { id:"4.1",stageId:"stage_4",title:"Start with the human problem",objective:"Define the valuable job before features.",lessonType:"concept",requiresEvidence:true },
  { id:"4.2",stageId:"stage_4",title:"User journeys",objective:"Map arrival through successful outcome.",lessonType:"lab",requiresEvidence:true },
  { id:"4.3",stageId:"stage_4",title:"Functional requirements",objective:"Turn wishes into observable behavior.",lessonType:"lab",requiresEvidence:true },
  { id:"4.4",stageId:"stage_4",title:"Non-functional requirements",objective:"Specify security, speed, reliability, accessibility and maintainability.",lessonType:"lab",requiresEvidence:true },
  { id:"4.5",stageId:"stage_4",title:"Data design",objective:"Identify entities, relationships and sources of truth.",lessonType:"lab",requiresEvidence:true },
  { id:"4.6",stageId:"stage_4",title:"Human approval boundaries",objective:"Separate AI suggestions from consequential human decisions.",lessonType:"assessment",requiresEvidence:true },
  { id:"4.7",stageId:"stage_4",title:"V1 versus dream product",objective:"Reduce scope while retaining customer value.",lessonType:"lab",requiresEvidence:true },
  { id:"4.8",stageId:"stage_4",title:"Build, buy or integrate",objective:"Choose reusable infrastructure instead of needless reinvention.",lessonType:"capstone",requiresEvidence:true,capstoneCheckpoint:"problem_user_v1_architecture" },

  { id:"5.1",stageId:"stage_5",title:"What a phase is",objective:"Understand a bounded business/technical outcome with evidence.",lessonType:"concept",requiresEvidence:true },
  { id:"5.2",stageId:"stage_5",title:"Phase Value Score",objective:"Score complexity, business value, risk, scarcity, ownership, urgency and reuse.",lessonType:"assessment",requiresEvidence:true },
  { id:"5.3",stageId:"stage_5",title:"Acceptance criteria",objective:"Define finish before beginning work.",lessonType:"lab",requiresEvidence:true },
  { id:"5.4",stageId:"stage_5",title:"Production packet",objective:"Create a complete Cursor-ready phase instruction.",lessonType:"lab",requiresEvidence:true },
  { id:"5.5",stageId:"stage_5",title:"Real Phase Lab I",objective:"Complete a P0 Foundry production phase.",lessonType:"production",requiresEvidence:true },
  { id:"5.6",stageId:"stage_5",title:"Rework",objective:"Respond to reviewer correction without treating it as new scope.",lessonType:"production",requiresEvidence:true },
  { id:"5.7",stageId:"stage_5",title:"Real Phase Lab II",objective:"Complete a P1/P2 phase as capability allows.",lessonType:"production",requiresEvidence:true },
  { id:"5.8",stageId:"stage_5",title:"Team phase",objective:"Coordinate bounded multi-builder work.",lessonType:"production",requiresEvidence:true },
  { id:"5.9",stageId:"stage_5",title:"Review another builder",objective:"Practice independent acceptance and evidence review.",lessonType:"assessment",requiresEvidence:true,capstoneCheckpoint:"phase_decomposition_foundry_reuse" },

  { id:"6.1",stageId:"stage_6",title:"Master Plan anatomy",objective:"Understand the contract between vision and construction.",lessonType:"concept",requiresEvidence:true },
  { id:"6.2",stageId:"stage_6",title:"Why → How → What",objective:"Connect purpose, operating model and build scope.",lessonType:"capstone",requiresEvidence:true },
  { id:"6.3",stageId:"stage_6",title:"Product architecture",objective:"Design frontend, backend, data, auth, integrations, AI and deployment.",lessonType:"capstone",requiresEvidence:true },
  { id:"6.4",stageId:"stage_6",title:"Build phases",objective:"Sequence dependencies into coherent build increments.",lessonType:"capstone",requiresEvidence:true },
  { id:"6.5",stageId:"stage_6",title:"Acceptance gates",objective:"Make every phase independently provable.",lessonType:"capstone",requiresEvidence:true },
  { id:"6.6",stageId:"stage_6",title:"Build budget",objective:"Estimate labor, infrastructure, tools, review and contingency.",lessonType:"capstone",requiresEvidence:true },
  { id:"6.7",stageId:"stage_6",title:"Commercial model",objective:"Define customer, pricing, competitors, first revenue and conservative cases.",lessonType:"capstone",requiresEvidence:true },
  { id:"6.8",stageId:"stage_6",title:"Risk register",objective:"Identify technical, legal, market, privacy and execution risks.",lessonType:"capstone",requiresEvidence:true },
  { id:"6.9",stageId:"stage_6",title:"Kill criteria",objective:"Define evidence that should stop further investment.",lessonType:"capstone",requiresEvidence:true },
  { id:"6.10",stageId:"stage_6",title:"Master Plan red-team",objective:"Defend the plan against AI, peer and reviewer attacks.",lessonType:"assessment",requiresEvidence:true,capstoneCheckpoint:"complete_master_plan_draft" },

  { id:"7.1",stageId:"stage_7",title:"Capstone application",objective:"Submit product, architecture, market, budget, team and economics package.",lessonType:"capstone",requiresEvidence:true },
  { id:"7.2",stageId:"stage_7",title:"Capstone defense",objective:"Explain and defend the plan without AI speaking for the learner.",lessonType:"assessment",requiresEvidence:true },
  { id:"7.3",stageId:"stage_7",title:"Graduation decision",objective:"Complete production and product-builder graduation gates.",lessonType:"assessment",requiresEvidence:true,capstoneCheckpoint:"final_application_and_defense" }
];

export const academyDoctrine = {
  instructorRequiredForDailyLearning: false,
  humanAcceptanceRequiredForProduction: true,
  capstoneApplicationRequiredForGraduation: true,
  capstonePilotSelectionRequiredForGraduation: false,
  stages: academyStages.length,
  modules: academyModules.length,
  pilotRecoveryPercent: 50,
  companyResidualFloorPercentAfterRecovery: 25,
  capstoneLeadResidualCeilingPercentAfterRecovery: 51,
  payrollEnabled: false,
  equityIssuanceEnabled: false,
  residualSettlementEnabled: false,
  moneyMovementEnabled: false
} as const;
