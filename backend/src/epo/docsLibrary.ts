import fs from "node:fs";
import path from "node:path";
import type { EpoDocEntry } from "@localbrain/shared";
import { getRepoRoot } from "../db/repoRoot.js";

const DOC_CATEGORIES: { prefix: string; category: string }[] = [
  { prefix: "LOCALBRAIN_OPERATING", category: "Doctrine" },
  { prefix: "LOCALBRAIN_FOUNDATIONAL", category: "Doctrine" },
  { prefix: "LOCALBRAIN_PRODUCT", category: "Doctrine" },
  { prefix: "LOCALBRAIN_MASTER", category: "Architecture" },
  { prefix: "LOCALBRAIN_MODULAR", category: "Architecture" },
  { prefix: "LOCALBRAIN_ENGINE", category: "Architecture" },
  { prefix: "LOCALBRAIN_BUILD", category: "Build Plans" },
  { prefix: "burt_packets", category: "Burt Packets" },
  { prefix: "LOCALBRAIN_DECISION", category: "Decision Ledger" },
  { prefix: "LOCALBRAIN_ENGINEERING", category: "Engineering" },
  { prefix: "LOCALBRAIN_CODE", category: "Engineering" },
  { prefix: "LOCALBRAIN_DIGITAL", category: "Architecture" },
  { prefix: "LOCALBRAIN_KNOWLEDGE", category: "Architecture" },
  { prefix: "LOCALBRAIN_EXECUTIVE_PROGRAM", category: "Build Plans" },
  { prefix: "LOCALBRAIN_MULTI_MACHINE", category: "Future Plans" },
  { prefix: "LOCALBRAIN_GOOGLE", category: "Future Plans" },
  { prefix: "LOCALBRAIN_TEAM", category: "Future Plans" },
  { prefix: "LOCALBRAIN_NETWORK", category: "Future Plans" },
  { prefix: "PHASE_CHECKLIST", category: "Build Plans" },
  { prefix: "LOCALBRAIN_WRITING", category: "Departments" },
  { prefix: "LOCALBRAIN_DATABASE", category: "Database" },
  { prefix: "LOCALBRAIN_RESEARCH", category: "Research" },
];

function categorize(relPath: string): string {
  const base = path.basename(relPath);
  for (const rule of DOC_CATEGORIES) {
    if (relPath.includes(rule.prefix) || base.includes(rule.prefix)) {
      return rule.category;
    }
  }
  if (relPath.includes("workspace")) return "Workspaces";
  if (relPath.includes("DEPARTMENT")) return "Departments";
  return "Architecture";
}

function quickSummary(text: string): string {
  const lines = text.split("\n").filter((l) => l.trim() && !l.startsWith("#") && !l.startsWith(">"));
  const first = lines[0]?.replace(/\*\*/g, "").trim() ?? "";
  return first.length > 160 ? `${first.slice(0, 157)}…` : first;
}

function docStatus(text: string): string {
  if (/✅|Binding|COMPLETE/i.test(text.slice(0, 500))) return "binding";
  if (/📋|Spec locked|PLANNED/i.test(text.slice(0, 500))) return "spec";
  if (/superseded/i.test(text.slice(0, 300))) return "superseded";
  return "active";
}

function extractVersion(text: string): string | null {
  const m = text.match(/v(\d+\.\d+(?:\.\d+)?)/i);
  return m ? m[0] : null;
}

export function listDocumentationLibrary(query?: string): EpoDocEntry[] {
  const docsRoot = path.join(getRepoRoot(), "docs");
  const entries: EpoDocEntry[] = [];

  function walk(dir: string, relBase: string) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const rel = path.join(relBase, ent.name).replace(/\\/g, "/");
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        walk(full, rel);
      } else if (ent.name.endsWith(".md")) {
        const stat = fs.statSync(full);
        const text = fs.readFileSync(full, "utf8");
        const title =
          text.match(/^#\s+(.+)/m)?.[1]?.replace(/\*\*/g, "").trim() ?? ent.name;
        entries.push({
          path: `docs/${rel}`,
          title,
          category: categorize(rel),
          version: extractVersion(text),
          last_updated: stat.mtime.toISOString().slice(0, 10),
          status: docStatus(text),
          quick_summary: quickSummary(text),
        });
      }
    }
  }

  walk(docsRoot, "");

  let result = entries.sort((a, b) => b.last_updated.localeCompare(a.last_updated));
  if (query?.trim()) {
    const q = query.toLowerCase();
    result = result.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.path.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.quick_summary.toLowerCase().includes(q),
    );
  }
  return result;
}
