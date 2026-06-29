import { lazy, Suspense } from "react";

const ModuleStubPage = lazy(() => import("../modules/ModuleStubPage"));

type Props = {
  moduleId: string;
};

export function LazyModuleRoute({ moduleId }: Props) {
  return (
    <Suspense fallback={<p className="module-route-loading">Loading module…</p>}>
      <ModuleStubPage moduleId={moduleId} />
    </Suspense>
  );
}
