import { useAppSettings } from "../context/AppSettingsContext";

export function LearnStub() {
  const { teachMeWhileWeBuild, toggleTeachMe } = useAppSettings();

  return (
    <article className="settings-page">
      <h1>Learn — OJT Academy</h1>
      <p>On-the-job training tied to real build slices.</p>
      <button type="button" className="command-bar__submit" onClick={toggleTeachMe}>
        Teach Me While We Build: {teachMeWhileWeBuild ? "ON" : "OFF"}
      </button>
      <p className="stub-page__slice">LB-OS-026 — Build-along teaching mode</p>
    </article>
  );
}
