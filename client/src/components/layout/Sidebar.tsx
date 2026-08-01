import { LogOut, X } from "lucide-react";
import { navigation } from "../../constants/navigation";
import SidebarItem from "./SidebarItem";
import { logout } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import SidebarThemeSwitcher from "./SidebarThemeSwitcher";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export default function Sidebar({ open, onClose }: SidebarProps) {
    const navigate = useNavigate();
    const user = useCurrentUser();
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
    <>
      <button
        type="button"
        aria-label="Close navigation"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-slate-950/55 backdrop-blur-sm transition-opacity lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        id="app-sidebar"
        aria-label="Application navigation"
        className={`fixed inset-y-0 left-0 z-[70] flex h-dvh w-[min(18rem,calc(100vw-2rem))] shrink-0 flex-col border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 dark:border-slate-700 dark:bg-slate-900 lg:sticky lg:top-0 lg:z-40 lg:h-screen lg:w-72 lg:translate-x-0 lg:shadow-none ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
      {/* Logo */}
      <div className="flex items-start justify-between border-b border-slate-200 px-5 py-5 dark:border-slate-700">
        <div className="min-w-0">
        <h1 className="text-xl font-bold text-blue-600">
          InterviewAce AI
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Practice. Improve. Get Hired.
        </p>
        </div>
        <button type="button" onClick={onClose} className="grid min-h-11 min-w-11 place-items-center rounded-xl text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-slate-800 lg:hidden" aria-label="Close navigation">
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 p-4">
        {navigation.map((item) => (
          <SidebarItem
            key={item.label}
            label={item.label}
            path={item.path}
            icon={item.icon}
            onSelect={onClose}
          />
        ))}
      </nav>

      <SidebarThemeSwitcher />

      {/* User */}
      <div className="border-t border-slate-200 p-4 dark:border-slate-700">
        <div className="mb-4">
          <p className="truncate font-semibold text-slate-900 dark:text-slate-100">
            {user.displayName}
          </p>

          <p className="truncate text-sm text-slate-500">
            {user.email}
          </p>
        </div>

       <button
  onClick={handleLogout}
  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-600 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-300 dark:hover:bg-red-950/40 dark:hover:text-red-300"
>
  <LogOut size={20} />
  Logout
</button>
      </div>
      </aside>
    </>
  );
}
