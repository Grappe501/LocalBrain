export type FoundryProduct = {
  id: string;
  name: string;
  kind: "software" | "book" | "platform" | "component";
  readiness: number | null;
  disposition: string;
  annualLow: number | null;
  annualHigh: number | null;
  trainingFit: "high" | "medium" | "low";
};

export const foundryProducts: FoundryProduct[] = [
  { id: "souschef", name: "SousChef / HomeChef AI", kind: "software", readiness: 90, disposition: "ACCELERATE · TRAINING PRODUCT", annualLow: 150000, annualHigh: 600000, trainingFit: "high" },
  { id: "campaignos", name: "CampaignOS", kind: "software", readiness: 80, disposition: "ACCELERATE · CLEAN EXTRACTION", annualLow: 240000, annualHigh: 1200000, trainingFit: "high" },
  { id: "localbrain", name: "LocalBrain", kind: "platform", readiness: 85, disposition: "ACCELERATE · NARROW ICP", annualLow: 180000, annualHigh: 900000, trainingFit: "medium" },
  { id: "votematch", name: "VoteMatch", kind: "software", readiness: 76, disposition: "ACCELERATE AFTER AUTH HARDENING", annualLow: 120000, annualHigh: 600000, trainingFit: "high" },
  { id: "bidassembly", name: "Bid Assembly", kind: "software", readiness: null, disposition: "ACCELERATE AUDIT · B2B", annualLow: 120000, annualHigh: 720000, trainingFit: "high" },
  { id: "canonforge", name: "CanonForge Knowledge OS", kind: "platform", readiness: 70, disposition: "MARKET VALIDATE + EXTRACT", annualLow: 120000, annualHigh: 600000, trainingFit: "medium" },
  { id: "peoplebase", name: "PeopleBase / ContactList", kind: "software", readiness: 70, disposition: "INCUBATE · SHARED DATA LAYER", annualLow: 120000, annualHigh: 600000, trainingFit: "high" },
  { id: "eventops", name: "Event Operations", kind: "software", readiness: 58, disposition: "INCUBATE", annualLow: 90000, annualHigh: 450000, trainingFit: "high" },
  { id: "fieldspark", name: "FieldSpark / Field Command", kind: "software", readiness: 50, disposition: "INCUBATE · CAMPAIGNOS MODULE FIRST", annualLow: 120000, annualHigh: 600000, trainingFit: "high" },
  { id: "foundryos", name: "FoundryOS", kind: "platform", readiness: 63, disposition: "INTERNAL FIRST", annualLow: null, annualHigh: null, trainingFit: "medium" },
  { id: "bookfoundry", name: "Writers Dashboard / Book Foundry", kind: "platform", readiness: null, disposition: "INCUBATE", annualLow: 60000, annualHigh: 300000, trainingFit: "high" },
  { id: "constitutional-capitalism", name: "Constitutional Capitalism", kind: "book", readiness: 45, disposition: "BOOK PRODUCT", annualLow: 10000, annualHigh: 75000, trainingFit: "high" },
  { id: "mercy-protocol", name: "The Mercy Protocol", kind: "book", readiness: 85, disposition: "BOOK PRODUCT · PUBLICATION PATH", annualLow: 5000, annualHigh: 50000, trainingFit: "high" },
  { id: "campti", name: "Campti / Grappe Historical Novel", kind: "book", readiness: null, disposition: "BOOK PRODUCT · AUDIT", annualLow: 5000, annualHigh: 40000, trainingFit: "high" },
  { id: "ark-political-history", name: "Arkansas Political History", kind: "book", readiness: null, disposition: "BOOK PRODUCT · AUDIT", annualLow: 5000, annualHigh: 30000, trainingFit: "high" },
  { id: "ark-galaxy", name: "Arkansas Galaxy", kind: "book", readiness: null, disposition: "BOOK PRODUCT · IP CLEARANCE", annualLow: null, annualHigh: null, trainingFit: "medium" },
  { id: "elvestribal", name: "Elvestribal", kind: "book", readiness: null, disposition: "BOOK PRODUCT · CONTENT AUDIT", annualLow: null, annualHigh: null, trainingFit: "medium" },
];

export const sousChefTrainingBudget = {
  completionRemaining: 10,
  totalBudget: 12000,
  apprenticeLabor: 7200,
  leadReview: 2400,
  toolingTesting: 1200,
  contingency: 1200,
  apprenticeCount: 3,
  apprenticeHoursEach: 120,
  apprenticeRate: 20,
};

export const sousChefPhases = [
  "Production/security audit",
  "Billing and entitlement",
  "Onboarding conversion path",
  "AI cost telemetry",
  "Mobile UX hardening",
  "Privacy and data controls",
  "Beta feedback system",
  "Paid beta instrumentation",
  "Stabilization and defects",
  "V1 launch acceptance",
];

export const builderLevels = [
  "L0 · Apprentice",
  "L1 · Guided Builder",
  "L2 · Independent Builder",
  "L3 · Venture Builder",
  "L4 · Product Lead",
  "L5 · Foundry Architect / Executive Technical Leader",
];

export const foundryDoctrine = [
  "Parent ownership, production pay, product residuals, and capital contributions are separate ledgers.",
  "Capstone residual participation never conveys product or parent-company ownership.",
  "The Company retains at least 25% of Capstone Distributable Product Residual.",
  "A Capstone lead may receive no more than 51% of Distributable Product Residual.",
  "The Capstone formula applies only to an accepted Master Build Plan approved as a Capstone.",
  "Builders are paid for accepted value, not lines of code.",
  "Books are Product Projects and can use the same phase, team, acceptance, and residual architecture.",
];
