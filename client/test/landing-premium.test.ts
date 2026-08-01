import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) => readFileSync(path, "utf8");

test("landing hero keeps auth routing and uses layered theme-aware visuals", () => {
  const hero = read("src/components/landing/HeroSection.tsx");

  assert.match(hero, /status === "authenticated" \? "\/create-interview" : "\/login"/);
  assert.match(hero, /radial-gradient/);
  assert.match(hero, /dark:bg-\[#050816\]/);
  assert.match(hero, /from-blue-600 to-indigo-600/);
  assert.match(hero, /prefers-reduced-motion|motion-safe:/);
});

test("hero preview is a responsive glass app window with decorative status cards", () => {
  const preview = read("src/components/landing/HeroPreview.tsx");

  assert.match(preview, /backdrop-blur-2xl/);
  assert.match(preview, /shadow-\[0_32px_100px/);
  assert.match(preview, /AI Feedback ready/);
  assert.match(preview, /Voice answer captured/);
  assert.match(preview, /aria-hidden="true"/);
});

test("trust band and proof points render immediately after the hero", () => {
  const page = read("src/pages/Landing/LandingPage.tsx");
  const trusted = read("src/components/landing/TrustedFor.tsx");

  assert.ok(page.indexOf("<HeroSection") < page.indexOf("<TrustedFor"));
  for (const company of ["Google", "Amazon", "Microsoft", "Meta", "Stripe"]) {
    assert.match(trusted, new RegExp(company));
  }
  for (const proof of ["10k+", "95%", "4.9★", "Voice + Feedback"]) {
    assert.match(trusted, new RegExp(proof.replace("+", "\\+")));
  }
});

test("feature cards use responsive premium light and dark surfaces", () => {
  const features = read("src/components/landing/FeaturesSection.tsx");

  assert.match(features, /md:grid-cols-2 lg:grid-cols-3/);
  assert.match(features, /hover:-translate-y-1\.5/);
  assert.match(features, /dark:bg-slate-900\/65/);
  assert.match(features, /group-hover:from-blue-50\/60/);
});
