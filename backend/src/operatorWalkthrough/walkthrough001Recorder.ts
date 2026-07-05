import type {
  Walkthrough001EvidencePackage,
  WalkthroughPhaseEvidence,
  WalkthroughPhaseId,
} from "@localbrain/shared";

export class Walkthrough001Recorder {
  private readonly phases: WalkthroughPhaseEvidence[] = [];
  private readonly started_at: string;
  private phaseStart = 0;
  private currentPhase: WalkthroughPhaseId | null = null;

  constructor(
    readonly workspace_id: string,
    readonly scenario: string,
  ) {
    this.started_at = new Date().toISOString();
  }

  beginPhase(phase_id: WalkthroughPhaseId): void {
    this.currentPhase = phase_id;
    this.phaseStart = Date.now();
  }

  endPhase(input: Omit<WalkthroughPhaseEvidence, "phase_id" | "started_at" | "completed_at" | "duration_ms">): void {
    if (!this.currentPhase) throw new Error("No phase in progress");
    const completed_at = new Date().toISOString();
    const duration_ms = Date.now() - this.phaseStart;
    this.phases.push({
      phase_id: this.currentPhase,
      started_at: new Date(this.phaseStart).toISOString(),
      completed_at,
      duration_ms,
      ...input,
    });
    this.currentPhase = null;
  }

  build(technical_acceptance_pass: boolean): Walkthrough001EvidencePackage {
    return {
      walkthrough_id: "OPERATOR-WALKTHROUGH-001",
      title: "Unknown Person → Trusted Relationship",
      workspace_id: this.workspace_id,
      scenario: this.scenario,
      started_at: this.started_at,
      completed_at: new Date().toISOString(),
      phases: this.phases,
      central_question: "Can an organization reliably transform raw information into a trusted relationship?",
      technical_acceptance_pass,
    };
  }
}
