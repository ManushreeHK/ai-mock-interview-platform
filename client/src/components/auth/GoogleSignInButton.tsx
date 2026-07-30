import { useState } from "react";
import { signInWithRedirect } from "aws-amplify/auth";

export default function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      await signInWithRedirect({
        provider: "Google",
        options: {
          prompt: "SELECT_ACCOUNT",
        },
      });
    } catch {
      setError(
        "Google sign-in could not be started. Please try again."
      );
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span
          aria-hidden="true"
          className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-sm font-bold text-blue-600"
        >
          G
        </span>
        {isLoading ? "Connecting to Google..." : "Continue with Google"}
      </button>

      {error && (
        <p
          role="alert"
          className="mt-3 text-center text-sm text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}
