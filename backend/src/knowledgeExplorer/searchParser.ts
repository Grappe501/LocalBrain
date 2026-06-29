export type ParsedSearchQuery =
  | { type: "file"; term: string }
  | { type: "workspace"; term: string }
  | { type: "archive" }
  | { type: "duplicate" }
  | { type: "stale" }
  | { type: "large" }
  | { type: "health" }
  | { type: "focus" }
  | { type: "recent" }
  | { type: "decision"; term: string }
  | { type: "plain"; term: string };

const ACTION_PREFIXES = [
  "archive",
  "duplicate",
  "stale",
  "large",
  "health",
  "focus",
  "recent",
  "decision",
  "file",
  "workspace",
] as const;

export function parseSearchQuery(raw: string): ParsedSearchQuery {
  const q = raw.trim();
  if (!q) return { type: "plain", term: "" };

  const colonIdx = q.indexOf(":");
  if (colonIdx > 0) {
    const prefix = q.slice(0, colonIdx).toLowerCase();
    const term = q.slice(colonIdx + 1).trim();
    if (ACTION_PREFIXES.includes(prefix as (typeof ACTION_PREFIXES)[number])) {
      if (prefix === "file") return { type: "file", term };
      if (prefix === "workspace") return { type: "workspace", term };
      if (prefix === "decision") return { type: "decision", term };
      if (prefix === "archive") return { type: "archive" };
      if (prefix === "duplicate") return { type: "duplicate" };
      if (prefix === "stale") return { type: "stale" };
      if (prefix === "large") return { type: "large" };
      if (prefix === "health") return { type: "health" };
      if (prefix === "focus") return { type: "focus" };
      if (prefix === "recent") return { type: "recent" };
    }
  }

  return { type: "plain", term: q };
}
