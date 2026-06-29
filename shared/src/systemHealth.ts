/** System Health & Operations contracts — LB-OS-011 */

export interface DiskVolumeHealth {
  mount: string;
  label: string;
  used_percent: number | null;
  free_bytes: number | null;
  total_bytes: number | null;
  available: boolean;
}

export interface MachineHealthPanel {
  cpu_percent: number | null;
  ram_used_percent: number;
  ram_used_bytes: number;
  ram_total_bytes: number;
  uptime_seconds: number;
  platform: string;
  hostname: string;
  disks: DiskVolumeHealth[];
}

export interface StorageHealthPanel {
  volumes: DiskVolumeHealth[];
  registry_asset_count: number;
  index_freshness: "fresh" | "stale" | "unknown" | "indexing";
  latest_index_at: string | null;
}

export type ApiStatus = "online" | "offline" | "not_configured";

export interface AiUsagePanel {
  openai_configured: boolean;
  provider: "openai";
  model: string;
  api_status: ApiStatus;
  tokens_today: number;
  estimated_cost_usd_today: number;
  command_count_today: number;
}

export interface OperationsPanel {
  indexing_active: boolean;
  latest_index_status: string | null;
  pending_approvals: number;
  approved_pending_execution: number;
  failed_actions: number;
  backup_count: number;
}

export type OperationalHealthLabel = "healthy" | "attention" | "critical";

export interface OperationalHealthScore {
  score: number;
  label: OperationalHealthLabel;
  summary: string;
  factors: {
    id: string;
    name: string;
    score: number;
    weight: number;
    detail: string;
  }[];
}

export interface SystemHealthResponse {
  machine: MachineHealthPanel;
  storage: StorageHealthPanel;
  ai: AiUsagePanel;
  operations: OperationsPanel;
  operational_health_score: OperationalHealthScore;
  observed_at: string;
  read_only: true;
}

/** Lightweight snapshot for status dock polling */
export interface SystemUsageSnapshot {
  cpu_percent: number | null;
  ram_percent: number;
  disk_c_percent: number | null;
  disk_h_percent: number | null;
  indexing: boolean;
  pending_approvals: number;
  api_status: ApiStatus;
  tokens_today: number;
  cost_usd_today: number;
  model: string;
  operational_health_score: number;
  attention_needed: boolean;
  observed_at: string;
}
