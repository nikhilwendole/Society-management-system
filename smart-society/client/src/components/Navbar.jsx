import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between border-b border-border bg-panel px-6 py-4">
      <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-ink">{user?.name}</p>
          <p className="text-xs capitalize text-ink/50">{user?.role}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-semibold text-primary">
          {user?.name?.[0]?.toUpperCase() || "?"}
        </div>
        <button
          onClick={handleLogout}
          title="Log out"
          className="rounded-md p-2 text-ink/50 transition-colors hover:bg-danger/10 hover:text-danger"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
