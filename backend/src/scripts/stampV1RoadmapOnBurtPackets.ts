import fs from "node:fs";
import path from "node:path";
import { BURT_PACKET_V1_ROADMAP_BLOCK } from "@localbrain/shared";
import { getRepoRoot } from "../db/repoRoot.js";

const dir = path.join(getRepoRoot(), "docs", "burt_packets");
let stamped = 0;

for (const file of fs.readdirSync(dir)) {
  if (!file.endsWith(".md") || file.startsWith("_")) continue;
  const full = path.join(dir, file);
  const text = fs.readFileSync(full, "utf8");
  if (text.includes("LOCALBRAIN V1 ROADMAP")) continue;
  const lines = text.split("\n");
  const titleIdx = lines.findIndex((l) => l.startsWith("# "));
  const insertAt = titleIdx >= 0 ? titleIdx + 1 : 0;
  lines.splice(insertAt, 0, "", BURT_PACKET_V1_ROADMAP_BLOCK.trim(), "");
  fs.writeFileSync(full, lines.join("\n"));
  stamped += 1;
}

console.log(`Stamped V1 roadmap on ${stamped} Burt packets`);
