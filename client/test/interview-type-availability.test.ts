import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { isInterviewTypeAvailable } from "../src/utils/interviewTypeAvailability.ts";

const read = (path: string) => readFileSync(path, "utf8");

test("only Technical is available in v1", () => {
  assert.equal(isInterviewTypeAvailable("technical"), true);
  assert.equal(isInterviewTypeAvailable("behavioral"), false);
  assert.equal(isInterviewTypeAvailable("coding"), false);
});

test("New Interview defaults to Technical and keeps its summary fixed", () => {
  const page = read("src/pages/CreateInterview/CreateInterviewPage.tsx");

  assert.match(page, /useState<string>\("technical"\)/);
  assert.match(page, /Create Your Technical Interview/);
  assert.match(page, /label="Interview"[\s\S]*value="Technical"/);
});

test("cards clearly communicate Available and Coming Soon states", () => {
  const selector = read("src/components/InterviewType.tsx");

  assert.match(selector, /available \? "Available" : "Coming Soon"/);
  assert.match(selector, /aria-disabled={!available}/);
  assert.match(selector, /aria-label={`\$\{type\.title}/);
  assert.match(selector, /cursor-not-allowed/);
  assert.match(selector, /dark:bg-slate-900\/60/);
});

test("unavailable activation shows the matching accessible message without changing selection", () => {
  const selector = read("src/components/InterviewType.tsx");

  assert.match(selector, /Behavioral Interviews are coming soon/);
  assert.match(selector, /Coding Interviews are coming soon/);
  assert.match(selector, /if \(isInterviewTypeAvailable\(type\)\)/);
  assert.match(selector, /setNoticeType\(type\)/);
  assert.doesNotMatch(selector, /onChange\(type\)/);
  assert.match(selector, /role="dialog"/);
  assert.match(selector, /aria-modal="true"/);
});

test("dialog supports Escape, restores focus, and continues with Technical", () => {
  const selector = read("src/components/InterviewType.tsx");

  assert.match(selector, /event\.key !== "Escape"/);
  assert.match(selector, /triggerRef\.current\?\.focus\(\)/);
  assert.match(selector, /onChange\("technical"\)/);
  assert.match(selector, /Continue with Technical Interview/);
  assert.match(selector, /focus-visible:ring-2/);
});
