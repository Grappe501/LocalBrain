import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildExecutiveCapabilityAtlas,
  renderCapabilityAtlasMarkdown,
} from "@localbrain/shared";
import { collectCapabilityHealthSignals } from "./capabilityHealthSignals.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..", "..");
const ATLAS_PATH = join(REPO_ROOT, "docs", "LOCALBRAIN_EXECUTIVE_CAPABILITY_ATLAS.md");

export function generateExecutiveCapabilityAtlasFile(): {
  path: string;
  capability_count: number;
  generated_at: string;
} {
  const signals = collectCapabilityHealthSignals();
  const atlas = buildExecutiveCapabilityAtlas(signals);
  const markdown = renderCapabilityAtlasMarkdown(atlas);
  writeFileSync(ATLAS_PATH, markdown, "utf8");
  return {
    path: ATLAS_PATH,
    capability_count: atlas.capability_count,
    generated_at: atlas.generated_at,
  };
}

export function getExecutiveCapabilityAtlas() {
  const signals = collectCapabilityHealthSignals();
  const atlas = buildExecutiveCapabilityAtlas(signals);
  return {
    atlas,
    markdown: renderCapabilityAtlasMarkdown(atlas),
  };
}
