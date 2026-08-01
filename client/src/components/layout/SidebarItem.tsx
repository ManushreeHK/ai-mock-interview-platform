import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import clsx from "clsx";

type SidebarItemProps = {
  label: string;
  path: string;
  icon: LucideIcon;
  onSelect?: () => void;
};

export default function SidebarItem({
  label,
  path,
  icon: Icon,
  onSelect,
}: SidebarItemProps) {
  return (
    <NavLink
      to={path}
      onClick={onSelect}
      className={({ isActive }) =>
        clsx(
          "flex min-h-11 items-center justify-between rounded-xl px-4 py-3 transition-all duration-200",
          isActive
            ? "bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        )
      }
    >
      <div className="flex items-center gap-3">
        <Icon size={20} />
        <span className="font-medium">{label}</span>
      </div>

      <ChevronRight size={16} />
    </NavLink>
  );
}
