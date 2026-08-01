import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import {
  fetchAuthSession,
  getCurrentUser,
} from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { useNavigate } from "react-router-dom";
import {
  AuthContext,
  type AuthProfile,
  type AuthenticatedUser,
  type AuthStatus,
} from "./AuthContext";
import { determineSignInMethod } from "../utils/account";

type AuthProviderProps = {
  children: ReactNode;
};

const CALLBACK_RETRY_COUNT = 20;
const CALLBACK_RETRY_DELAY_MS = 250;

function waitForCallbackProcessing() {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, CALLBACK_RETRY_DELAY_MS);
  });
}

function readStringClaim(
  payload: Record<string, unknown>,
  claim: string
) {
  const value = payload[claim];
  return typeof value === "string" ? value.trim() : "";
}

function createProfile(
  idTokenPayload: Record<string, unknown>
): AuthProfile | null {
  const userId = readStringClaim(idTokenPayload, "sub");

  if (!userId) return null;

  const email = readStringClaim(idTokenPayload, "email");
  const displayName =
    readStringClaim(idTokenPayload, "name") ||
    readStringClaim(idTokenPayload, "given_name") ||
    readStringClaim(idTokenPayload, "preferred_username") ||
    email.split("@")[0] ||
    "User";
  const picture = readStringClaim(idTokenPayload, "picture");

  return {
    userId,
    displayName,
    email,
    signInMethod: determineSignInMethod(idTokenPayload),
    ...(picture ? { picture } : {}),
  };
}

export default function AuthProvider({
  children,
}: AuthProviderProps) {
  const navigate = useNavigate();
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [profile, setProfile] =
    useState<AuthProfile | null>(null);
  const hasRedirectedAfterOAuth = useRef(false);
  const [{ hasOAuthCallback, hasOAuthCallbackError }] = useState(
    () => {
      const parameters = new URLSearchParams(
        window.location.search
      );

      return {
        hasOAuthCallback: parameters.has("code"),
        hasOAuthCallbackError: parameters.has("error"),
      };
    }
  );

  const resolveAuthenticatedSession = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      const hasAccessToken = Boolean(session.tokens?.accessToken);

      if (!hasAccessToken || !session.tokens?.idToken) {
        return false;
      }

      const authenticatedProfile = createProfile(
        session.tokens.idToken.payload
      );

      if (!authenticatedProfile) {
        return false;
      }

      setUser(currentUser);
      setProfile(authenticatedProfile);
      setStatus("authenticated");
      return true;
    } catch {
      return false;
    }
  }, []);

  const refreshAuth = useCallback(async (options?: { showLoading?: boolean }) => {
    if (options?.showLoading !== false) setStatus("loading");

    const authenticated = await resolveAuthenticatedSession();

    if (!authenticated) {
      setUser(null);
      setProfile(null);
      setStatus("unauthenticated");
    }

    return authenticated;
  }, [resolveAuthenticatedSession]);

  const redirectAfterOAuthOnce = useCallback(() => {
    if (hasRedirectedAfterOAuth.current) {
      return;
    }

    hasRedirectedAfterOAuth.current = true;
    navigate("/dashboard", { replace: true });
  }, [navigate]);

  useEffect(() => {
    let active = true;

    const finishRedirectSignIn = async () => {
      const authenticated = await resolveAuthenticatedSession();

      if (active && authenticated) {
        redirectAfterOAuthOnce();
      }
    };

    const stopListening = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signedIn":
          if (hasOAuthCallback) {
            void finishRedirectSignIn();
          } else {
            void resolveAuthenticatedSession();
          }
          break;
        case "signInWithRedirect":
          void finishRedirectSignIn();
          break;
        case "signInWithRedirect_failure":
          setUser(null);
          setProfile(null);
          setStatus("unauthenticated");
          break;
        case "signedOut":
          setUser(null);
          setProfile(null);
          setStatus("unauthenticated");
          navigate("/", { replace: true });
          break;
      }
    });

    const resolveInitialState = async () => {
      if (!hasOAuthCallbackError && hasOAuthCallback) {
        for (
          let attempt = 0;
          attempt < CALLBACK_RETRY_COUNT && active;
          attempt += 1
        ) {
          if (await resolveAuthenticatedSession()) {
            if (active) {
              redirectAfterOAuthOnce();
            }
            return;
          }

          await waitForCallbackProcessing();
        }
      } else if (
        !hasOAuthCallbackError &&
        await resolveAuthenticatedSession()
      ) {
        return;
      }

      if (active) {
        setUser(null);
        setProfile(null);
        setStatus("unauthenticated");
      }
    };

    void resolveInitialState();

    return () => {
      active = false;
      stopListening();
    };
  }, [
    hasOAuthCallback,
    hasOAuthCallbackError,
    navigate,
    redirectAfterOAuthOnce,
    resolveAuthenticatedSession,
  ]);

  const value = useMemo(
    () => ({
      status,
      user,
      profile,
      refreshAuth,
    }),
    [profile, refreshAuth, status, user]
  );

  if (status === "loading") {
    return (
      <AuthContext.Provider value={value}>
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
            <p className="mt-4 font-medium text-slate-600">
              Completing authentication...
            </p>
          </div>
        </div>
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
