import { useAppSettings } from "../context/AppSettingsContext";
import { SafetyPanel } from "../components/SafetyPanel";

export function SettingsPage() {
  const { teachMeWhileWeBuild, setTeachMeWhileWeBuild } = useAppSettings();

  return (
    <article className="settings-page">
      <h1>Settings</h1>
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
          : "OFF — build mode only."}
      </p>

      <SafetyPanel />
    </article>
  );
}
