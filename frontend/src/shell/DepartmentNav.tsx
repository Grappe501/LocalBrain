import { NavLink } from "react-router-dom";

const DEPARTMENTS = [
  { label: "Executive", path: "/" },
  { label: "Engineering", path: "/studio/engineering" },
  { label: "Creative", path: "/studio/creative" },
  { label: "Data", path: "/studio/data" },
  { label: "Finance", path: "/studio/finance" },
  { label: "Media", path: "/studio/media" },
  { label: "Research", path: "/studio/research" },
  { label: "System", path: "/studio/system" },
  { label: "Workspace", path: "/project/localbrain" },
  { label: "Explorer", path: "/explorer" },
  { label: "Learn", path: "/learn" },
  { label: "Actions", path: "/actions" },
  { label: "Settings", path: "/settings" },
] as const;

export function DepartmentNav() {
  return (
    <nav className="department-nav" aria-label="Department navigation placeholders">
      <p className="department-nav__note">Placeholders — module manifests after LB-OS-106</p>
      <ul className="department-nav__list">
        {DEPARTMENTS.map((dept) => (
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
