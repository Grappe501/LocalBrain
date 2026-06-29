import { getRegisteredModules } from "../core/moduleLoader.js";
import { briefingAsContextText } from "../context/executiveBriefing.js";
import { decisionsAsContextText } from "../context/bindingDecisions.js";
import { getCleanupRecommendations, getIntelligenceSummary } from "../digitalAssets/intelligenceEngine.js";
import { listWorkspaces } from "../workspaces/workspaceRegistry.js";
import type { CommandActionClass } from "@localbrain/shared";

export type BuiltContext = {
  systemPrompt: string;
  contextUsed: string[];
  workspaceId: string;
};

function formatWorkspaceBlock(ws: ReturnType<typeof listWorkspaces>[0]): string {
  return [
    `Workspace: ${ws.title} (${ws.workspace_id})`,
    `Type: ${ws.workspace_type} · Priority: ${ws.priority} · Health: ${ws.health_score ?? "—"}`,
    `Executive context: ${ws.executive_context}`,
    `Current focus: ${ws.current_focus || "—"}`,
    `Success definition: ${ws.success_definition || "—"}`,
    `Recommended next action: ${ws.profile.recommended_next_action || "—"}`,
    `Flags: pinned=${ws.flags.pinned} archived=${ws.flags.archived} needs_attention=${ws.flags.needs_attention}`,
  ].join("\n");
}

export function buildCommandContext(options: {
  actionClass: CommandActionClass;
  workspaceId?: string;
  assetPath?: string;
}): BuiltContext {
  const contextUsed: string[] = [];
  const workspaces = listWorkspaces().filter((w) => !w.flags.hidden);
  const activeId = options.workspaceId ?? "localbrain";
  const active =
    workspaces.find((w) => w.workspace_id === activeId) ?? workspaces[0] ?? null;

  const sections: string[] = [
    "You are the Chief of Staff for LocalBrain — Steve's AI Executive Operating System.",
    "Answer using ONLY the context below. Do not invent filesystem paths or claim you read files.",
    "LB-OS-008 guardrails: no file writes, moves, deletes, cleanup execution, or tools.",
    "Recommendations about storage/cleanup are suggest-only until approval gates ship.",
  ];

  if (active) {
    contextUsed.push("living_workspace");
    sections.push("\n## Active workspace\n" + formatWorkspaceBlock(active));
  }

  contextUsed.push("workspace_registry");
  sections.push(
    "\n## All workspaces\n" +
      workspaces.map((w) => `- ${w.title} (${w.workspace_id}): focus="${w.current_focus}" health=${w.health_score ?? "—"}`).join("\n"),
  );

  const intel = getIntelligenceSummary();
  contextUsed.push("asset_intelligence");
  sections.push(
    "\n## Digital Asset Intelligence summary",
    `Total assets: ${intel.total_assets}`,
    `Dormant: ${intel.dormant.count} assets · ${formatBytes(intel.dormant.bytes)}`,
    `Archive candidates: ${intel.archive_candidates.count} · ${formatBytes(intel.archive_candidates.bytes)}`,
    `Duplicate groups: ${intel.duplicate_groups}`,
    `Large files (10MB+): ${intel.large_assets.count} · ${formatBytes(intel.large_assets.bytes)}`,
  );

  if (intel.collections.length > 0) {
    sections.push(
      "Collections: " +
        intel.collections.map((c) => `${c.title} (${c.asset_count ?? 0})`).join(", "),
    );
  }

  const recs = getCleanupRecommendations().slice(0, 6);
  if (recs.length > 0) {
    contextUsed.push("cleanup_recommendations");
    sections.push(
      "\n## Cleanup recommendations (recommend-only)\n" +
        recs.map((r) => `- [${r.risk}] ${r.title}: ${r.message}`).join("\n"),
    );
  }

  const modules = getRegisteredModules();
  if (modules.length > 0) {
    contextUsed.push("module_registry");
    sections.push(
      "\n## Registered modules\n" +
        modules.map((m) => `- ${m.name} (${m.module_id}) · ${m.status}`).join("\n"),
    );
  }

  contextUsed.push("binding_decisions");
  sections.push("\n## Binding decisions\n" + decisionsAsContextText());

  if (
    options.actionClass === "briefing_summary" ||
    options.actionClass === "focus_priority"
  ) {
    contextUsed.push("executive_briefing");
    sections.push("\n## Executive Briefing (mock metadata)\n" + briefingAsContextText());
  }

  if (options.actionClass === "asset_stale" && options.assetPath) {
    contextUsed.push("asset_path_hint");
    sections.push(`\nUser referenced asset path: ${options.assetPath}`);
  }

  const taskHints: Record<CommandActionClass, string> = {
    focus_priority:
      "User wants focus / priority guidance. Lead with active workspace current_focus and top recommendations.",
    workspace_explain:
      "User wants workspace explanation. Summarize executive_context, focus, success_definition, and health.",
    asset_stale:
      "User asks about stale/dormant/duplicate assets. Use intelligence summary and recommend-only cleanup cards.",
    briefing_summary:
      "User wants Executive Briefing summary. Synthesize briefing sections; note mock data where applicable.",
    file_read:
      "User wants file content — handled by read_file tool; do not invent content.",
    file_summarize:
      "User wants file or folder summary — handled by summarize tools; manifest-only for folders.",
    general_query:
      "Answer helpfully using workspace and asset intelligence context. Stay within registry metadata.",
  };

  sections.push("\n## Task\n" + taskHints[options.actionClass]);

  return {
    systemPrompt: sections.join("\n"),
    contextUsed,
    workspaceId: active?.workspace_id ?? activeId,
  };
}

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

export function buildOfflineAnswer(options: {
  actionClass: CommandActionClass;
  workspaceId?: string;
}): string {
  const { actionClass, workspaceId } = options;
  const ws =
    listWorkspaces().find((w) => w.workspace_id === (workspaceId ?? "localbrain")) ??
    listWorkspaces()[0];
  const intel = getIntelligenceSummary();

  switch (actionClass) {
    case "focus_priority":
      return ws
        ? `OpenAI key not configured. Offline CoS: focus on **${ws.current_focus || ws.title}** — ${ws.profile.recommended_next_action || ws.executive_context.slice(0, 200)}. Set OPENAI_API_KEY in .env for full reasoning.`
        : "OpenAI key not configured. Set OPENAI_API_KEY in .env to enable Chief of Staff reasoning.";
    case "workspace_explain":
      return ws
        ? `Offline workspace brief — **${ws.title}**: ${ws.executive_context} Focus: ${ws.current_focus || "—"}. Health ${ws.health_score ?? "—"}.`
        : "No workspace context available offline.";
    case "asset_stale":
      return `Offline asset intelligence: ${intel.dormant.count} dormant assets (${formatBytes(intel.dormant.bytes)}), ${intel.duplicate_groups} duplicate candidate groups. Recommend-only — no cleanup actions. Configure OPENAI_API_KEY for deeper analysis.`;
    case "briefing_summary":
      return `Executive Briefing (mock): ${briefingAsContextText().slice(0, 500)}… Configure OPENAI_API_KEY for AI summary.`;
    default:
      return "Chief of Staff command layer ready but OPENAI_API_KEY is not set. Add it to .env and restart the backend.";
  }
}
