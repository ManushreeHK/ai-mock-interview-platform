import api from "./api";
import type {
  InterviewHistoryItem,
  InterviewHistoryPage,
} from "../types/interview-history";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isScore(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 10
  );
}

function parseHistoryItem(value: unknown): InterviewHistoryItem | null {
  if (
    !isRecord(value) ||
    typeof value.interviewId !== "string" ||
    typeof value.createdAt !== "string" ||
    !Number.isFinite(Date.parse(value.createdAt)) ||
    typeof value.role !== "string" ||
    typeof value.interviewType !== "string" ||
    typeof value.difficulty !== "string" ||
    value.status !== "completed" ||
    !isScore(value.overallScore) ||
    !isScore(value.communication) ||
    !isScore(value.technicalKnowledge) ||
    !isScore(value.confidence)
  ) {
    return null;
  }

  return {
    interviewId: value.interviewId,
    createdAt: value.createdAt,
    role: value.role,
    interviewType: value.interviewType,
    difficulty: value.difficulty,
    overallScore: value.overallScore,
    communication: value.communication,
    technicalKnowledge: value.technicalKnowledge,
    confidence: value.confidence,
    status: "completed",
  };
}

function parseHistoryPage(value: unknown): InterviewHistoryPage {
  if (
    !isRecord(value) ||
    !Array.isArray(value.items) ||
    !(value.nextToken === null || typeof value.nextToken === "string")
  ) {
    throw new Error("Invalid interview history response.");
  }

  const items = value.items
    .map(parseHistoryItem)
    .filter((item): item is InterviewHistoryItem => item !== null);
  const ignoredRecords = value.items.length - items.length;

  if (ignoredRecords > 0) {
    console.warn("Ignored malformed interview history records.", {
      ignoredRecords,
    });
  }

  const nextToken =
    typeof value.nextToken === "string" ? value.nextToken : null;
  return { items, nextToken };
}

let inFlightHistoryRequest: Promise<InterviewHistoryItem[]> | null = null;

async function loadAllInterviewHistory() {
  const items: InterviewHistoryItem[] = [];
  const seenTokens = new Set<string>();
  let nextToken: string | null = null;

  do {
    const response = await api.get<unknown>("/interview/history", {
      params: { limit: 100, ...(nextToken ? { nextToken } : {}) },
    });
    const page = parseHistoryPage(response.data);
    items.push(...page.items);

    if (page.nextToken && seenTokens.has(page.nextToken)) {
      throw new Error("Interview history pagination repeated a token.");
    }
    if (page.nextToken) seenTokens.add(page.nextToken);
    nextToken = page.nextToken;
  } while (nextToken);

  return items.sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
  );
}

export function fetchInterviewHistory() {
  if (!inFlightHistoryRequest) {
    inFlightHistoryRequest = loadAllInterviewHistory().finally(() => {
      inFlightHistoryRequest = null;
    });
  }

  return inFlightHistoryRequest;
}
