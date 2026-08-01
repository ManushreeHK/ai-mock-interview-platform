import assert from "node:assert/strict";
import test from "node:test";
import type { InterviewHistoryItem } from "../src/types/interview-history.ts";
import {
  getInterviewHistoryDetailPath,
  parseHistoryItem,
  parseSavedInterviewResult,
} from "../src/utils/interviewHistoryValidation.ts";
import {
  appendUniqueHistoryItems,
  applyHistoryView,
  getLoadedHistorySummary,
  initialHistoryFilters,
} from "../src/utils/interviewHistoryView.ts";

const now = new Date("2026-08-01T12:00:00.000Z");
const id =
  "2026-08-01T12:00:00.000Z#550e8400-e29b-41d4-a716-446655440000";

function item(
  interviewId: string,
  role: string,
  score: number,
  createdAt: string,
  overrides: Partial<InterviewHistoryItem> = {}
): InterviewHistoryItem {
  return {
    interviewId,
    role,
    overallScore: score,
    createdAt,
    interviewType: "Technical",
    difficulty: "Medium",
    communication: 8,
    technicalKnowledge: 8,
    confidence: 8,
    status: "completed",
    ...overrides,
  };
}

const records = [
  item(id, "Backend Developer", 9, "2026-08-01T12:00:00.000Z"),
  item("older", "Frontend Developer", 6, "2026-07-20T12:00:00.000Z", {
    difficulty: "Easy",
  }),
  item("oldest", "Data Engineer", 8, "2026-06-01T12:00:00.000Z", {
    interviewType: "Data",
    difficulty: "Hard",
  }),
];

test("empty history produces a real zero summary and empty list", () => {
  assert.deepEqual(getLoadedHistorySummary([]), {
    total: 0,
    averageScore: 0,
    bestScore: 0,
    latestDate: null,
  });
  assert.deepEqual(
    applyHistoryView([], "", initialHistoryFilters, "newest", now),
    []
  );
});

test("loaded history renders in newest-first order by default", () => {
  const visible = applyHistoryView(
    records,
    "",
    initialHistoryFilters,
    "newest",
    now
  );
  assert.deepEqual(
    visible.map((entry) => entry.role),
    ["Backend Developer", "Frontend Developer", "Data Engineer"]
  );
});

test("search is case-insensitive across supported summary fields", () => {
  const visible = applyHistoryView(
    records,
    "backend",
    initialHistoryFilters,
    "newest",
    now
  );
  assert.deepEqual(visible.map((entry) => entry.role), ["Backend Developer"]);
});

test("filters combine role, type, difficulty, score, and date", () => {
  const visible = applyHistoryView(
    records,
    "",
    {
      role: "Backend Developer",
      interviewType: "Technical",
      difficulty: "Medium",
      scoreRange: "9-10",
      recentPeriod: "7",
    },
    "newest",
    now
  );
  assert.deepEqual(visible.map((entry) => entry.interviewId), [id]);
});

test("sorting supports oldest, highest, and lowest", () => {
  assert.equal(
    applyHistoryView(records, "", initialHistoryFilters, "oldest", now)[0]
      .interviewId,
    "oldest"
  );
  assert.equal(
    applyHistoryView(records, "", initialHistoryFilters, "highest", now)[0]
      .overallScore,
    9
  );
  assert.equal(
    applyHistoryView(records, "", initialHistoryFilters, "lowest", now)[0]
      .overallScore,
    6
  );
});

test("clear filters model restores every filter to all", () => {
  assert.deepEqual(initialHistoryFilters, {
    role: "all",
    interviewType: "all",
    difficulty: "all",
    scoreRange: "all",
    recentPeriod: "all",
  });
});

test("load more appends records without duplicate interview IDs", () => {
  const result = appendUniqueHistoryItems(records.slice(0, 1), [
    records[0],
    records[1],
  ]);
  assert.deepEqual(
    result.map((entry) => entry.interviewId),
    [id, "older"]
  );
});

test("detail parser accepts a complete saved result for route refresh", () => {
  const result = parseSavedInterviewResult({
    userId: "user",
    interviewId: id,
    type: "Technical",
    role: "Backend Developer",
    experience: "3-5 Years",
    difficulty: "Medium",
    language: "TypeScript",
    questions: ["Question"],
    answers: ["Answer"],
    evaluation: {
      overallScore: 9,
      communication: 8,
      technicalKnowledge: 9,
      confidence: 8,
      strengths: ["Clear"],
      weaknesses: ["More detail"],
      questionEvaluation: [
        { question: "Question", score: 9, feedback: "Good" },
      ],
    },
    status: "completed",
    createdAt: "2026-08-01T12:00:00.000Z",
  });
  assert.equal(result?.interviewId, id);
  assert.equal(result?.evaluation.questionEvaluation[0].score, 9);
  assert.equal(
    getInterviewHistoryDetailPath(id),
    `/interview/history/${encodeURIComponent(id)}`
  );
});

test("malformed summary and detail records are rejected safely", () => {
  assert.equal(parseHistoryItem({ ...records[0], overallScore: 14 }), null);
  assert.equal(
    parseSavedInterviewResult({
      userId: "user",
      interviewId: id,
      createdAt: "invalid",
    }),
    null
  );
});
