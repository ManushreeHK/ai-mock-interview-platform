export type SignInMethod = "google" | "email" | "unknown";

export const subscriptionPlans = [
  { name: "Free", status: "Current Plan", features: ["AI mock interviews", "AI feedback", "Interview history", "Dashboard analytics"] },
  { name: "Pro", status: "Coming Soon", features: ["Advanced analytics", "More interview modes", "PDF reports", "Personalized improvement plans", "Priority processing"] },
  { name: "Premium", status: "Coming Soon", features: ["Resume analysis", "Coding interviews", "Advanced coaching", "Early feature access"] },
] as const;

export const DISPLAY_NAME_MAX_LENGTH = 60;

export function validateDisplayName(value: string) {
  const name = value.trim().replace(/\s+/g, " ");
  if (!name) return { name, error: "Display name is required." };
  if (name.length > DISPLAY_NAME_MAX_LENGTH) {
    return {
      name,
      error: `Display name must be ${DISPLAY_NAME_MAX_LENGTH} characters or fewer.`,
    };
  }
  return { name, error: "" };
}

function parseIdentities(value: unknown): unknown[] | null {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return value === undefined ? [] : null;
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function determineSignInMethod(
  idTokenPayload: Record<string, unknown>
): SignInMethod {
  const identities = parseIdentities(idTokenPayload.identities);
  if (identities === null) return "unknown";

  for (const identity of identities) {
    if (typeof identity !== "object" || identity === null) continue;
    const record = identity as Record<string, unknown>;
    if (
      record.providerName === "Google" ||
      record.providerType === "Google"
    ) {
      return "google";
    }
  }

  return identities.length === 0 && typeof idTokenPayload.email === "string"
    ? "email"
    : "unknown";
}

export async function performDisplayNameUpdate(
  value: string,
  updateAttribute: (name: string) => Promise<void>,
  forceTokenRefresh: () => Promise<void>,
  refreshProfile: () => Promise<boolean>
) {
  const validation = validateDisplayName(value);
  if (validation.error) throw new Error(validation.error);

  await updateAttribute(validation.name);
  await forceTokenRefresh();
  if (!(await refreshProfile())) {
    throw new Error("Your profile could not be refreshed.");
  }
  return validation.name;
}

export function countInterviewsThisMonth(
  createdDates: string[],
  now = new Date()
) {
  return createdDates.filter((value) => {
    const date = new Date(value);
    return (
      Number.isFinite(date.getTime()) &&
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth()
    );
  }).length;
}
