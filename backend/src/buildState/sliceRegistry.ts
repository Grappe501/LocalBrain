import fs from "node:fs";
import path from "node:path";
import { getRepoRoot } from "../db/repoRoot.js";

const QUEUE_ROW =
  /^\|\s*\*\*?(LB-OS-[\d.]+)\*\*?\s*\|/;

function normalizeDepToken(token: string): string | null {
  const t = token.trim();
  if (!t || t === "—" || t === "-") return null;
  if (t.startsWith("LB-OS-")) return t;
  const m = t.match(/^(\d{3}(?:\.\d+)?)$/);
  if (m) return `LB-OS-${m[1]}`;
  const range = t.match(/^(\d{3}(?:\.\d+)?)[–-](\d{3}(?:\.\d+)?)$/);
  if (range) {
    return `LB-OS-${range[1]}`;
  }
  if (t === "PSP") return null;
  return null;
}

function parseDependsColumn(cell: string): string[] {
  const parts = cell.split(/[,·]/).map((p) => p.trim());
  const ids: string[] = [];
  for (const part of parts) {
    const range = part.match(/^(\d{3}(?:\.\d+)?)[–-](\d{3}(?:\.\d+)?)$/);
    if (range) {
      ids.push(`RANGE:${range[1]}:${range[2]}`);
      continue;
    }
    const id = normalizeDepToken(part);
    if (id) ids.push(id);
  }
  return [...new Set(ids)];
}

/** Authoritative slice order + dependencies from BUILD_SLICE_QUEUE_V2 master table. */
export function parseSliceRegistry(): {
  order: string[];
  dependencies: Record<string, string[]>;
  names: Record<string, string>;
} {
  const queuePath = path.join(getRepoRoot(), "docs", "LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md");
  const text = fs.readFileSync(queuePath, "utf8");
  const lines = text.split("\n");
  const order: string[] = [];
  const dependencies: Record<string, string[]> = {};
  const names: Record<string, string> = {};
  let inTable = false;

  for (const line of lines) {
    if (line.includes("## Queue at a Glance")) {
      inTable = true;
      continue;
    }
    if (inTable && line.startsWith("## ") && !line.includes("Queue")) {
      break;
    }
    if (!inTable) continue;
    if (line.match(/^\|\s*Slice\s*\|/i)) continue;
    if (line.match(/^\|\s*[-:]+\s*\|/)) continue;

    const m = line.match(QUEUE_ROW);
    if (!m) continue;

    const cols = line.split("|").map((c) => c.trim()).filter((c) => c.length > 0);
    if (cols.length < 3) continue;

    const slice_id = cols[0].replace(/\*\*/g, "");
    const name = cols[1].replace(/\*\*/g, "");
    const dependsCol = cols[2];

    order.push(slice_id);
    names[slice_id] = name;
    dependencies[slice_id] = parseDependsColumn(dependsCol);
  }

  for (const slice_id of order) {
    dependencies[slice_id] = expandDeps(dependencies[slice_id] ?? [], order);
  }

  return { order, dependencies, names };
}

function expandDeps(deps: string[], order: string[]): string[] {
  const out: string[] = [];
  for (const d of deps) {
    if (d.startsWith("RANGE:")) {
      const [, a, b] = d.split(":");
      const start = `LB-OS-${a}`;
      const end = `LB-OS-${b}`;
      const si = order.indexOf(start);
      const ei = order.indexOf(end);
      if (si >= 0 && ei >= 0) out.push(...order.slice(si, ei + 1));
      else out.push(start);
      continue;
    }
    const range = d.match(/^LB-OS-(\d+(?:\.\d+)?)[–-]LB-OS-(\d+(?:\.\d+)?)$/);
    if (range) {
      const start = `LB-OS-${range[1]}`;
      const end = `LB-OS-${range[2]}`;
      const si = order.indexOf(start);
      const ei = order.indexOf(end);
      if (si >= 0 && ei >= 0) out.push(...order.slice(si, ei + 1));
      else out.push(start);
      continue;
    }
    out.push(d);
  }
  return [...new Set(out)];
}
