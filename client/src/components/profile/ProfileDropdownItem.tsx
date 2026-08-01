import type { KeyboardEvent, Ref } from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

type ProfileDropdownItemProps = {
  icon: LucideIcon;
  label: string;
  itemRef?: Ref<HTMLAnchorElement | HTMLButtonElement>;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  onSelect: () => void;
  to?: string;
  destructive?: boolean;
  disabled?: boolean;
};

const baseClasses =
  "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1";

export default function ProfileDropdownItem({
  icon: Icon,
  label,
  itemRef,
  onKeyDown,
  onSelect,
  to,
  destructive = false,
  disabled = false,
}: ProfileDropdownItemProps) {
  const classes = `${baseClasses} ${
    destructive
      ? "text-rose-600 hover:bg-rose-50 focus-visible:bg-rose-50"
      : "text-slate-700 hover:bg-blue-50 hover:text-blue-700 focus-visible:bg-blue-50 focus-visible:text-blue-700"
  } disabled:cursor-wait disabled:opacity-60`;

  if (to) {
    return (
      <Link
        ref={itemRef as Ref<HTMLAnchorElement>}
        to={to}
        role="menuitem"
        className={classes}
        onClick={onSelect}
        onKeyDown={onKeyDown}
      >
        <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <button
      ref={itemRef as Ref<HTMLButtonElement>}
      type="button"
      role="menuitem"
      className={classes}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      disabled={disabled}
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}
