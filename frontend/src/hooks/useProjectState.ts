import { useCallback, useEffect, useState } from "react";
import type { ProjectState } from "@localbrain/shared";
import { fetchProjectState } from "../api/epo";

/** Read canonical Program Office project state (single source of truth). */
export function useProjectState(opts?: { intervalMs?: number }) {
  const [state, setState] = useState<ProjectState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setError(null);
      setState(await fetchProjectState());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load project state");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const ms = opts?.intervalMs;
    if (!ms) return;
    const id = window.setInterval(() => void load(), ms);
    return () => window.clearInterval(id);
  }, [load, opts?.intervalMs]);

  return { state, error, loading, reload: load };
}
