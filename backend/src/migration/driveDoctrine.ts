import path from "node:path";
import type { DataClassification, DriveLetter, MigrationRiskLevel } from "@localbrain/shared";

export const DRIVE_DOCTRINE = {
  c_drive_role: "Operating system & installed programs only",
  h_drive_role: "Steve's work world — projects, repos, documents, archives, media",
  rules: [
    "C:/ = programs only — not project workspace roots",
    "H:/ = default for project folders and LocalBrain allowed roots",
    "No file moves, deletes, or cleanup in LB-OS-018",
    "Inventory → Map → Diagnosis → Recommendations → Approval → later action",
  ],
  localbrain_default: "H:\\localAgent",
  migration_sequence: [
    "inventory",
    "map",
    "diagnosis",
    "recommendations",
    "approval_checklist",
    "later_action",
  ],
} as const;

export function getDriveLetter(resolvedPath: string): DriveLetter {
  const normalized = path.normalize(resolvedPath);
  const match = /^([A-Za-z]):[\\/]/.exec(normalized);
  if (!match) return "OTHER";
  const letter = match[1].toUpperCase();
  if (letter === "C") return "C";
  if (letter === "H") return "H";
  return "OTHER";
}

const PROGRAM_PATH_MARKERS = [
  "\\Program Files\\",
  "\\Program Files (x86)\\",
  "\\Windows\\",
  "\\ProgramData\\",
  "$Recycle.Bin",
];

const CODE_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".py",
  ".go",
  ".rs",
  ".java",
  ".cs",
  ".json",
  ".md",
]);

const DOC_EXTENSIONS = new Set([".doc", ".docx", ".pdf", ".txt", ".rtf", ".xlsx", ".pptx"]);
const MEDIA_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".mp4",
  ".mov",
  ".wav",
  ".mp3",
]);

export function classifyDataAsset(options: {
  path: string;
  kind?: string;
  is_directory?: boolean;
}): DataClassification {
  const p = options.path.replace(/\//g, "\\");
  const lower = p.toLowerCase();
  const ext = path.extname(p).toLowerCase();

  if (PROGRAM_PATH_MARKERS.some((m) => lower.includes(m.toLowerCase()))) {
    return "program";
  }

  if (options.is_directory) {
    if (
      lower.includes("\\projects\\") ||
      lower.includes("\\repos\\") ||
      lower.includes("\\localagent") ||
      options.kind === "codebase"
    ) {
      return "work_project";
    }
    if (lower.includes("\\archive") || lower.includes("\\backup")) {
      return "work_archive";
    }
    return "work_project";
  }

  if (options.kind === "code" || CODE_EXTENSIONS.has(ext)) return "work_code";
  if (options.kind === "document" || DOC_EXTENSIONS.has(ext)) return "work_document";
  if (options.kind === "media" || MEDIA_EXTENSIONS.has(ext)) return "work_media";
  if (ext === ".zip" || ext === ".7z" || lower.includes("\\archive\\")) return "work_archive";

  return "unknown";
}

export function expectedDriveForClass(classification: DataClassification): DriveLetter {
  if (classification === "program") return "C";
  if (classification === "unknown") return "H";
  return "H";
}

export function assessMisplacement(options: {
  path: string;
  classification: DataClassification;
  drive: DriveLetter;
}): { misplaced: boolean; risk: MigrationRiskLevel; reason: string } {
  const expected = expectedDriveForClass(options.classification);
  const { drive, classification } = options;

  if (drive === "C" && classification !== "program" && classification !== "unknown") {
    return {
      misplaced: true,
      risk: classification === "work_code" ? "high" : "medium",
      reason: `Work ${classification.replace("work_", "")} indexed on C: — doctrine places work data on H:`,
    };
  }

  if (drive === "C" && classification === "unknown" && !options.path.toLowerCase().includes("\\users\\")) {
    return {
      misplaced: true,
      risk: "low",
      reason: "Unclassified asset on C: outside typical user profile paths",
    };
  }

  if (drive === "H" && classification === "program") {
    return {
      misplaced: true,
      risk: "medium",
      reason: "Program-system path pattern detected on H: work drive",
    };
  }

  if (drive === "OTHER") {
    return {
      misplaced: true,
      risk: "low",
      reason: "Path not on C: or H: — review for migration mapping",
    };
  }

  if (drive !== expected && classification !== "unknown") {
    return {
      misplaced: true,
      risk: "low",
      reason: `Expected ${expected}: drive for ${classification}`,
    };
  }

  return { misplaced: false, risk: "low", reason: "Placement aligns with drive doctrine" };
}

export function isCDriveProjectRoot(resolvedPath: string): boolean {
  return getDriveLetter(resolvedPath) === "C";
}

export function cDriveOverrideAllowed(): boolean {
  return process.env.LOCALBRAIN_ALLOW_C_PROJECT_ROOT === "1";
}
