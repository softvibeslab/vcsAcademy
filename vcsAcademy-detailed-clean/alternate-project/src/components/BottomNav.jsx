import { NavLink } from "react-router-dom";

const items = [
  { to: "/rep", label: "Home" },
  { to: "/rep/strategy", label: "Strategy" },
  { to: "/rep/path", label: "Path" },
  { to: "/rep/coaching", label: "Coaching" },
  { to: "/rep/resources", label: "Resources" },
];

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Rep navigation">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/rep"}
          className={({ isActive }) =>
            `bottom-nav-link ${isActive ? "is-active" : ""}`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
