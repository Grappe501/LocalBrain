import fs from "node:fs";
import path from "node:path";
import { getRepoRoot } from "../db/repoRoot.js";

export type V1HeartbeatSnapshot = {
  date: string;
  launch_score_percent: number;
  days_to_beta: number | null;
};

type V1HeartbeatStore = {
  previous_day: V1HeartbeatSnapshot | null;
  current_day: V1HeartbeatSnapshot;
};

const HEARTBEAT_PATH = path.join(getRepoRoot(), "local_data", "v1-heartbeat.json");

function yesterdayIso(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function readStore(): V1HeartbeatStore | null {
  try {
    if (!fs.existsSync(HEARTBEAT_PATH)) return null;
    return JSON.parse(fs.readFileSync(HEARTBEAT_PATH, "utf8")) as V1HeartbeatStore;
  } catch {
    return null;
  }
}

function writeStore(store: V1HeartbeatStore): void {
  const dir = path.dirname(HEARTBEAT_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(HEARTBEAT_PATH, JSON.stringify(store, null, 2));
}

export function recordV1Heartbeat(
  launch_score_percent: number,
  days_to_beta: number | null,
): { launch_closer_than_yesterday: boolean | null; momentum_label: string } {
  const today = todayIso();
  const yesterday = yesterdayIso();
  const store = readStore();
  let previous_day = store?.previous_day ?? null;
  let current_day = store?.current_day ?? null;

  if (!current_day || current_day.date !== today) {
    if (current_day && current_day.date < today) {
      previous_day = current_day;
    }
    current_day = { date: today, launch_score_percent, days_to_beta };
  } else {
    current_day = { date: today, launch_score_percent, days_to_beta };
  }

  writeStore({ previous_day, current_day });

  if (!previous_day || previous_day.date !== yesterday) {
    return {
      launch_closer_than_yesterday: null,
      momentum_label: "Tracking started — compare again tomorrow",
    };
  }

  const scoreUp = launch_score_percent > previous_day.launch_score_percent;
  const daysDown =
    days_to_beta != null &&
    previous_day.days_to_beta != null &&
    days_to_beta < previous_day.days_to_beta;
  const closer = scoreUp || daysDown;

  let momentum_label: string;
  if (closer) {
    momentum_label = `Yes — launch score ${previous_day.launch_score_percent}% → ${launch_score_percent}%`;
    if (daysDown && previous_day.days_to_beta != null && days_to_beta != null) {
      momentum_label += ` · ${previous_day.days_to_beta} → ${days_to_beta} days to beta`;
    }
  } else if (
    launch_score_percent === previous_day.launch_score_percent &&
    days_to_beta === previous_day.days_to_beta
  ) {
    momentum_label = "Flat — same score and days to beta as yesterday";
  } else {
    momentum_label = "No — score or estimate did not improve";
  }

  return { launch_closer_than_yesterday: closer, momentum_label };
}
