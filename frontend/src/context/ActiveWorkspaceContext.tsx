import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { LivingWorkspace } from "@localbrain/shared";
import { fetchActiveWorkspace, selectWorkspace as apiSelectWorkspace } from "../api/workspaces";

type ActiveWorkspaceContextValue = {
  workspace: LivingWorkspace | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  selectWorkspace: (id: string) => Promise<void>;
};

const ActiveWorkspaceContext = createContext<ActiveWorkspaceContextValue | null>(null);

export function ActiveWorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspace, setWorkspace] = useState<LivingWorkspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const ws = await fetchActiveWorkspace();
      setWorkspace(ws);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load active workspace");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const selectWorkspace = useCallback(async (id: string) => {
    const ws = await apiSelectWorkspace(id);
    setWorkspace(ws);
  }, []);

  const value = useMemo(
    () => ({ workspace, loading, error, refresh, selectWorkspace }),
    [workspace, loading, error, refresh, selectWorkspace],
  );

  return (
    <ActiveWorkspaceContext.Provider value={value}>{children}</ActiveWorkspaceContext.Provider>
  );
}

export function useActiveWorkspace(): ActiveWorkspaceContextValue {
  const ctx = useContext(ActiveWorkspaceContext);
  if (!ctx) {
    throw new Error("useActiveWorkspace must be used within ActiveWorkspaceProvider");
  }
  return ctx;
}
