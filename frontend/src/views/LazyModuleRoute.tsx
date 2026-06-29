import { lazy, Suspense } from "react";

const ModuleStubPage = lazy(() => import("../modules/ModuleStubPage"));
const EngineeringEntry = lazy(() => import("../modules/engineering-studio/Entry"));

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

  return (
    <Suspense fallback={<p className="module-route-loading">Loading module…</p>}>
      <ModuleStubPage moduleId={moduleId} />
    </Suspense>
  );
}
