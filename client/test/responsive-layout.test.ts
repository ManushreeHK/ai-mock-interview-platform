import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) => readFileSync(path, "utf8");

test("authenticated shell uses an accessible mobile drawer", () => {
  const layout = read("src/components/layout/AppLayout.tsx");
  const sidebar = read("src/components/layout/Sidebar.tsx");
  const header = read("src/components/layout/Header.tsx");

  assert.match(header, /aria-label="Open navigation"/);
  assert.match(header, /aria-controls="app-sidebar"/);
  assert.doesNotMatch(header, /Search dashboard|Notifications|\bBell\b|\bSearch\b/);
  assert.match(header, /<ProfileDropdown \/>/);
  assert.match(sidebar, /id="app-sidebar"/);
  assert.match(sidebar, /-translate-x-full/);
  assert.match(sidebar, /lg:translate-x-0/);
  assert.match(sidebar, /onClick={onClose}/);
  assert.match(layout, /location\.pathname/);
  assert.match(layout, /event\.key === "Escape"/);
  assert.match(layout, /document\.body\.style\.overflow = "hidden"/);
});

test("dashboard and history avoid narrow-screen clipping", () => {
  const dashboard = read("src/pages/Dashboard/DashboardPage.tsx");
  const welcome = read("src/components/dashboard/WelcomeBanner.tsx");
  const recent = read("src/components/dashboard/InterviewCard.tsx");
  const history = read("src/pages/History/HistoryPage.tsx");
  const historyCard = read("src/components/history/HistoryCard.tsx");

  assert.match(dashboard, /lg:grid-cols-3/);
  assert.match(dashboard, /xl:grid-cols-5/);
  assert.match(welcome, /w-full[\s\S]*sm:w-auto/);
  assert.doesNotMatch(recent, /\btruncate\b/);
  assert.match(history, /grid grid-cols-2/);
  assert.match(historyCard, /break-words/);
  assert.match(historyCard, /min-\[390px\]:flex-row/);
});

test("active interview controls and content adapt at narrow widths", () => {
  const page = read("src/pages/Interview/InterviewPage.tsx");
  const question = read("src/components/interview/QuestionCard.tsx");
  const recording = read("src/components/interview/RecordingSection.tsx");
  const navigation = read("src/components/interview/InterviewNavigation.tsx");

  assert.match(page, /px-3 py-4/);
  assert.match(page, /flex-col[\s\S]*sm:flex-row/);
  assert.match(question, /break-words/);
  assert.match(recording, /resize-y/);
  assert.match(recording, /w-full sm:w-auto/);
  assert.match(navigation, /grid-cols-1/);
  assert.match(navigation, /min-\[390px\]:grid-cols-2/);
});

test("auth, results, and create-interview layouts are viewport-safe", () => {
  for (const page of ["Login/LoginPage.tsx", "Signup/SignupPage.tsx", "VerifyEmail/VerifyEmailPage.tsx"]) {
    const source = read(`src/pages/${page}`);
    assert.match(source, /w-full max-w-96/);
    assert.match(source, /px-4 py-8/);
  }

  const create = read("src/pages/CreateInterview/CreateInterviewPage.tsx");
  const resultsHero = read("src/components/results/ResultsHero.tsx");
  const questionFeedback = read("src/components/results/QuestionFeedbackCard.tsx");
  assert.match(create, /xl:sticky xl:top-8/);
  assert.match(create, /flex flex-wrap gap-3/);
  assert.match(resultsHero, /text-2xl[\s\S]*sm:text-4xl/);
  assert.match(questionFeedback, /flex-col[\s\S]*sm:flex-row/);
});
