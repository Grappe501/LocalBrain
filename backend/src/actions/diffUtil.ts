export function computeDiffPreview(original: string, proposed: string): string {
  const oldLines = original.split("\n");
  const newLines = proposed.split("\n");
  const max = Math.max(oldLines.length, newLines.length);
  const lines: string[] = ["--- original", "+++ proposed"];

  for (let i = 0; i < max; i++) {
    const o = oldLines[i];
    const n = newLines[i];
    if (o === n) {
      if (o !== undefined) lines.push(` ${o}`);
    } else {
      if (o !== undefined) lines.push(`-${o}`);
      if (n !== undefined) lines.push(`+${n}`);
    }
  }

  return lines.join("\n");
}
