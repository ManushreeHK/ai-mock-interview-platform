import type { InterviewHistoryItem } from "../types/interview-history";

export type WeeklyScore = {
  day: string;
  score: number | null;
};

export type DashboardMetrics = {
  totalInterviews: number;
  interviewsThisWeek: number;
  averageScore: number;
  bestScore: number;
  currentStreak: number;
  weeklyProgress: WeeklyScore[];
  insights: string[];
};

function startOfDay(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function dateKey(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(value: Date, amount: number) {
  const result = new Date(value);
  result.setDate(result.getDate() + amount);
  return result;
}

function average(values: number[]) {
  return values.length === 0
    ? 0
    : values.reduce((sum, value) => sum + value, 0) / values.length;
}

function roundOne(value: number) {
  return Math.round(value * 10) / 10;
}

function hasValidScores(item: InterviewHistoryItem) {
  return [
    item.overallScore,
    item.communication,
    item.technicalKnowledge,
    item.confidence,
  ].every(
    (score) =>
      Number.isFinite(score) && score >= 0 && score <= 10
  );
}

export function calculateDashboardMetrics(
  history: InterviewHistoryItem[],
  now = new Date()
): DashboardMetrics {
  const completed = history
    .filter(
      (item) =>
        item.status === "completed" &&
        Number.isFinite(Date.parse(item.createdAt)) &&
        hasValidScores(item)
    )
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  const today = startOfDay(now);
  const firstWeeklyDay = addDays(today, -6);
  const scoresByDay = new Map<string, number[]>();

  for (const item of completed) {
    const key = dateKey(new Date(item.createdAt));
    const scores = scoresByDay.get(key) ?? [];
    scores.push(item.overallScore);
    scoresByDay.set(key, scores);
  }

  const weeklyProgress = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(firstWeeklyDay, index);
    const scores = scoresByDay.get(dateKey(date)) ?? [];
    return {
      day: date.toLocaleDateString(undefined, { weekday: "short" }),
      score: scores.length > 0 ? roundOne(average(scores)) : null,
    };
  });

  let streakCursor = scoresByDay.has(dateKey(today))
    ? today
    : addDays(today, -1);
  let currentStreak = 0;
  while (scoresByDay.has(dateKey(streakCursor))) {
    currentStreak += 1;
    streakCursor = addDays(streakCursor, -1);
  }

  const categoryAverages = [
    ["communication", average(completed.map((item) => item.communication))],
    [
      "technical knowledge",
      average(completed.map((item) => item.technicalKnowledge)),
    ],
    ["confidence", average(completed.map((item) => item.confidence))],
  ] as const;
  const strongest = [...categoryAverages].sort((a, b) => b[1] - a[1])[0];
  const weakest = [...categoryAverages].sort((a, b) => a[1] - b[1])[0];
  const insights =
    completed.length === 0
      ? ["Complete your first interview to receive personalized insights."]
      : [
          `Your strongest category is ${strongest[0]} at ${roundOne(strongest[1])}/10.`,
          `Focus next on ${weakest[0]}, currently averaging ${roundOne(weakest[1])}/10.`,
        ];

  if (completed.length >= 2) {
    const change = roundOne(
      completed[0].overallScore - completed[1].overallScore
    );
    insights.push(
      change === 0
        ? "Your latest overall score matched your previous interview."
        : `Your latest overall score ${change > 0 ? "improved" : "changed"} by ${Math.abs(change)} points compared with your previous interview.`
    );
  }

  return {
    totalInterviews: completed.length,
    interviewsThisWeek: completed.filter((item) => {
      const completedAt = new Date(item.createdAt);
      return completedAt >= firstWeeklyDay && completedAt < addDays(today, 1);
    }).length,
    averageScore: roundOne(
      average(completed.map((item) => item.overallScore))
    ),
    bestScore:
      completed.length > 0
        ? Math.max(...completed.map((item) => item.overallScore))
        : 0,
    currentStreak,
    weeklyProgress,
    insights,
  };
}
