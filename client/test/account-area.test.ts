import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  countInterviewsThisMonth,
  determineSignInMethod,
  performDisplayNameUpdate,
  subscriptionPlans,
  validateDisplayName,
} from "../src/utils/account.ts";
import { getProfileInitials } from "../src/utils/profileDropdown.ts";
import {
  applySettingsToDocument,
  applyResolvedTheme,
  defaultSettings,
  getSystemPrefersDark,
  loadSettings,
  persistSettings,
  resetSettings,
  SETTINGS_STORAGE_KEY,
  subscribeToSystemTheme,
} from "../src/utils/settings.ts";
import { faqItems, toggleFaq } from "../src/utils/help.ts";
import {
  getSidebarThemeLabel,
  isSidebarThemeSelected,
  selectSidebarTheme,
  sidebarThemePreferences,
} from "../src/utils/sidebarTheme.ts";

function memoryStorage(initial?: string) {
  const values = new Map<string, string>();
  if (initial !== undefined) values.set(SETTINGS_STORAGE_KEY, initial);
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  };
}

test("profile validation trims names and rejects invalid values", () => {
  assert.deepEqual(validateDisplayName("  Ada   Lovelace  "), {
    name: "Ada Lovelace",
    error: "",
  });
  assert.ok(validateDisplayName("   ").error);
  assert.ok(validateDisplayName("x".repeat(61)).error);
});

test("profile update persists then refreshes the normalized profile", async () => {
  const events: string[] = [];
  const result = await performDisplayNameUpdate(
    " Grace Hopper ",
    async (name) => events.push(`update:${name}`),
    async () => events.push("force-refresh"),
    async () => {
      events.push("profile-refresh");
      return true;
    }
  );
  assert.equal(result, "Grace Hopper");
  assert.deepEqual(events, [
    "update:Grace Hopper",
    "force-refresh",
    "profile-refresh",
  ]);
});

test("failed profile update does not continue to token refresh", async () => {
  const events: string[] = [];
  await assert.rejects(
    performDisplayNameUpdate(
      "Ada",
      async () => {
        events.push("update");
        throw new Error("simulated failure");
      },
      async () => events.push("force-refresh"),
      async () => true
    )
  );
  assert.deepEqual(events, ["update"]);
});

test("profile display supports avatars and safe initials fallback", () => {
  assert.equal(getProfileInitials("Ada Lovelace"), "AL");
  assert.equal(getProfileInitials("Prince"), "PR");
});

test("sign-in method safely distinguishes Google and email accounts", () => {
  assert.equal(
    determineSignInMethod({
      email: "person@example.com",
      identities: [{ providerName: "Google" }],
    }),
    "google"
  );
  assert.equal(determineSignInMethod({ email: "person@example.com" }), "email");
  assert.equal(determineSignInMethod({ identities: "malformed" }), "unknown");
});

test("settings load defaults and recover from malformed storage", () => {
  assert.deepEqual(loadSettings(memoryStorage()), defaultSettings);
  assert.deepEqual(loadSettings(memoryStorage("not-json")), defaultSettings);
  assert.deepEqual(loadSettings(memoryStorage('{"appearance":"neon"}')), {
    ...defaultSettings,
  });
});

test("settings persist, load, and reset under the versioned key", () => {
  const storage = memoryStorage();
  const changed = { ...defaultSettings, appearance: "dark" as const };
  persistSettings(changed, storage);
  assert.deepEqual(loadSettings(storage), changed);
  assert.deepEqual(resetSettings(storage), defaultSettings);
  assert.deepEqual(loadSettings(storage), defaultSettings);
});

test("theme and reduced-motion settings apply immediately", () => {
  const classes = new Set<string>();
  const root = {
    classList: {
      toggle(name: string, force?: boolean) {
        if (force) classes.add(name);
        else classes.delete(name);
        return Boolean(force);
      },
    },
    dataset: {} as DOMStringMap,
    style: { colorScheme: "" } as CSSStyleDeclaration,
  };
  applySettingsToDocument(
    { ...defaultSettings, appearance: "dark", reducedMotion: true },
    root,
    false
  );
  assert.ok(classes.has("dark"));
  assert.ok(classes.has("reduce-motion"));
  assert.equal(root.dataset.theme, "dark");
});

test("light, dark, and system preferences resolve and update color scheme", () => {
  const classes = new Set<string>();
  const root = {
    classList: {
      toggle(name: string, force?: boolean) {
        if (force) classes.add(name); else classes.delete(name);
        return Boolean(force);
      },
    },
    dataset: {} as DOMStringMap,
    style: { colorScheme: "" } as CSSStyleDeclaration,
  };
  applyResolvedTheme(true, root);
  assert.ok(classes.has("dark"));
  assert.equal(root.style.colorScheme, "dark");
  applyResolvedTheme(false, root);
  assert.ok(!classes.has("dark"));
  assert.equal(root.style.colorScheme, "light");
  assert.equal(getSystemPrefersDark(() => ({ matches: true }) as MediaQueryList), true);
  assert.equal(getSystemPrefersDark(undefined), false);
});

test("OS theme changes are observed only for System and listeners are cleaned up", () => {
  let listener: ((event: MediaQueryListEvent) => void) | undefined;
  let removed = false;
  const media = {
    matches: false,
    addEventListener: (_type: string, callback: (event: MediaQueryListEvent) => void) => { listener = callback; },
    removeEventListener: (_type: string, callback: (event: MediaQueryListEvent) => void) => { removed = callback === listener; },
  } as unknown as MediaQueryList;
  const values: boolean[] = [];
  const cleanup = subscribeToSystemTheme("system", (value) => values.push(value), () => media);
  listener?.({ matches: true } as MediaQueryListEvent);
  assert.deepEqual(values, [true]);
  cleanup();
  assert.equal(removed, true);

  listener = undefined;
  subscribeToSystemTheme("light", (value) => values.push(value), () => media);
  assert.equal(listener, undefined);
  subscribeToSystemTheme("dark", (value) => values.push(value), () => media);
  assert.equal(listener, undefined);
});

test("theme-aware application shells and controls are wired to the central provider", () => {
  const main = readFileSync("src/main.tsx", "utf8");
  const header = readFileSync("src/components/layout/Header.tsx", "utf8");
  const sidebar = readFileSync("src/components/layout/Sidebar.tsx", "utf8");
  const dropdown = readFileSync("src/components/profile/ProfileDropdown.tsx", "utf8");
  const settings = readFileSync("src/pages/Settings/SettingsPage.tsx", "utf8");
  assert.match(main, /ThemeProvider/);
  for (const source of [header, sidebar, dropdown]) assert.match(source, /dark:/);
  assert.match(settings, /type="radio"/);
  assert.match(settings, /Following device setting/);
});

test("sidebar theme options select Light, Dark, and System preferences", () => {
  assert.deepEqual(sidebarThemePreferences, ["light", "dark", "system"]);
  for (const preference of sidebarThemePreferences) {
    assert.equal(isSidebarThemeSelected(preference, preference), true);
    assert.equal(
      sidebarThemePreferences.filter((option) =>
        isSidebarThemeSelected(preference, option)
      ).length,
      1
    );
  }
  assert.equal(getSidebarThemeLabel("system", "dark"), "System · Dark");
  assert.equal(getSidebarThemeLabel("system", "light"), "System · Light");
  const selected: string[] = [];
  for (const preference of sidebarThemePreferences) {
    selectSidebarTheme(preference, (value) => selected.push(value));
  }
  assert.deepEqual(selected, ["light", "dark", "system"]);
});

test("sidebar switcher uses the shared provider and accessible real buttons", () => {
  const switcher = readFileSync(
    "src/components/layout/SidebarThemeSwitcher.tsx",
    "utf8"
  );
  const settings = readFileSync("src/pages/Settings/SettingsPage.tsx", "utf8");
  assert.match(switcher, /useTheme\(\)/);
  assert.match(switcher, /selectSidebarTheme\(preference, setThemePreference\)/);
  assert.match(switcher, /type="button"/);
  assert.match(switcher, /aria-label=/);
  assert.match(switcher, /aria-pressed=/);
  assert.match(switcher, /focus-visible:ring/);
  assert.match(settings, /useTheme\(\)/);
});

test("subscription usage is real and plans contain no checkout action", () => {
  assert.equal(
    countInterviewsThisMonth(
      ["2026-08-01T12:00:00.000Z", "2026-07-31T12:00:00.000Z"],
      new Date("2026-08-15T00:00:00.000Z")
    ),
    1
  );
  const source = readFileSync("src/pages/Subscription/SubscriptionPage.tsx", "utf8");
  assert.match(source, /Unlimited during beta/);
  assert.equal(subscriptionPlans[0].status, "Current Plan");
  assert.ok(subscriptionPlans.slice(1).every((plan) => plan.status === "Coming Soon"));
  assert.doesNotMatch(source, /Stripe/i);
  assert.match(source, /type="button" disabled/);
});

test("FAQ toggles accessibly and support actions contain no broken links", () => {
  const first = faqItems[0];
  assert.equal(toggleFaq(null, first.id), first.id);
  assert.equal(toggleFaq(first.id, first.id), null);
  const source = readFileSync("src/pages/Help/HelpPage.tsx", "utf8");
  assert.match(source, /aria-expanded/);
  assert.doesNotMatch(source, /href=|mailto:/);
});

test("account UI never renders raw Cognito identifiers", () => {
  const source = readFileSync("src/pages/Profile/ProfilePage.tsx", "utf8");
  assert.doesNotMatch(source, /profile\.userId|user\.username|google_<|cognito:username/);
  assert.match(source, /read-only/);
});
