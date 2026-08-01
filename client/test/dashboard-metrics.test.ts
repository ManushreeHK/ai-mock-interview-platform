import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import type { InterviewHistoryItem } from "../src/types/interview-history.ts";
import { calculateDashboardMetrics } from "../src/utils/dashboardMetrics.ts";

const now = new Date(2026, 7, 1, 12);

function item(
  dayOffset: number,
  overallScore: number,
  overrides: Partial<InterviewHistoryItem> = {}
): InterviewHistoryItem {
  const createdAt = new Date(now);
  createdAt.setDate(createdAt.getDate() + dayOffset);

  return {
    interviewId: `${dayOffset}-${overallScore}`,
    createdAt: createdAt.toISOString(),
    role: "Developer",
    interviewType: "Technical",
    difficulty: "Medium",
    overallScore,
    communication: 7,
    technicalKnowledge: 8,
    confidence: 6,
    status: "completed",
    ...overrides,
  };
}

test("calculates total, average, and best score", () => {
  const metrics = calculateDashboardMetrics(
    [item(0, 9), item(-1, 7), item(-2, 8.5)],
    now
  );
  assert.equal(metrics.totalInterviews, 3);
  assert.equal(metrics.averageScore, 8.2);
  assert.equal(metrics.bestScore, 9);
});

test("streak counts consecutive calendar days ending today", () => {
  const metrics = calculateDashboardMetrics(
    [item(0, 8), item(-1, 8), item(-2, 8), item(-4, 8)],
    now
  );
  assert.equal(metrics.currentStreak, 3);
});

test("streak may end yesterday when there is no interview today", () => {
  const metrics = calculateDashboardMetrics(
    [item(-1, 8), item(-2, 8)],
    now
  );
  assert.equal(metrics.currentStreak, 2);
});

test("weekly progress averages each day and leaves missing days null", () => {
  const metrics = calculateDashboardMetrics(
    [item(0, 8), item(0, 10), item(-2, 6)],
    now
  );
  assert.equal(metrics.weeklyProgress.length, 7);
  assert.equal(metrics.weeklyProgress.at(-1)?.score, 9);
  assert.equal(metrics.weeklyProgress.at(-2)?.score, null);
  assert.equal(metrics.weeklyProgress.at(-3)?.score, 6);
  assert.equal(metrics.interviewsThisWeek, 3);
});

test("empty history produces zero metrics and no fabricated scores", () => {
  const metrics = calculateDashboardMetrics([], now);
  assert.equal(metrics.totalInterviews, 0);
  assert.equal(metrics.averageScore, 0);
  assert.equal(metrics.bestScore, 0);
  assert.equal(metrics.currentStreak, 0);
  assert.ok(metrics.weeklyProgress.every((day) => day.score === null));
});

test("malformed score records are ignored", () => {
  const malformed = item(0, 14);
  const metrics = calculateDashboardMetrics([malformed, item(-1, 8)], now);
  assert.equal(metrics.totalInterviews, 1);
  assert.equal(metrics.averageScore, 8);
  assert.equal(metrics.bestScore, 8);
});

test("dashboard redesign keeps real metrics, navigation, and responsive regions", () => {
  const page = readFileSync("src/pages/Dashboard/DashboardPage.tsx", "utf8");
  const welcome = readFileSync("src/components/dashboard/WelcomeBanner.tsx", "utf8");
  const progress = readFileSync("src/components/dashboard/ProgressSummaryCard.tsx", "utf8");
  const stats = readFileSync("src/components/dashboard/StatsGrid.tsx", "utf8");
  const weekly = readFileSync("src/components/dashboard/WeeklyProgress.tsx", "utf8");
  const recent = readFileSync("src/components/dashboard/RecentInterviews.tsx", "utf8");

  assert.match(page, /calculateDashboardMetrics\(history\)/);
  assert.match(page, /lg:grid-cols-3/);
  assert.match(page, /xl:grid-cols-5/);
  for (const section of ["WelcomeBanner", "ProgressSummaryCard", "StatsGrid", "WeeklyProgress", "RecentInterviews"]) {
    assert.match(page, new RegExp(`<${section}`));
  }
  const sectionPositions = ["WelcomeBanner", "ProgressSummaryCard", "StatsGrid", "WeeklyProgress", "RecentInterviews"]
    .map((section) => page.indexOf(`<${section}`));
  assert.deepEqual(sectionPositions, [...sectionPositions].sort((a, b) => a - b));
  for (const legacySection of ["QuickActions", "AIInsights", "Achievements"]) {
    assert.doesNotMatch(page, new RegExp(legacySection));
  }
  assert.match(welcome, /to="\/create-interview"/);
  assert.match(welcome, /to="\/history"/);
  assert.match(welcome, /aria-hidden="true"/);
  assert.doesNotMatch(welcome, /behavioral, and coding/i);
  for (const field of ["totalInterviews", "averageScore", "currentStreak", "bestScore", "interviewsThisWeek"]) {
    assert.match(progress, new RegExp(`metrics\\.${field}`));
  }
  for (const stat of ["Total Interviews", "Average Score", "Best Score", "Current Streak"]) {
    assert.match(stats, new RegExp(`title="${stat}"`));
  }
  assert.match(weekly, /Weekly Progress/);
  assert.match(recent, /Recent Interviews/);
  assert.match(recent, /to="\/history"/);
  assert.match(recent, /View All/);
  assert.match(recent, /interviews\.slice\(0, 4\)/);
  assert.match(recent, /Complete your first interview/);
  assert.doesNotMatch(recent, /question count|duration/i);
});
