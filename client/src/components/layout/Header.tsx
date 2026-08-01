import { Bell, Search } from "lucide-react";
import { Input } from "../ui";
import { getGreeting } from "../../utils/getGreeting";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import ProfileDropdown from "../profile/ProfileDropdown";



export default function Header() {
    const greeting = getGreeting();
    const user = useCurrentUser();
  return (
    <header className="relative z-50 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-8">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-slate-900">
          {greeting}, {user.displayName} 👋
        </h1>

       <p className="mt-1 text-sm text-slate-500">
  Track your interview journey and improve every day.
</p>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative hidden w-72 lg:block">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <Input
            placeholder="Search..."
            className="pl-10"
          />
        </div>

        <div className="relative">
  <button className="rounded-xl border border-slate-200 bg-white p-3 transition-all duration-300 hover:border-blue-200 hover:bg-slate-50 hover:shadow-md">
    <Bell size={20} className="text-slate-700" />
  </button>

  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
    3
  </span>
</div>
        <ProfileDropdown />
      </div>
    </header>
  );
}
