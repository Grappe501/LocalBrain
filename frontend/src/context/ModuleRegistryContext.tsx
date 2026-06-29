import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ModuleManifest } from "@localbrain/shared";
import { fetchModules } from "../api/modules";

type ModuleRegistryContextValue = {
  modules: ModuleManifest[];
  departmentModules: ModuleManifest[];
  loadOrder: string[];
  loading: boolean;
  error: string | null;
  getModule: (moduleId: string) => ModuleManifest | undefined;
  refresh: () => Promise<void>;
};

const ModuleRegistryContext = createContext<ModuleRegistryContextValue | null>(null);

export function ModuleRegistryProvider({ children }: { children: ReactNode }) {
  const [modules, setModules] = useState<ModuleManifest[]>([]);
  const [departmentModules, setDepartmentModules] = useState<ModuleManifest[]>([]);
  const [loadOrder, setLoadOrder] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchModules();
      setModules(data.modules);
      setDepartmentModules(data.department_modules);
      setLoadOrder(data.load_order);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load modules");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const getModule = useCallback(
    (moduleId: string) => modules.find((m) => m.module_id === moduleId),
    [modules],
  );

  const value = useMemo(
    () => ({
      modules,
      departmentModules,
      loadOrder,
      loading,
      error,
      getModule,
      refresh,
    }),
    [modules, departmentModules, loadOrder, loading, error, getModule, refresh],
  );

  return (
    <ModuleRegistryContext.Provider value={value}>{children}</ModuleRegistryContext.Provider>
  );
}

export function useModuleRegistry(): ModuleRegistryContextValue {
  const ctx = useContext(ModuleRegistryContext);
  if (!ctx) {
    throw new Error("useModuleRegistry must be used within ModuleRegistryProvider");
  }
  return ctx;
}
