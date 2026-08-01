import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) => readFileSync(path, "utf8");

test("score labels wrap and score icon tiles use consistent dark theme tones", () => {
  const scoreCard = read("src/components/results/ScoreCard.tsx");
  const scoreOverview = read("src/components/results/ScoreOverview.tsx");

  assert.match(scoreOverview, /label="Technical knowledge"/);
  assert.doesNotMatch(scoreCard, /\btruncate\b|\bwhitespace-nowrap\b|\btext-ellipsis\b/);
  assert.match(scoreCard, /min-h-10/);
  assert.match(scoreCard, /whitespace-normal/);
  for (const tone of ["blue", "teal", "amber", "violet"]) {
    assert.match(scoreCard, new RegExp(`dark:bg-${tone}-950\\/70`));
  }
});

test("feedback summary cards use readable semantic dark surfaces", () => {
  const strengths = read("src/components/results/StrengthsCard.tsx");
  const improvements = read("src/components/results/ImprovementsCard.tsx");

  assert.match(strengths, /dark:bg-emerald-950\/40/);
  assert.match(strengths, /dark:border-emerald-800\/70/);
  assert.match(strengths, /dark:text-slate-200/);
  assert.match(improvements, /dark:bg-amber-950\/35/);
  assert.match(improvements, /dark:border-amber-800\/70/);
  assert.match(improvements, /dark:text-slate-200/);
});

test("fresh and historical results share a theme-aware results composition", () => {
  const page = read("src/pages/Results/ResultsPage.tsx");
  const hero = read("src/components/results/ResultsHero.tsx");
  const questionCard = read("src/components/results/QuestionFeedbackCard.tsx");

  for (const component of ["ResultsHero", "ScoreOverview", "FeedbackSummary", "QuestionFeedbackList", "ResultsActions"]) {
    assert.match(page, new RegExp(`<${component}`));
  }
  assert.match(page, /dark:bg-slate-950/);
  assert.match(page, /historical\.status === "success"/);
  assert.match(page, /: freshResult/);
  assert.match(hero, /from-blue-100 via-blue-50 to-indigo-100/);
  assert.match(hero, /dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950/);
  assert.match(hero, /border-blue-200\/80/);
  assert.match(hero, /dark:bg-slate-900\/70/);
  assert.match(hero, /break-words/);
  assert.match(questionCard, /dark:bg-slate-900/);
  assert.match(questionCard, /dark:text-slate-300/);
});
