import fs from "node:fs";
import path from "node:path";
import type { SliceStatus } from "@localbrain/shared";
import { getRepoRoot } from "../db/repoRoot.js";

export type ParsedSlice = {
  slice_id: string;
  name: string;
  status: SliceStatus;
  raw_status: string;
  burt_packet_path: string | null;
};

const SLICE_ROW =
  /^\|\s*(LB-OS-[\d.]+)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/;

function parseStatus(raw: string): SliceStatus {
  const s = raw.trim();
  if (/✅|COMPLETE|Complete/i.test(s)) return "complete";
  if (/📋|Spec locked/i.test(s)) return "spec_locked";
  if (/in progress|IN PROGRESS/i.test(s)) return "in_progress";
  if (/⬜|PLANNED/i.test(s)) return "planned";
  return "not_started";
}

function extractBurtLink(cell: string): string | null {
  const m = cell.match(/\[Burt packet\]\(\.\/burt_packets\/([^)]+\.md)\)/i);
  if (m) return `docs/burt_packets/${m[1]}`;
  const m2 = cell.match(/burt_packets\/([^\s)]+\.md)/i);
  if (m2) return `docs/burt_packets/${m2[1]}`;
  return null;
}

export function parsePhaseChecklistSlices(): ParsedSlice[] {
  const checklistPath = path.join(getRepoRoot(), "docs", "PHASE_CHECKLIST.md");
  const text = fs.readFileSync(checklistPath, "utf8");
  const lines = text.split("\n");
  const slices: ParsedSlice[] = [];
  let inPhase1 = false;

  for (const line of lines) {
    if (line.includes("## Phase 1 — V1 OS Shell")) {
      inPhase1 = true;
      continue;
    }
    if (inPhase1 && line.startsWith("## ") && !line.includes("Phase 1")) {
      break;
    }
    if (!inPhase1) continue;

    const m = line.match(SLICE_ROW);
    if (!m) continue;
    const [, slice_id, name, raw_status] = m;
    if (slice_id === "Slice" || slice_id.includes("---")) continue;

    slices.push({
      slice_id,
      name: name.trim(),
      status: parseStatus(raw_status),
      raw_status: raw_status.trim(),
      burt_packet_path: extractBurtLink(raw_status) ?? burtPacketExists(slice_id),
    });
  }

  return slices;
}

function burtPacketExists(sliceId: string): string | null {
  const normalized = sliceId.replace(/\./g, "-");
  const candidates = [
    `docs/burt_packets/${sliceId}.md`,
    `docs/burt_packets/${normalized}.md`,
    `docs/burt_packets/${sliceId.replace(".", "-")}.md`,
  ];
  for (const rel of candidates) {
    if (fs.existsSync(path.join(getRepoRoot(), rel))) return rel;
  }
  const dir = path.join(getRepoRoot(), "docs", "burt_packets");
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir);
  const base = sliceId.toLowerCase();
  const hit = files.find((f) => f.toLowerCase().includes(base.replace(/\./g, "")));
  return hit ? `docs/burt_packets/${hit}` : null;
}

export function parseGateLine(): string | null {
  const text = fs.readFileSync(path.join(getRepoRoot(), "docs", "PHASE_CHECKLIST.md"), "utf8");
  const m = text.match(/\*\*Gate:\*\*\s*(.+)/);
  return m ? m[1].trim() : null;
}

export function changelogDecisions(): { date: string; title: string }[] {
  const text = fs.readFileSync(path.join(getRepoRoot(), "docs", "PHASE_CHECKLIST.md"), "utf8");
  const events: { date: string; title: string }[] = [];
  const section = text.split("## Change Log")[1];
  if (!section) return events;

  for (const line of section.split("\n")) {
    const m = line.match(/\|\s*(\d{4}-\d{2}-\d{2})\s*\|\s*(.+?)\s*\|/);
    if (m) events.push({ date: m[1], title: m[2].trim() });
  }
  return events;
}
