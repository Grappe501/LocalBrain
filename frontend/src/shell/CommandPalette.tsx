import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSettings } from "../context/AppSettingsContext";

const PALETTE_ITEMS = [
  { label: "Executive Office", path: "/" },
  { label: "Living Workspace — localbrain", path: "/workspace/localbrain" },
  { label: "Knowledge Explorer (stub)", path: "/explorer" },
  { label: "Learn — OJT", path: "/learn" },
  { label: "Settings", path: "/settings" },
];

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen } = useAppSettings();
  const navigate = useNavigate();

  useEffect(() => {
    if (!paletteOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [paletteOpen, setPaletteOpen]);

  if (!paletteOpen) return null;

  return (
    <div
      className="command-palette-overlay"
      role="dialog"
      aria-label="Command palette"
      onClick={() => setPaletteOpen(false)}
    >
      <div className="command-palette" onClick={(e) => e.stopPropagation()}>
        <h2 className="command-palette__title">Chief of Staff — quick route</h2>
        <p className="command-palette__hint">Quick route · ei-doctrine-v1.0 FROZEN · ENG-EI-001 next · Foundation V1 COMPLETE</p>
        <ul className="command-palette__list">
          {PALETTE_ITEMS.map((item) => (
            <li key={item.path}>
              <button
                type="button"
                className="command-palette__item"
                onClick={() => {
                  navigate(item.path);
                  setPaletteOpen(false);
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
