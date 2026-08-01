import api from "./api";
import type {
  InterviewHistoryItem,
  InterviewHistoryPage,
} from "../types/interview-history";
import type { SavedInterviewResult } from "../types/evaluation";
import {
  getInterviewHistoryDetailPath,
  parseHistoryPage,
  parseSavedInterviewResult,
} from "../utils/interviewHistoryValidation";

let inFlightHistoryRequest: Promise<InterviewHistoryItem[]> | null = null;
const inFlightPages = new Map<string, Promise<InterviewHistoryPage>>();
const inFlightDetails = new Map<
  string,
  Promise<SavedInterviewResult>
>();

export function fetchInterviewHistoryPage(
  limit = 20,
  nextToken?: string
) {
  const key = `${limit}:${nextToken ?? "first"}`;
  const existing = inFlightPages.get(key);
  if (existing) return existing;

  const request = api
    .get<unknown>("/interview/history", {
      params: { limit, ...(nextToken ? { nextToken } : {}) },
    })
    .then((response) => parseHistoryPage(response.data))
    .finally(() => {
      inFlightPages.delete(key);
    });
  inFlightPages.set(key, request);
  return request;
}

async function loadAllInterviewHistory() {
  const items: InterviewHistoryItem[] = [];
  const seenTokens = new Set<string>();
  let nextToken: string | null = null;

  do {
    const page = await fetchInterviewHistoryPage(
      100,
      nextToken ?? undefined
    );
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

export async function fetchInterviewHistoryDetail(interviewId: string) {
  const existing = inFlightDetails.get(interviewId);
  if (existing) return existing;

  const request = api
    .get<unknown>(getInterviewHistoryDetailPath(interviewId))
    .then((response) => {
      if (typeof response.data !== "object" || response.data === null) {
        throw new Error("Invalid interview result response.");
      }
      const result = parseSavedInterviewResult(
        (response.data as Record<string, unknown>).result
      );
      if (!result) throw new Error("Invalid interview result response.");
      return result;
    })
    .finally(() => {
      inFlightDetails.delete(interviewId);
    });
  inFlightDetails.set(interviewId, request);
  return request;
}
