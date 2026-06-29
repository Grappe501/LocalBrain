import { useModuleRegistry } from "../context/ModuleRegistryContext";
import { StubPage } from "../views/StubPages";

type Props = {
  moduleId: string;
};

export default function ModuleStubPage({ moduleId }: Props) {
  const { getModule } = useModuleRegistry();
  const manifest = getModule(moduleId);

  if (!manifest) {
    return (
      <StubPage
        title="Module not found"
        description={`No manifest registered for ${moduleId}.`}
        slice="LB-OS-106"
      />
    );
  }

  const capList = manifest.capabilities
    .map((c) => `${c.capability_id} → ${c.dependencies.join(", ")}`)
    .join(" · ");

  return (
    <StubPage
      title={`${manifest.name} — module stub`}
      description={
        manifest.description ??
        "Registered via manifest. Domain logic loads at lazy_load_boundary when the module ships."
      }
      slice={`LB-OS-106 · ${manifest.module_id} · ${manifest.status}`}
      extra={
        <dl className="module-stub-meta">
          <dt>Domain</dt>
          <dd>{manifest.domain}</dd>
          <dt>Lazy boundary</dt>
          <dd>
            <code>{manifest.lazy_load_boundary}</code>
          </dd>
          <dt>Agents</dt>
          <dd>{manifest.agents.length ? manifest.agents.join(", ") : "—"}</dd>
          <dt>Tools</dt>
          <dd>{manifest.tools.length ? manifest.tools.join(", ") : "—"}</dd>
          <dt>Knowledge sources</dt>
          <dd>{manifest.data_sources.length ? manifest.data_sources.join(", ") : "—"}</dd>
          <dt>Capabilities</dt>
          <dd>{capList || "—"}</dd>
        </dl>
      }
    />
  );
}
