import assert from "node:assert/strict";
import test from "node:test";
import crypto from "node:crypto";
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import { closeDatabase } from "../db/database.js";
import { upsertVolunteerProfile } from "../vop/vopProfileService.js";
import {
  claimVopWorkItem,
  completeVopWorkItem,
  createVopWorkItem,
  flagVopWorkQuality,
  listOpenVopWorkItems,
  releaseVopWorkItem,
} from "../vop/vopWorkService.js";
import { buildSupervisorDashboard } from "../vop/vopSupervisorService.js";
import { VOP_DOCTRINE } from "@localbrain/shared";

test("VOP-001 volunteer work marketplace vertical slice", { concurrency: 1 }, () => {
  bootstrapApp();
  const workspace_id = `vop-test-${crypto.randomUUID()}`;
  const volunteerId = "volunteer-benton-1";
  const supervisorId = "supervisor-1";

  try {
    assert.equal(VOP_DOCTRINE, "Coordinate people, don't just assign tasks.");

    upsertVolunteerProfile({
      workspace_id,
      user_id: volunteerId,
      display_name: "Alex Volunteer",
      county: "Benton",
      roles: ["canvasser", "data_entry"],
      skills: ["voter_verification", "data_cleanup", "canvassing"],
      training_completed: ["VOP-101"],
    });

    const bentonJob = createVopWorkItem({
      workspace_id,
      item_type: "voter_verification",
      title: "Verify voter registration — Kelly M.",
      detail: "County fair intake follow-up",
      county: "Benton",
      required_skills: ["voter_verification"],
      urgency: "high",
      source_system: "contact",
    });

    createVopWorkItem({
      workspace_id,
      item_type: "canvass_block",
      title: "Downtown canvass — Washington County",
      detail: "Different county — should not match Benton volunteer",
      county: "Washington",
      required_skills: ["canvassing"],
    });

    const openForVolunteer = listOpenVopWorkItems(
      workspace_id,
      upsertVolunteerProfile({
        workspace_id,
        user_id: volunteerId,
        display_name: "Alex Volunteer",
        county: "Benton",
        skills: ["voter_verification", "data_cleanup", "canvassing"],
      }),
    );
    assert.equal(openForVolunteer.length, 1);
    assert.equal(openForVolunteer[0]!.work_item_id, bentonJob.work_item_id);
    assert.ok((openForVolunteer[0]!.match_score ?? 0) >= 70);

    const claimed = claimVopWorkItem({
      work_item_id: bentonJob.work_item_id,
      user_id: volunteerId,
    });
    assert.ok(claimed);
    assert.equal(claimed!.status, "claimed");
    assert.equal(claimed!.claimed_by_user_id, volunteerId);

    const released = releaseVopWorkItem({
      work_item_id: bentonJob.work_item_id,
      user_id: volunteerId,
    });
    assert.ok(released);
    assert.equal(released!.status, "open");

    const reclaimed = claimVopWorkItem({
      work_item_id: bentonJob.work_item_id,
      user_id: volunteerId,
    });
    assert.ok(reclaimed);

    const completed = completeVopWorkItem({
      work_item_id: bentonJob.work_item_id,
      user_id: volunteerId,
      resolution_note: "Verified against county roll",
    });
    assert.ok(completed);
    assert.equal(completed!.status, "completed");
    assert.ok(completed!.detail.includes("Verified against county roll"));

    const followUp = createVopWorkItem({
      workspace_id,
      item_type: "follow_up",
      title: "Stewardship gap — no contact in 45 days",
      detail: "Cold volunteer relationship",
      county: "Benton",
      required_skills: ["stewardship"],
      source_system: "contact",
    });

    claimVopWorkItem({ work_item_id: followUp.work_item_id, user_id: volunteerId });

    const flagged = flagVopWorkQuality({
      work_item_id: followUp.work_item_id,
      flagged_by_user_id: supervisorId,
      flag_type: "rework",
      note: "Incomplete outreach notes",
    });
    assert.ok(flagged);
    assert.equal(flagged!.quality_flag, "rework");

    const dashboard = buildSupervisorDashboard(workspace_id);
    assert.ok(dashboard.open_backlog >= 1);
    assert.equal(dashboard.completed_today, 1);
    assert.ok(dashboard.quality_flag_count >= 1);
    assert.ok(dashboard.backlog_by_type.length >= 1);
  } finally {
    shutdownApp();
    closeDatabase();
  }
});
