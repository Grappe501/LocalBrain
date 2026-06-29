export { APP_VERSION, type HealthResponse } from "./types.js";
export type {
  CommandActionClass,
  CommandIntent,
  CommandResponse,
  CommandStatusResponse,
} from "./command.js";
export type {
  AiUsagePanel,
  ApiStatus,
  DiskVolumeHealth,
  MachineHealthPanel,
  OperationalHealthLabel,
  OperationalHealthScore,
  OperationsPanel,
  StorageHealthPanel,
  SystemHealthResponse,
  SystemUsageSnapshot,
} from "./systemHealth.js";
export type {
  BuildGraphNodeStatus,
  EpoBuildGraphNode,
  EpoBuildVelocity,
  EpoCoverageBars,
  EpoCurrentSprint,
  EpoDecisionEvent,
  EpoDocEntry,
  EpoLiveMetrics,
  EpoOverview,
  EpoPhaseSummary,
  EpoSliceDetail,
  EpoSliceSummary,
  SliceStatus,
} from "./epo.js";
export type {
  CosCapability,
  CosOrchestration,
  CosOutcome,
  CosOutcomeType,
  CosRecommendation,
  CosRecommendationCategory,
  SystemConfidence,
} from "./cosOrchestration.js";
export type {
  FileReadResult,
  FileSummarizeMode,
  FileSummarizeResult,
  FolderManifestEntry,
  FolderManifestResult,
} from "./fileTools.js";
export type {
  ActionLogEntry,
  ActionLogEventType,
  BackupRecord,
  ExecuteResult,
  ProposedAction,
  ProposedActionStatus,
  ProposedActionType,
} from "./proposedActions.js";
export type {
  LivingWorkspace,
  WorkspaceEvent,
  WorkspaceEventType,
  WorkspaceFlags,
  WorkspaceLink,
  WorkspaceProfile,
  WorkspaceType,
} from "./workspace.js";
export type {
  Agent,
  Capability,
  Decision,
  DecisionStatus,
  Engine,
  EngineStatus,
  KnowledgeSource,
  KnowledgeSourceKind,
  KnowledgeSourceStatus,
  MemoryDomain,
  MemoryRecord,
  Module,
} from "./foundation.js";
export type {
  AssetCollection,
  AssetHealthSignals,
  AssetLifecycleStage,
  DigitalAsset,
  DigitalAssetFingerprint,
  DigitalAssetKind,
} from "./digitalAsset.js";
export type {
  EngGraphEdge,
  EngGraphNode,
  EngGraphNodeKind,
  BurtPacketPreview,
  BurtPacketSummary,
  EngineeringExplainResponse,
  EngineeringImpactResult,
  EngineeringKnowledgeGraph,
  EngineeringLearnStub,
  EngineeringOverview,
  EngineeringProjectSummary,
  EngineeringRecommendation,
  EngineeringScore,
  EngineeringScoreFactor,
} from "./engineering.js";
export type {
  NarrativeCatalogEntry,
  WritingDraftPreview,
  WritingMode,
  WritingModeId,
  WritingOverview,
  WritingProjectSummary,
  WritingRecommendation,
  WritingScore,
  WritingScoreFactor,
  WritingSourceFile,
  WritingVoice,
  WritingVoiceId,
} from "./writing.js";
export type {
  DataHealthScore,
  DataHealthScoreFactor,
  DataInsight,
  DataIntelligenceOverview,
  DataLearnStub,
  DataLineageResult,
  DataLineageStep,
  DataRecommendation,
  DataRelationshipEdge,
  DataRelationshipGraph,
  DataRelationshipNode,
  KnowledgeSourcePanel,
  QueryPlanPreview,
} from "./dataIntelligence.js";
export type {
  EngagementRecommendation,
  NetworkGraph,
  NetworkGraphEdge,
  NetworkGraphNode,
  OrganizationProfile,
  RelationshipChiefRecommendation,
  RelationshipHealthScore,
  RelationshipLearnStub,
  RelationshipNetworkOverview,
  RelationshipProfile,
  RelationshipTimelineEvent,
} from "./relationshipNetwork.js";
export type {
  ExperienceMaturityLevel,
  ExperienceMaturityRow,
} from "./experienceMaturity.js";
export {
  EXPERIENCE_MATURITY_LABELS,
  maturityCode,
  maturityLabel,
} from "./experienceMaturity.js";
export type {
  LiveSurfaceAudit,
  LiveSurfaceEntry,
  LiveSurfaceMode,
  LiveSurfaceSmokeReport,
  LiveSurfaceSmokeResult,
  LiveSurfaceStubSection,
  WorkspaceLinkRow,
  WorkspaceLiveEnvelope,
} from "./liveSurface.js";
export type {
  AICapability,
  AICredentialStatus,
  AIFlightRecordPublic,
  AIProviderHealthStatus,
  AIProviderId,
  AIProviderPublic,
  AIProvidersDockSummary,
  AIProvidersOverview,
  AIProviderVerifyResult,
  SaveAIProviderCredentialRequest,
  UpdateAIProviderRequest,
  WorkspaceProviderOverride,
} from "./aiProviders.js";
export type {
  ArchiveStrategyDraft,
  DataClassification,
  DriveDoctrinePanel,
  DriveLetter,
  DrivePlacementAudit,
  DriveVolumeSummary,
  HStructureProposal,
  MigrationApprovalItem,
  MigrationPhasePreview,
  MigrationPlannerOverview,
  MigrationRiskLevel,
  PlacementAuditRow,
} from "./migrationPlanner.js";
export type {
  CMisplacedWorkCandidate,
  DuplicateWorkspaceCandidate,
  FilesystemMappingAudit,
  FolderInventoryStat,
  HFolderMapNode,
  MappingConfidenceLabel,
  StaleFolderCandidate,
  TopLevelDirectoryEntry,
  UnclaimedFolderCandidate,
  WorkspaceRootCoverage,
} from "./filesystemAudit.js";
export type {
  ExecutiveWorkspaceArchitectureReport,
  LogicalProjectionType,
  OrganizationNodeKind,
  OrganizationTreeNode,
  PhysicalVolumeSurvey,
  PhysicalWorldBindingIssue,
  PhysicalWorldBindingIssueKind,
  PhysicalWorldSurvey,
  Projection,
  ProjectionKind,
  ProjectionStatus,
  StorageProviderHealth,
  StorageProviderRole,
  StorageProviderStub,
  StorageProviderType,
  WorkspaceBlueprint,
  WorkspaceBlueprintMigrationImpact,
  WorkspaceDNA,
} from "./workspaceArchitecture.js";
export type {
  DigitalLandSurveyReport,
  LandSurveyActivitySignals,
  LandSurveyArchiveCandidate,
  LandSurveyConfidenceLabel,
  LandSurveyDriveUtilization,
  LandSurveyDuplicateRegion,
  LandSurveyEmptyFolderChain,
  LandSurveyFolderOwnership,
  LandSurveyMigrationComplexity,
  LandSurveyOrphanedData,
  LandSurveyOversizedMedia,
  LandSurveyProjectionCoverage,
  LandSurveyStorageTopology,
  LandSurveyWorkspaceCoverage,
} from "./digitalLandSurvey.js";
export type {
  LocationRole,
  ProjectionLocationRef,
} from "./projectionLocation.js";
export {
  DEFAULT_PRIMARY_LOCATION,
  PRIMARY_LOCATION_ID,
  PRIMARY_LOCATION_LABEL,
  STANDARD_WORKSPACE_LOCATION_ROLES,
} from "./projectionLocation.js";
export type {
  EvidenceProvenance,
  MigrationProofOverview,
  MigrationProofSimulateRequest,
  MigrationProofSimulateResponse,
  MigrationSimulation,
  MigrationSimulationActionType,
  MigrationSimulationBatch,
  ProofCertificate,
  ProofCertificateResult,
  ProofCheck,
  ProofCheckStatus,
  ProofContext,
  ProofDimensionId,
  ProofDimensionResult,
  ProofProvider,
  ProofScore,
  RecommendationConfidence,
} from "./proofAndCertification.js";
export {
  PROOF_CERTIFICATION_THRESHOLDS,
  PROOF_CORE_RULE,
  PROOF_DIMENSION_LABELS,
} from "./proofAndCertification.js";
export type {
  ArchitectureDebtBand,
  PlatformStabilityReport,
} from "./platformStability.js";
export type {
  MigrationPlan,
  MigrationPlanDependencyNode,
  MigrationPlanDiff,
  MigrationPlanGenerateRequest,
  MigrationPlanGenerateResponse,
  MigrationPlanOperation,
  MigrationPlanOverview,
  MigrationPlanRollbackStep,
  MigrationPlanStatus,
  MigrationOperationKind,
} from "./migrationPlan.js";
export { MIGRATION_PLAN_CORE_RULE } from "./migrationPlan.js";
export type {
  MigrationApprovalCreateRequest,
  MigrationApprovalCreateResponse,
  MigrationApprovalOverview,
  MigrationApprovalPackage,
  MigrationApprovalPlanSummary,
  MigrationApprovalProvenance,
  MigrationApprovalRejectRequest,
  MigrationApprovalSignRequest,
  MigrationApprovalStatus,
  RiskAcknowledgement,
  RollbackAcknowledgement,
  SignOffChecklistItem,
} from "./migrationApproval.js";
export {
  MIGRATION_APPROVAL_CORE_RULE,
  MIGRATION_APPROVAL_ENGINE_ID,
} from "./migrationApproval.js";
export type {
  PlanConstraint,
  PlanConstraintStatus,
  PlanObjective,
  PlanQualityScore,
  PlanRiskLabel,
  PlanVariantStrategy,
  PlannerGenerateRequest,
  PlannerGenerateResponse,
  ProvenanceChain,
} from "./planningEngine.js";
export {
  DEFAULT_MIGRATION_CONSTRAINTS,
  MIGRATION_PLANNER_ID,
  PLANNING_ENGINE_ID,
  PLAN_VARIANT_LABELS,
} from "./planningEngine.js";
export type {
  AssetIntelligenceForPath,
  AssetIntelligenceSummary,
  CleanupRecommendation,
  DuplicateCandidateGroup,
  RecommendationRisk,
  WorkspaceStorageSummary,
} from "./assetIntelligence.js";
export type {
  ConsolidationCategory,
  ConsolidationCategoryResponse,
  ConsolidationOpportunitySummary,
  ConsolidationRiskAssessment,
  ConsolidationScore,
  ConsolidationScoreBand,
  ConsolidationScoreComponents,
  ConsolidationSimulateRequest,
  ConsolidationSimulationResult,
  ExecutiveConsolidationBriefing,
  OverallOpportunity,
  WorkspaceSimplificationLevel,
} from "./consolidation.js";
export type {
  EvidenceSignalPublic,
  ExecutiveIntelligenceCard,
  IntelligenceCardCategory,
  IntelligenceCardPriority,
  IntelligencePipelineStage,
  IntelligencePipelineState,
  IntelligenceScores,
  PipelineStageStatus,
} from "./executiveIntelligenceCard.js";
export type {
  CrossRouteLink,
  ExecutiveQuestion,
  IntegrationAuditMetrics,
  IntegrationAuditReport,
  IntegrationAuditTargets,
} from "./executiveQuestion.js";
export {
  INTEGRATION_TARGETS,
  PHASE_1_EXECUTIVE_QUESTIONS,
  QUESTION_RELATED_IDS,
  buildCrossRouteLinks,
  getRelatedLinksForRoute,
  matchQuestionForRoute,
} from "./executiveQuestion.js";
export type {
  ModuleCapabilityDeclaration,
  ModuleManifest,
  ModuleNavPlacement,
  ModuleRouteDeclaration,
  ModuleStatus,
} from "./moduleManifest.js";
export {
  validateModuleManifest,
  validateModuleRegistry,
} from "./moduleManifest.js";
export type { V1AcceptanceReport, V1Guardrail, V1SpineCheck } from "./v1Spine.js";