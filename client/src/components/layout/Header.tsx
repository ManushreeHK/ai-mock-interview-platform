import { Bell, Search } from "lucide-react";
import { Input } from "../ui";
import { getGreeting } from "../../utils/getGreeting";
import { ChevronDown } from "lucide-react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { getUserAttributes } from "../../services/auth";
import { useEffect } from "react";



export default function Header() {
    const greeting = getGreeting();
    const user = useCurrentUser();

    useEffect(() => {
  async function load() {
    const attrs = await getUserAttributes();
    console.log(attrs);
  }

  load();
}, []);
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {greeting}, {user.name} 👋
        </h1>

       <p className="mt-1 text-sm text-slate-500">
  Track your interview journey and improve every day.
</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-72">
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
<div className="flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2 transition-all duration-300 hover:bg-slate-100">

  <div className="relative">
    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-violet-600 font-semibold text-white shadow-md">
      {user.name ? user.name.charAt(0).toUpperCase() : "G"}
    </div>

    <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500"></span>
  </div>

  <div className="hidden md:block">
    <p className="font-semibold text-slate-900">
      {user.name}
    </p>

    <p className="text-xs text-slate-500">
      Free Plan
    </p>
  </div>

  <ChevronDown
    size={18}
    className="text-slate-400"
  />
</div>
      </div>
    </header>
  );
}