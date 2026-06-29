import { lazy, Suspense } from "react";

const ModuleStubPage = lazy(() => import("../modules/ModuleStubPage"));
const EngineeringEntry = lazy(() => import("../modules/engineering-studio/Entry"));
const WritingEntry = lazy(() => import("../modules/writing-studio/Entry"));
const DataIntelligenceEntry = lazy(() => import("../modules/data-studio/Entry"));

type Props = {
  moduleId: string;
};

export function LazyModuleRoute({ moduleId }: Props) {
  if (moduleId === "engineering-studio") {
    return (
      <Suspense fallback={<p className="module-route-loading">Loading module…</p>}>
        <EngineeringEntry />
      </Suspense>
    );
  }

  if (moduleId === "writing-studio") {
    return (
      <Suspense fallback={<p className="module-route-loading">Loading module…</p>}>
        <WritingEntry />
      </Suspense>
    );
  }

  if (moduleId === "data-studio") {
    return (
      <Suspense fallback={<p className="module-route-loading">Loading module…</p>}>
        <DataIntelligenceEntry />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<p className="module-route-loading">Loading module…</p>}>
      <ModuleStubPage moduleId={moduleId} />
    </Suspense>
  );
}
