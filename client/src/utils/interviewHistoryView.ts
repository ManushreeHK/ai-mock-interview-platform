import type { InterviewHistoryItem } from "../types/interview-history";

export type HistorySort = "newest" | "oldest" | "highest" | "lowest";
export type ScoreRange = "all" | "0-5" | "5-7" | "7-9" | "9-10";
export type RecentPeriod = "all" | "7" | "30" | "90";

export type HistoryFilters = {
  role: string;
  interviewType: string;
  difficulty: string;
  scoreRange: ScoreRange;
  recentPeriod: RecentPeriod;
};

export const initialHistoryFilters: HistoryFilters = {
  role: "all",
  interviewType: "all",
  difficulty: "all",
  scoreRange: "all",
  recentPeriod: "all",
};

export function formatHistoryDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function matchesScoreRange(score: number, range: ScoreRange) {
  switch (range) {
    case "0-5":
      return score < 5;
    case "5-7":
      return score >= 5 && score < 7;
    case "7-9":
      return score >= 7 && score < 9;
    case "9-10":
      return score >= 9 && score <= 10;
    case "all":
      return true;
  }
}

export function applyHistoryView(
  items: InterviewHistoryItem[],
  search: string,
  filters: HistoryFilters,
  sort: HistorySort,
  now = new Date()
) {
  const query = search.trim().toLocaleLowerCase();
  const minimumDate =
    filters.recentPeriod === "all"
      ? null
      : new Date(
          now.getTime() - Number(filters.recentPeriod) * 24 * 60 * 60 * 1000
        );

  return items
    .filter((item) => {
      const searchable = [
        item.role,
        item.interviewType,
        item.difficulty,
        item.status,
        formatHistoryDate(item.createdAt),
      ]
        .join(" ")
        .toLocaleLowerCase();

      return (
        (!query || searchable.includes(query)) &&
        (filters.role === "all" || item.role === filters.role) &&
        (filters.interviewType === "all" ||
          item.interviewType === filters.interviewType) &&
        (filters.difficulty === "all" ||
          item.difficulty === filters.difficulty) &&
        matchesScoreRange(item.overallScore, filters.scoreRange) &&
        (!minimumDate || new Date(item.createdAt) >= minimumDate)
      );
    })
    .sort((left, right) => {
      switch (sort) {
        case "oldest":
          return Date.parse(left.createdAt) - Date.parse(right.createdAt);
        case "highest":
          return right.overallScore - left.overallScore;
        case "lowest":
          return left.overallScore - right.overallScore;
        case "newest":
          return Date.parse(right.createdAt) - Date.parse(left.createdAt);
      }
    });
}

export function uniqueHistoryValues(
  items: InterviewHistoryItem[],
  field: "role" | "interviewType" | "difficulty"
) {
  return [...new Set(items.map((item) => item[field]))].sort((a, b) =>
    a.localeCompare(b)
  );
}

export function appendUniqueHistoryItems(
  current: InterviewHistoryItem[],
  incoming: InterviewHistoryItem[]
) {
  const seen = new Set(current.map((item) => item.interviewId));
  return [
    ...current,
    ...incoming.filter((item) => {
      if (seen.has(item.interviewId)) return false;
      seen.add(item.interviewId);
      return true;
    }),
  ];
}

export function getLoadedHistorySummary(items: InterviewHistoryItem[]) {
  if (items.length === 0) {
    return {
      total: 0,
      averageScore: 0,
      bestScore: 0,
      latestDate: null as string | null,
    };
  }

  return {
    total: items.length,
    averageScore:
      Math.round(
        (items.reduce((sum, item) => sum + item.overallScore, 0) /
          items.length) *
          10
      ) / 10,
    bestScore: Math.max(...items.map((item) => item.overallScore)),
    latestDate: [...items].sort(
      (left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt)
    )[0].createdAt,
  };
}
