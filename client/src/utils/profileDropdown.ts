export const profileMenuLinks = [
  { label: "Profile", path: "/profile" },
  { label: "Interview History", path: "/history" },
  { label: "Settings", path: "/settings" },
  { label: "Subscription", path: "/subscription" },
  { label: "Help & Support", path: "/help" },
] as const;

export const profileDropdownViewportClasses =
  "right-0 w-[min(20rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)]";

export type ProfileMenuState = {
  isOpen: boolean;
  activeIndex: number | null;
};

export type ProfileMenuAction =
  | { type: "toggle" }
  | { type: "open"; activeIndex?: number }
  | { type: "close" }
  | { type: "move"; direction: 1 | -1; itemCount: number };

export const initialProfileMenuState: ProfileMenuState = {
  isOpen: false,
  activeIndex: null,
};

export function profileMenuReducer(
  state: ProfileMenuState,
  action: ProfileMenuAction
): ProfileMenuState {
  switch (action.type) {
    case "toggle":
      return state.isOpen
        ? initialProfileMenuState
        : { isOpen: true, activeIndex: null };
    case "open":
      return {
        isOpen: true,
        activeIndex: action.activeIndex ?? null,
      };
    case "close":
      return initialProfileMenuState;
    case "move": {
      if (action.itemCount < 1) return state;
      const current = state.activeIndex ?? (action.direction === 1 ? -1 : 0);
      return {
        isOpen: true,
        activeIndex:
          (current + action.direction + action.itemCount) % action.itemCount,
      };
    }
  }
}

export function getProfileDisplayName(displayName: string, email: string) {
  const normalizedName = displayName.trim();
  if (normalizedName) return normalizedName;

  const emailPrefix = email.split("@")[0]?.trim();
  return emailPrefix || "User";
}

export function getProfileInitials(displayName: string) {
  const parts = displayName
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts.at(-1)?.[0] ?? ""}`.toUpperCase();
}

export async function performProfileLogout(
  signOut: () => Promise<void>,
  close: () => void,
  navigateHome: () => void
) {
  await signOut();
  close();
  navigateHome();
}
