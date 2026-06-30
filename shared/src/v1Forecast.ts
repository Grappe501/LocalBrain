/**
 * V1 Adaptive Completion Forecast — evidence-driven launch prediction (ENG-BLD-001-FCST)
 * Estimated = human/expert (burn-down). Predicted = LocalBrain from git + velocity history.
 */

export const V1_FORECAST_ENGINE_ID = "ENG-BLD-001-FCST";

export type V1ForecastModelTier =
  | "engineering_estimate"
  | "historical_average"
  | "predictive_model";

export interface V1ForecastDayComparison {
  label: string;
  estimated_launch_date: string | null;
  predicted_launch_date: string | null;
  confidence_percent: number;
  reasons: string[];
}

export interface V1ModuleVelocityRow {
  module_id: string;
  module_name: string;
  expected_days: number;
  actual_days: number | null;
  velocity_percent: number | null;
  status: "ahead" | "on_track" | "behind" | "tracking";
}

export interface V1CriticalPathVelocity {
  velocity_percent: number;
  critical_path_moved: boolean;
  label: string;
  detail: string;
}

export interface V1ScheduleDriftPoint {
  iso_date: string;
  date_label: string;
  estimated_days: number;
  predicted_days: number;
}

export interface V1EstimatedVsPredicted {
  estimated_launch_date: string | null;
  predicted_launch_date: string | null;
  difference_days: number | null;
  divergence_reason: string | null;
}

export interface V1DepartmentVelocityRow {
  office_id: string;
  office_name: string;
  progress_percent: number;
  status: "complete" | "in_progress" | "not_started" | "reserved";
}

export interface V1AdaptiveForecast {
  engine_id: typeof V1_FORECAST_ENGINE_ID;
  model_tier: V1ForecastModelTier;
  /** Expert burn-down sum (human baseline). */
  estimated_days_to_beta: number | null;
  /** Evidence-adjusted forecast. */
  predicted_days_to_beta: number | null;
  estimated_vs_predicted: V1EstimatedVsPredicted;
  prediction_confidence_percent: number;
  pmo_reasoning: string[];
  yesterday: V1ForecastDayComparison | null;
  today: V1ForecastDayComparison;
  module_velocity: V1ModuleVelocityRow[];
  critical_path_velocity: V1CriticalPathVelocity;
  schedule_drift: V1ScheduleDriftPoint[];
  department_velocity: V1DepartmentVelocityRow[];
  observed_at: string;
}
