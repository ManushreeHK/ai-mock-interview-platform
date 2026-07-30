import { useAuth } from "../auth/useAuth";

export function useCurrentUser() {
  const { profile } = useAuth();

  if (!profile) {
    throw new Error(
      "Authenticated profile is unavailable for the current user."
    );
  }

  return profile;
}
