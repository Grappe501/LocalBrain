import type { ProofContext } from "@localbrain/shared";
import { buildDimensionResult, check } from "../proofUtils.js";

const MAX = 20;

export const performanceProofProvider = {
  id: "performance" as const,
  label: "Performance Benefit",
  max_points: MAX,
  evaluate(ctx: ProofContext) {
    const totalFiles = ctx.simulation_batches.reduce((s, b) => s + b.file_count, 0);
    const totalFolders = ctx.simulation_batches.reduce((s, b) => s + b.folder_count, 0);
    const headroomOk = ctx.drive_headroom_label !== "critical";
    const complexityOk = (ctx.migration_complexity_overall ?? 100) < 85;

    const checks = [
      check(
        "perf-batch-files",
        "Batch file count within bounds",
        totalFiles <= 50_000,
        totalFiles <= 50_000 ? `${totalFiles} files in scope` : `${totalFiles} files exceeds 50k batch guidance`,
        totalFiles,
        totalFiles > 50_000,
      ),
      check(
        "perf-batch-folders",
        "Batch folder count within bounds",
        totalFolders <= 5_000,
        `${totalFolders} folders in scope`,
        totalFolders,
        totalFolders > 5_000,
      ),
      check(
        "perf-drive-headroom",
        "Primary drive headroom",
        headroomOk,
        headroomOk ? `Headroom: ${ctx.drive_headroom_label ?? "unknown"}` : "H: drive headroom critical — defer migration",
        ctx.drive_headroom_label,
        !headroomOk,
      ),
      check(
        "perf-complexity",
        "Migration complexity acceptable",
        complexityOk,
        complexityOk
          ? `Complexity score ${ctx.migration_complexity_overall ?? "—"}`
          : "Migration complexity too high for single batch",
        ctx.migration_complexity_overall,
        !complexityOk,
      ),
    ];
    return buildDimensionResult("performance", this.label, MAX, checks);
  },
};
