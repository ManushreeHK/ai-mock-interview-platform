import { createContext } from "react";
import type { getCurrentUser } from "aws-amplify/auth";

export type AuthStatus =
  | "loading"
  | "authenticated"
  | "unauthenticated";

export type AuthenticatedUser = Awaited<
  ReturnType<typeof getCurrentUser>
>;

export type AuthProfile = {
  userId: string;
  displayName: string;
  email: string;
  picture?: string;
};

export type AuthContextValue = {
  status: AuthStatus;
  user: AuthenticatedUser | null;
  profile: AuthProfile | null;
  refreshAuth: () => Promise<boolean>;
};

export const AuthContext = createContext<AuthContextValue | null>(
  null
);
