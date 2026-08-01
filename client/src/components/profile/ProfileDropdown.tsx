import {
  useEffect,
  useId,
  useReducer,
  useRef,
  useState,
} from "react";
import type { KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  CircleHelp,
  CreditCard,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { logout } from "../../services/auth";
import {
  getProfileDisplayName,
  getProfileInitials,
  initialProfileMenuState,
  performProfileLogout,
  profileDropdownViewportClasses,
  profileMenuLinks,
  profileMenuReducer,
} from "../../utils/profileDropdown";
import ProfileDropdownItem from "./ProfileDropdownItem";

const menuIcons = [User, Settings, CreditCard, CircleHelp] as const;
const menuItemCount = profileMenuLinks.length + 1;

export default function ProfileDropdown() {
  const profile = useCurrentUser();
  const navigate = useNavigate();
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | HTMLButtonElement | null>>(
    []
  );
  const [state, dispatch] = useReducer(
    profileMenuReducer,
    initialProfileMenuState
  );
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const displayName = getProfileDisplayName(
    profile.displayName,
    profile.email
  );
  const initials = getProfileInitials(displayName);
  const showPicture = Boolean(profile.picture) && !avatarFailed;

  useEffect(() => {
    if (state.activeIndex !== null) {
      itemRefs.current[state.activeIndex]?.focus();
    }
  }, [state.activeIndex]);

  useEffect(() => {
    if (!state.isOpen) return;

    function handleOutsidePointer(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        dispatch({ type: "close" });
      }
    }

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      dispatch({ type: "close" });
      triggerRef.current?.focus();
    }

    document.addEventListener("pointerdown", handleOutsidePointer);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointer);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [state.isOpen]);

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      dispatch({ type: "open", activeIndex: 0 });
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      dispatch({ type: "open", activeIndex: menuItemCount - 1 });
    }
  }

  function handleItemKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      dispatch({
        type: "move",
        direction: event.key === "ArrowDown" ? 1 : -1,
        itemCount: menuItemCount,
      });
    } else if (event.key === "Escape") {
      event.preventDefault();
      dispatch({ type: "close" });
      triggerRef.current?.focus();
    }
  }

  function closeMenu() {
    dispatch({ type: "close" });
  }

  async function handleLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await performProfileLogout(logout, closeMenu, () => navigate("/"));
    } catch (error) {
      console.error(error);
      alert("Logout failed");
      setIsLoggingOut(false);
    }
  }

  function renderAvatar(sizeClasses: string) {
    if (showPicture) {
      return (
        <img
          src={profile.picture}
          alt={`${displayName} profile`}
          className={`${sizeClasses} rounded-full object-cover shadow-sm`}
          referrerPolicy="no-referrer"
          onError={() => setAvatarFailed(true)}
        />
      );
    }

    return (
      <span
        className={`${sizeClasses} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 font-semibold text-white shadow-sm`}
        aria-hidden="true"
      >
        {initials || <User className="h-5 w-5" />}
      </span>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={state.isOpen}
        aria-controls={menuId}
        onClick={() => dispatch({ type: "toggle" })}
        onKeyDown={handleTriggerKeyDown}
        className="flex min-h-12 max-w-[15rem] items-center gap-2 rounded-2xl px-2 py-1.5 text-left outline-none transition hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:gap-3 sm:px-3"
      >
        <span className="relative shrink-0">
          {renderAvatar("h-10 w-10 sm:h-11 sm:w-11")}
          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
        </span>

        <span className="hidden min-w-0 md:block">
          <span className="block truncate font-semibold text-slate-900">
            {displayName}
          </span>
          <span className="block truncate text-xs text-slate-500">
            {profile.email}
          </span>
        </span>

        <ChevronDown
          className={`hidden h-4 w-4 shrink-0 text-slate-400 transition-transform sm:block ${
            state.isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      <div
        id={menuId}
        role="menu"
        aria-label="Profile menu"
        aria-hidden={!state.isOpen}
        className={`absolute top-[calc(100%+0.75rem)] z-[100] origin-top-right overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10 transition duration-150 ${profileDropdownViewportClasses} ${
          state.isOpen
            ? "visible scale-100 opacity-100"
            : "invisible scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 px-3 py-3">
          {renderAvatar("h-12 w-12")}
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900">
              {displayName}
            </p>
            <p className="truncate text-sm text-slate-500">
              {profile.email}
            </p>
          </div>
        </div>

        <div className="mt-1 space-y-1 border-t border-slate-100 pt-2">
          {profileMenuLinks.map((item, index) => (
            <ProfileDropdownItem
              key={item.path}
              itemRef={(element) => {
                itemRefs.current[index] = element;
              }}
              icon={menuIcons[index]}
              label={item.label}
              to={item.path}
              onSelect={closeMenu}
              onKeyDown={handleItemKeyDown}
            />
          ))}
        </div>

        <div className="mt-2 border-t border-slate-200 pt-2">
          <ProfileDropdownItem
            itemRef={(element) => {
              itemRefs.current[menuItemCount - 1] = element;
            }}
            icon={LogOut}
            label={isLoggingOut ? "Logging out…" : "Logout"}
            destructive
            disabled={isLoggingOut}
            onSelect={() => void handleLogout()}
            onKeyDown={handleItemKeyDown}
          />
        </div>
      </div>
    </div>
  );
}
