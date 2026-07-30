import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  MessageSquareWarning,
  Wallet,
  ScrollText,
  UserCheck,
  UserCircle,
  Settings as SettingsIcon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const linkClasses = ({ isActive }) =>
  `flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
    isActive
      ? "bg-primary text-white"
      : "text-ink/70 hover:bg-primary/10 hover:text-primary"
  }`;

const NAV_BY_ROLE = {
  admin: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/residents", label: "Residents", icon: Users },
    { to: "/flats", label: "Flats", icon: Building2 },
    { to: "/complaints", label: "Complaints", icon: MessageSquareWarning },
    { to: "/maintenance", label: "Maintenance", icon: Wallet },
    { to: "/notices", label: "Notice Board", icon: ScrollText },
    { to: "/visitors", label: "Visitors", icon: UserCheck },
  ],
  member: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/complaints", label: "Complaints", icon: MessageSquareWarning },
    { to: "/maintenance", label: "Maintenance", icon: Wallet },
    { to: "/notices", label: "Notice Board", icon: ScrollText },
    { to: "/visitors", label: "Visitors", icon: UserCheck },
  ],
  guard: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/visitors", label: "Visitor Entry", icon: UserCheck },
  ],
};

const Sidebar = () => {
  const { user } = useAuth();
  const links = NAV_BY_ROLE[user?.role] || [];

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-panel px-4 py-6 md:flex">
      <div className="mb-8 px-2">
        <h1 className="font-display text-lg font-semibold text-primary">Smart Society</h1>
        <p className="text-xs text-ink/50 capitalize">{user?.role} panel</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={linkClasses}>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-border pt-4">
        <NavLink to="/profile" className={linkClasses}>
          <UserCircle size={18} />
          Profile
        </NavLink>
        <NavLink to="/settings" className={linkClasses}>
          <SettingsIcon size={18} />
          Settings
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
