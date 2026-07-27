import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import clsx from "clsx";

type SidebarItemProps = {
  label: string;
  path: string;
  icon: LucideIcon;
  disabled?: boolean;
};

export default function SidebarItem({
  label,
  path,
  icon: Icon,
  disabled = false,
}: SidebarItemProps) {
  if (disabled) {
    return (
      <div className="flex cursor-not-allowed items-center justify-between rounded-xl px-4 py-3 text-slate-400">
        <div className="flex items-center gap-3">
          <Icon size={20} />
          <span>{label}</span>
        </div>

        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium">
          Soon
        </span>
      </div>
    );
  }

  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        clsx(
          "flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-200",
          isActive
            ? "bg-blue-600 text-white shadow-sm"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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