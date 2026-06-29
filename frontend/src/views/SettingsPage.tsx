import { useAppSettings } from "../context/AppSettingsContext";
import { LiveSurfaceBanner } from "../components/LiveSurfaceBanner";
import { SafetyPanel } from "../components/SafetyPanel";
import { Link } from "react-router-dom";

export function SettingsPage() {
  const { teachMeWhileWeBuild, setTeachMeWhileWeBuild } = useAppSettings();

  return (
    <article className="settings-page">
      <h1>Settings</h1>
      <LiveSurfaceBanner route="/settings" />
      <label className="teach-toggle">
        <input
          type="checkbox"
          checked={teachMeWhileWeBuild}
          onChange={(e) => setTeachMeWhileWeBuild(e.target.checked)}
        />
        <span>Teach Me While We Build</span>
      </label>
      <p className="settings-page__hint">
        {teachMeWhileWeBuild
          ? "ON — closeouts will include OJT blocks after LB-OS-026."
          : "OFF — build mode only."}{" "}
        <em>(Local UI only — not persisted until LB-OS-028.)</em>
      </p>
      <p className="settings-page__hint">
        <Link to="/system/providers">AI Provider settings →</Link> (live at LB-OS-017)
      </p>

      <SafetyPanel />
    </article>
  );
}
