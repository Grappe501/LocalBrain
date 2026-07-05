import { NavLink } from "react-router-dom";
import { getKernelNavItems } from "@localbrain/shared";
import { useModuleRegistry } from "../context/ModuleRegistryContext";

/** V1 shipped departments — active modules only in nav (LB-OS-016). */
const V1_DEPARTMENT_ORDER = [
  "engineering-studio",
  "writing-studio",
  "data-studio",
  "contact-studio",
  "ingestion-studio",
  "volunteer-studio",
  "relationship-studio",
] as const;

export function DepartmentNav() {
  const { departmentModules, loading } = useModuleRegistry();

  const v1Departments = V1_DEPARTMENT_ORDER.map((id) =>
    departmentModules.find((m) => m.module_id === id && m.status === "active"),
  ).filter((m): m is NonNullable<typeof m> => Boolean(m));

  const kernelNav = getKernelNavItems().filter((item) => item.path !== "/");

  const navItems = [
    { label: "Office", path: "/", capability_id: "CAP-EO-001" },
    ...v1Departments.map((m) => ({
      label: m.name,
      path: m.routes[0]?.path ?? `/studio/${m.domain}`,
      capability_id: m.module_id,
    })),
    ...kernelNav,
  ];

  return (
    <nav className="department-nav" aria-label="Department navigation">
      <p className="department-nav__note">
        {loading
          ? "Loading module manifests…"
          : `Executive OS V1 · ${v1Departments.length} departments · ENG-CAP-001 nav`}
      </p>
      <ul className="department-nav__list">
        {navItems.map((dept) => (
          <li key={dept.path}>
            <NavLink
              to={dept.path}
              className={({ isActive }) =>
                isActive ? "department-nav__link department-nav__link--active" : "department-nav__link"
              }
              end={dept.path === "/"}
            >
              {dept.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
