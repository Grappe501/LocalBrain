import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AppSettingsContextValue = {
  teachMeWhileWeBuild: boolean;
  setTeachMeWhileWeBuild: (value: boolean) => void;
  toggleTeachMe: () => void;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
};

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null);

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [teachMeWhileWeBuild, setTeachMeWhileWeBuild] = useState(true);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const toggleTeachMe = useCallback(() => {
    setTeachMeWhileWeBuild((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({
      teachMeWhileWeBuild,
      setTeachMeWhileWeBuild,
      toggleTeachMe,
      paletteOpen,
      setPaletteOpen,
    }),
    [teachMeWhileWeBuild, paletteOpen, toggleTeachMe],
  );

  return (
    <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>
  );
}

export function useAppSettings(): AppSettingsContextValue {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) {
    throw new Error("useAppSettings must be used within AppSettingsProvider");
  }
  return ctx;
}
