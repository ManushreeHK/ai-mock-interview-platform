import { LogOut } from "lucide-react";
import { navigation } from "../../constants/navigation";
import SidebarItem from "./SidebarItem";
import { logout } from "../../services/auth";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
    const navigate = useNavigate();
    async function handleLogout() {
  try {
    await logout();
    navigate("/");
  } catch (error) {
    console.error(error);
    alert("Logout failed");
  }
}
  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="border-b border-slate-200 p-6">
        <h1 className="text-2xl font-bold text-blue-600">
          InterviewAce AI
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Practice. Improve. Get Hired.
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {navigation.map((item) => (
          <SidebarItem
            key={item.label}
            label={item.label}
            path={item.path}
            icon={item.icon}
            disabled={item.disabled}
          />
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-slate-200 p-4">
        <div className="mb-4">
          <p className="font-semibold text-slate-900">
            Guest User
          </p>

          <p className="text-sm text-slate-500">
            guest@example.com
          </p>
        </div>

       <button
  onClick={handleLogout}
  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-600 transition hover:bg-red-50 hover:text-red-600"
>
  <LogOut size={20} />
  Logout
</button>
      </div>
    </aside>
  );
}
