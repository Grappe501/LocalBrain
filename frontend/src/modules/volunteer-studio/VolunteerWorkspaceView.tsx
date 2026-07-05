import { useCallback, useEffect, useState } from "react";
import type { VolunteerProfile, VopSupervisorDashboard, VopWorkItem, WorkItem } from "@localbrain/shared";
import { VOP_DOCTRINE, VOP_SKILL_TAGS, VOP_VOLUNTEER_ROLES } from "@localbrain/shared";
import {
  claimVopWorkApi,
  completeVopWorkApi,
  fetchMyVopWork,
  fetchOpenVopWork,
  fetchSupervisorDashboard,
  fetchVolunteerProfile,
  flagVopWorkApi,
  releaseVopWorkApi,
  saveVolunteerProfile,
} from "../../api/vop";
import { ExecutiveQuestionShell } from "../../components/ExecutiveQuestionShell";

const WORKSPACE_ID = "localbrain";

type TabId = "profile" | "marketplace" | "myqueue" | "supervisor";

export function VolunteerWorkspaceView() {
  const [tab, setTab] = useState<TabId>("marketplace");
  const [profile, setProfile] = useState<VolunteerProfile | null>(null);
  const [openItems, setOpenItems] = useState<VopWorkItem[]>([]);
  const [ucieItems, setUcieItems] = useState<WorkItem[]>([]);
  const [myItems, setMyItems] = useState<VopWorkItem[]>([]);
  const [dashboard, setDashboard] = useState<VopSupervisorDashboard | null>(null);
  const [activeWork, setActiveWork] = useState<VopWorkItem[]>([]);
  const [displayName, setDisplayName] = useState("");
  const [county, setCounty] = useState("Benton");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["voter_verification", "canvassing"]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setError(null);
    try {
      const [prof, open, mine, sup] = await Promise.all([
        fetchVolunteerProfile(WORKSPACE_ID).catch(() => null),
        fetchOpenVopWork(WORKSPACE_ID),
        fetchMyVopWork(WORKSPACE_ID),
        fetchSupervisorDashboard(WORKSPACE_ID).catch(() => null),
      ]);
      setProfile(prof);
      if (prof) {
        setDisplayName(prof.display_name);
        setCounty(prof.county ?? "Benton");
        setSelectedSkills([...prof.skills]);
      }
      setOpenItems(open.items);
      setUcieItems(open.ucie_items);
      setMyItems(mine);
      if (sup) {
        setDashboard(sup.dashboard);
        setActiveWork(sup.active_work);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load volunteer workspace");
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  async function handleSaveProfile() {
    setMessage(null);
    setError(null);
    try {
      const saved = await saveVolunteerProfile({
        workspace_id: WORKSPACE_ID,
        user_id: "volunteer-fair-1",
        display_name: displayName || "Volunteer",
        county,
        roles: ["canvasser", "data_entry"],
        skills: selectedSkills as VolunteerProfile["skills"],
        training_completed: ["VOP-101"],
      });
      setProfile(saved);
      setMessage("Volunteer profile saved — marketplace matching updated.");
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save profile");
    }
  }

  function toggleSkill(skill: string) {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  }

  return (
    <div className="vop-studio">
      <ExecutiveQuestionShell route="/studio/volunteer" />
      <header className="vop-studio__header">
        <h1>Volunteer Operations Platform</h1>
        <p className="contact-dept__meta">VOP-001 · {VOP_DOCTRINE}</p>
      </header>

      {message ? <p className="contact-dept__notice">{message}</p> : null}
      {error ? <p className="contact-dept__error">{error}</p> : null}

      <div className="contact-dept__tabs" role="tablist">
        {(
          [
            ["profile", "My profile"],
            ["marketplace", "Work marketplace"],
            ["myqueue", "My queue"],
            ["supervisor", "Supervisor"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            className={tab === id ? "contact-dept__tab contact-dept__tab--active" : "contact-dept__tab"}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "profile" ? (
        <section className="vop-panel">
          <h2>Volunteer Profile</h2>
          <label>
            Display name
            <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </label>
          <label>
            County
            <input value={county} onChange={(e) => setCounty(e.target.value)} />
          </label>
          <fieldset>
            <legend>Skill tags</legend>
            <div className="vop-skills">
              {VOP_SKILL_TAGS.map((skill) => (
                <label key={skill} className="vop-skill-chip">
                  <input
                    type="checkbox"
                    checked={selectedSkills.includes(skill)}
                    onChange={() => toggleSkill(skill)}
                  />
                  {skill.replace(/_/g, " ")}
                </label>
              ))}
            </div>
          </fieldset>
          <p className="contact-dept__meta">
            Roles: {VOP_VOLUNTEER_ROLES.slice(0, 4).join(", ")}… · Training gate before sensitive work
          </p>
          <button type="button" className="contact-dept__primary" onClick={() => void handleSaveProfile()}>
            Save profile
          </button>
          {profile ? (
            <p className="contact-dept__meta">
              Active profile · {profile.skills.length} skills · {profile.county ?? "no county"}
            </p>
          ) : null}
        </section>
      ) : null}

      {tab === "marketplace" ? (
        <section className="vop-panel">
          <h2>Work Marketplace</h2>
          <p className="contact-dept__meta">
            Matched by county ({county}) and skills · UCIE identity queue shown for reference
          </p>
          <h3>VOP operational work</h3>
          <ul className="vop-work-list">
            {openItems.map((item) => (
              <li key={item.work_item_id}>
                <strong>{item.title}</strong>
                <span className="vop-work-meta">
                  {item.item_type} · {item.urgency} · match {item.match_score ?? "—"}%
                  {item.county ? ` · ${item.county}` : ""}
                </span>
                <p>{item.detail}</p>
                <button
                  type="button"
                  className="contact-dept__secondary"
                  onClick={() => void claimVopWorkApi(item.work_item_id).then(() => reload())}
                >
                  Claim
                </button>
              </li>
            ))}
            {openItems.length === 0 ? <li>No open work matching your profile.</li> : null}
          </ul>
          <h3>UCIE identity queue (read-only)</h3>
          <ul className="vop-work-list vop-work-list--ucie">
            {ucieItems.slice(0, 8).map((item) => (
              <li key={item.work_item_id}>
                <strong>{item.title}</strong> · {item.item_type}
                <span className="contact-dept__meta"> — claim via Identity Acquisition studio</span>
              </li>
            ))}
            {ucieItems.length === 0 ? <li>No open UCIE work items.</li> : null}
          </ul>
        </section>
      ) : null}

      {tab === "myqueue" ? (
        <section className="vop-panel">
          <h2>My Queue</h2>
          <ul className="vop-work-list">
            {myItems.map((item) => (
              <li key={item.work_item_id}>
                <strong>{item.title}</strong>
                <span className="vop-work-meta">
                  {item.status} · {item.quality_flag !== "none" ? `quality: ${item.quality_flag}` : "ok"}
                </span>
                <p>{item.detail}</p>
                <div className="vop-work-actions">
                  <button
                    type="button"
                    className="contact-dept__primary"
                    onClick={() =>
                      void completeVopWorkApi(item.work_item_id, "Completed from volunteer workspace").then(
                        () => reload(),
                      )
                    }
                  >
                    Complete
                  </button>
                  <button
                    type="button"
                    className="contact-dept__secondary"
                    onClick={() => void releaseVopWorkApi(item.work_item_id).then(() => reload())}
                  >
                    Release
                  </button>
                </div>
              </li>
            ))}
            {myItems.length === 0 ? <li>No claimed work.</li> : null}
          </ul>
        </section>
      ) : null}

      {tab === "supervisor" && dashboard ? (
        <section className="vop-panel">
          <h2>Supervisor Dashboard</h2>
          <div className="rel-analytics__portfolio">
            <article>
              <strong>{dashboard.open_backlog}</strong>
              <span>Open backlog</span>
            </article>
            <article>
              <strong>{dashboard.claimed_in_progress}</strong>
              <span>In progress</span>
            </article>
            <article>
              <strong>{dashboard.completed_today}</strong>
              <span>Completed today</span>
            </article>
            <article>
              <strong>{dashboard.completion_rate_percent}%</strong>
              <span>Completion rate</span>
            </article>
            <article>
              <strong>{dashboard.stuck_work_count}</strong>
              <span>Stuck work</span>
            </article>
            <article>
              <strong>{dashboard.quality_flag_count}</strong>
              <span>Quality flags</span>
            </article>
          </div>
          <p className="contact-dept__meta">
            UCIE open: {dashboard.ucie_open_items} · VOP open: {dashboard.vop_open_items} · Avg claim time:{" "}
            {dashboard.average_claim_hours}h
          </p>
          <h3>Active work</h3>
          <ul className="vop-work-list">
            {activeWork.map((item) => (
              <li key={item.work_item_id}>
                <strong>{item.title}</strong> · {item.status}
                {item.claimed_by_user_id ? ` · ${item.claimed_by_user_id}` : ""}
                {item.quality_flag !== "none" ? ` · ${item.quality_flag}` : ""}
                {item.status === "claimed" ? (
                  <button
                    type="button"
                    className="contact-dept__secondary"
                    onClick={() =>
                      void flagVopWorkApi(item.work_item_id, "rework", "Supervisor review").then(() => reload())
                    }
                  >
                    Flag rework
                  </button>
                ) : null}
              </li>
            ))}
            {activeWork.length === 0 ? <li>No active work.</li> : null}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
