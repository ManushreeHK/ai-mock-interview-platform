import assert from "node:assert/strict";
import test from "node:test";
import {
  getProfileDisplayName,
  getProfileInitials,
  initialProfileMenuState,
  performProfileLogout,
  profileDropdownViewportClasses,
  profileMenuLinks,
  profileMenuReducer,
} from "../src/utils/profileDropdown.ts";

test("dropdown opens and toggles closed", () => {
  const opened = profileMenuReducer(initialProfileMenuState, {
    type: "toggle",
  });
  assert.equal(opened.isOpen, true);

  const closed = profileMenuReducer(opened, { type: "toggle" });
  assert.deepEqual(closed, initialProfileMenuState);
});

test("outside click and Escape close through the shared close action", () => {
  const open = { isOpen: true, activeIndex: 2 };
  const outsideClickResult = profileMenuReducer(open, { type: "close" });
  const escapeResult = profileMenuReducer(open, { type: "close" });
  assert.deepEqual(outsideClickResult, initialProfileMenuState);
  assert.deepEqual(escapeResult, initialProfileMenuState);
});

test("keyboard navigation enters and wraps through menu items", () => {
  let state = profileMenuReducer(initialProfileMenuState, {
    type: "open",
    activeIndex: 0,
  });
  assert.equal(state.activeIndex, 0);

  state = profileMenuReducer(state, {
    type: "move",
    direction: -1,
    itemCount: 5,
  });
  assert.equal(state.activeIndex, 4);

  state = profileMenuReducer(state, {
    type: "move",
    direction: 1,
    itemCount: 5,
  });
  assert.equal(state.activeIndex, 0);
});

test("profile display uses normalized name and email fallback", () => {
  assert.equal(getProfileDisplayName("Ada Lovelace", "ada@example.com"), "Ada Lovelace");
  assert.equal(getProfileDisplayName("", "grace@example.com"), "grace");
  assert.equal(getProfileDisplayName("", ""), "User");
});

test("initials fallback supports full names and missing pictures", () => {
  assert.equal(getProfileInitials("Ada Lovelace"), "AL");
  assert.equal(getProfileInitials("Prince"), "PR");
  assert.equal(getProfileInitials(""), "");
});

test("menu routes point to the protected profile pages", () => {
  assert.deepEqual(
    profileMenuLinks.map(({ path }) => path),
    ["/profile", "/history", "/settings", "/subscription", "/help"]
  );
});

test("logout uses existing action, then closes and navigates home", async () => {
  const events: string[] = [];
  await performProfileLogout(
    async () => {
      events.push("signOut");
    },
    () => events.push("close"),
    () => events.push("navigate:/")
  );
  assert.deepEqual(events, ["signOut", "close", "navigate:/"]);
});

test("dropdown width remains constrained to the mobile viewport", () => {
  assert.match(profileDropdownViewportClasses, /100vw-2rem/);
  assert.match(profileDropdownViewportClasses, /right-0/);
});
