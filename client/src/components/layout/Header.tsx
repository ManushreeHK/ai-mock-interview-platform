import { Menu } from "lucide-react";
import { getGreeting } from "../../utils/getGreeting";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import ProfileDropdown from "../profile/ProfileDropdown";

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const greeting = getGreeting();
  const user = useCurrentUser();

  return (
    <header className="relative z-50 flex min-h-[4.5rem] items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-900 sm:px-5 lg:px-6">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button type="button" onClick={onMenuClick} aria-label="Open navigation" aria-controls="app-sidebar" className="grid min-h-11 min-w-11 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 lg:hidden">
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="min-w-0">
        <h1 className="truncate text-base font-bold text-slate-900 dark:text-slate-100 sm:text-lg xl:text-xl">
          {greeting}, {user.displayName}
        </h1>
        <p className="mt-0.5 hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
          Track your interview journey and improve every day.
        </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center">
        <ProfileDropdown />
      </div>
    </header>
  );
}
