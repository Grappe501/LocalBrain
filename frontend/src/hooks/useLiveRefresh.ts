import { useEffect } from "react";

export type LiveRefreshOptions = {
  /** Poll interval in ms. Default 15_000. */
  intervalMs?: number;
  /** When false, polling and focus refresh are disabled. Default true. */
  enabled?: boolean;
};

/**
 * Poll + refetch when the tab becomes visible or the window regains focus.
 * Keeps mission-control surfaces (Program Office, system health) live without manual reload.
 */
export function useLiveRefresh(
  refresh: () => void | Promise<void>,
  options?: LiveRefreshOptions,
): void {
  const intervalMs = options?.intervalMs ?? 15_000;
  const enabled = options?.enabled ?? true;

  useEffect(() => {
    if (!enabled) return;

    void refresh();

    const id = window.setInterval(() => void refresh(), intervalMs);

    const onVisibility = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    const onFocus = () => void refresh();

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);

    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
    };
  }, [refresh, intervalMs, enabled]);
}
