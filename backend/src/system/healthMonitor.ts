import fs from "node:fs";
import os from "node:os";
import type { DiskVolumeHealth } from "@localbrain/shared";

const WATCHED_VOLUMES: { mount: string; label: string }[] = [
  { mount: "C:\\", label: "C:" },
  { mount: "H:\\", label: "H:" },
];

let lastCpuSample: { idle: number; total: number } | null = null;

function readDiskVolume(mount: string, label: string): DiskVolumeHealth {
  try {
    const stat = fs.statfsSync(mount);
    const total = stat.blocks * stat.bsize;
    const free = stat.bavail * stat.bsize;
    const used = total - free;
    const used_percent = total > 0 ? Math.round((used / total) * 100) : null;
    return {
      mount,
      label,
      used_percent,
      free_bytes: free,
      total_bytes: total,
      available: true,
    };
  } catch {
    return {
      mount,
      label,
      used_percent: null,
      free_bytes: null,
      total_bytes: null,
      available: false,
    };
  }
}

export function sampleCpuPercent(): number | null {
  const cpus = os.cpus();
  if (cpus.length === 0) return null;

  let idle = 0;
  let total = 0;
  for (const cpu of cpus) {
    idle += cpu.times.idle;
    total +=
      cpu.times.user +
      cpu.times.nice +
      cpu.times.sys +
      cpu.times.idle +
      cpu.times.irq;
  }

  if (!lastCpuSample) {
    lastCpuSample = { idle, total };
    return null;
  }

  const idleDiff = idle - lastCpuSample.idle;
  const totalDiff = total - lastCpuSample.total;
  lastCpuSample = { idle, total };

  if (totalDiff <= 0) return null;
  return Math.max(0, Math.min(100, Math.round(100 * (1 - idleDiff / totalDiff))));
}

export function getMachineMetrics(): {
  cpu_percent: number | null;
  ram_used_percent: number;
  ram_used_bytes: number;
  ram_total_bytes: number;
  uptime_seconds: number;
  platform: string;
  hostname: string;
  disks: DiskVolumeHealth[];
} {
  const ramTotal = os.totalmem();
  const ramFree = os.freemem();
  const ramUsed = ramTotal - ramFree;

  return {
    cpu_percent: sampleCpuPercent(),
    ram_used_percent: ramTotal > 0 ? Math.round((ramUsed / ramTotal) * 100) : 0,
    ram_used_bytes: ramUsed,
    ram_total_bytes: ramTotal,
    uptime_seconds: Math.floor(os.uptime()),
    platform: `${os.platform()} ${os.release()}`,
    hostname: os.hostname(),
    disks: WATCHED_VOLUMES.map((v) => readDiskVolume(v.mount, v.label)),
  };
}

export function getDiskByLabel(label: string): DiskVolumeHealth | undefined {
  return getMachineMetrics().disks.find((d) => d.label === label);
}

/** Prime CPU sampler so subsequent calls return a value */
export function primeCpuSampler(): void {
  sampleCpuPercent();
  setTimeout(() => sampleCpuPercent(), 200);
}
