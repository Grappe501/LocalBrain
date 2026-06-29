import fs from "node:fs";
import path from "node:path";
import type { EpoCoverageBars, SliceStatus } from "@localbrain/shared";
import { getRepoRoot } from "../db/repoRoot.js";

export function computeCoverage(
  sliceId: string,
  status: SliceStatus,
  burtPacketPath: string | null,
): EpoCoverageBars {
  const root = getRepoRoot();
  const hasBurt = burtPacketPath && fs.existsSync(path.join(root, burtPacketPath));
  const hasTest = fs.existsSync(path.join(root, "backend", "src")) &&
    grepTestMention(sliceId);

  let implementation = 0;
  if (status === "complete") implementation = 100;
  else if (status === "in_progress") implementation = 55;
  else if (status === "spec_locked") implementation = 25;

  let documentation = 0;
  if (hasBurt) documentation = 100;
  else if (status === "spec_locked") documentation = 70;
  else if (status === "complete") documentation = 85;

  let tests = 0;
  if (status === "complete" && hasTest) tests = 90;
  else if (status === "complete") tests = 70;
  else if (hasTest) tests = 40;

  const user_guide = status === "complete" ? 55 : status === "spec_locked" ? 30 : 0;
  const ojt_lesson = sliceId === "LB-OS-026" ? 100 : status === "complete" ? 20 : 0;

  return { implementation, tests, documentation, user_guide, ojt_lesson };
}

function grepTestMention(sliceId: string): boolean {
  const num = sliceId.replace("LB-OS-", "").replace(".", "");
  const src = path.join(getRepoRoot(), "backend", "src");
  try {
    return walkForTest(src, num, 0);
  } catch {
    return false;
  }
}

function walkForTest(dir: string, num: string, depth: number): boolean {
  if (depth > 4) return false;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory() && ent.name !== "node_modules") {
      if (walkForTest(full, num, depth + 1)) return true;
    } else if (ent.name.endsWith(".test.ts") && ent.name.includes(num.replace("-", ""))) {
      return true;
    }
  }
  return false;
}

export function extractBurtMission(burtPath: string | null): {
  mission: string | null;
  objectives: string[];
} {
  if (!burtPath) return { mission: null, objectives: [] };
  const full = path.join(getRepoRoot(), burtPath);
  if (!fs.existsSync(full)) return { mission: null, objectives: [] };

  const text = fs.readFileSync(full, "utf8");
  const missionMatch = text.match(/## Mission\s+([\s\S]*?)(?=\n## |\n---|\Z)/);
  const mission = missionMatch
    ? missionMatch[1].replace(/\*\*/g, "").trim().split("\n")[0]
    : null;

  const objectives: string[] = [];
  const checklist = text.match(/## Build checklist[\s\S]*?```txt([\s\S]*?)```/);
  if (checklist) {
    for (const line of checklist[1].split("\n")) {
      const t = line.replace(/^\[[ x]\]\s*/, "").trim();
      if (t) objectives.push(t);
    }
  }

  return { mission, objectives };
}
