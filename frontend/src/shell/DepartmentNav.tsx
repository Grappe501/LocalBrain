import { NavLink } from "react-router-dom";
import { useModuleRegistry } from "../context/ModuleRegistryContext";

/** Kernel shell routes — not registered as modules. */
const KERNEL_NAV_TAIL = [
  { label: "Workspace", path: "/workspace/localbrain" },
  { label: "Knowledge Explorer", path: "/explorer" },
  { label: "Learn", path: "/learn" },
  { label: "Actions", path: "/actions" },
  { label: "System", path: "/system" },
  { label: "Settings", path: "/settings" },
] as const;

export function DepartmentNav() {
  const { departmentModules, loading, loadOrder } = useModuleRegistry();

  const orderedDepartments = loadOrder
    .map((id) => departmentModules.find((m) => m.module_id === id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  const departmentItems =
    orderedDepartments.length > 0
      ? orderedDepartments
      : departmentModules;

  const navItems = [
    { label: "Executive", path: "/" },
    ...departmentItems.map((m) => ({
      label: m.name,
      path: m.routes[0]?.path ?? `/studio/${m.domain}`,
    })),
    ...KERNEL_NAV_TAIL,
  ];

  return (
    <nav className="department-nav" aria-label="Department navigation">
      <p className="department-nav__note">
        {loading
          ? "Loading module manifests…"
          : `${departmentModules.length} departments from manifests · LB-OS-106`}
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
