import { useParams } from "react-router-dom";
import { StubPage } from "./StubPages";

export function StudioStub() {
  const params = useParams();
  const segment = params["*"] ?? "unknown";

  return (
    <StubPage
      title={`${segment.charAt(0).toUpperCase()}${segment.slice(1)} — studio placeholder`}
      description="Departments register as modules after LB-OS-106 (MODULARITY GATE). No hard-coded studio logic in the kernel."
      slice="LB-OS-106 — module loader"
    />
  );
}
