import type {
  InterviewHistoryItem,
  InterviewHistoryPage,
} from "../models/interview-result.js";
import {
  getInterviewResultsByUser,
  type InterviewHistoryCursor,
} from "../repositories/interview-result.repository.js";
import { validateScore } from "./score-validator.js";

export class InvalidHistoryRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidHistoryRequestError";
  }
}

export class HistoryUnavailableError extends Error {
  constructor(options?: ErrorOptions) {
    super("Interview history is temporarily unavailable.", options);
    this.name = "HistoryUnavailableError";
  }
}

type HistoryRepository = typeof getInterviewResultsByUser;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function decodeCursor(
  token: string | undefined,
  userId: string
): InterviewHistoryCursor | undefined {
  if (!token) return undefined;

  try {
    const value: unknown = JSON.parse(
      Buffer.from(token, "base64url").toString("utf8")
    );

    if (
      !isRecord(value) ||
      value.userId !== userId ||
      typeof value.interviewId !== "string"
    ) {
      throw new Error("Invalid cursor shape.");
    }

    return { userId, interviewId: value.interviewId };
  } catch {
    throw new InvalidHistoryRequestError("Invalid nextToken.");
  }
}

function encodeCursor(cursor: InterviewHistoryCursor | undefined) {
  return cursor
    ? Buffer.from(JSON.stringify(cursor), "utf8").toString("base64url")
    : null;
}

function normalizeHistoryItem(value: unknown): InterviewHistoryItem | null {
  if (
    !isRecord(value) ||
    typeof value.interviewId !== "string" ||
    typeof value.createdAt !== "string" ||
    !Number.isFinite(Date.parse(value.createdAt)) ||
    typeof value.role !== "string" ||
    typeof value.type !== "string" ||
    typeof value.difficulty !== "string" ||
    value.status !== "completed" ||
    !isRecord(value.evaluation)
  ) {
    return null;
  }

  try {
    return {
      interviewId: value.interviewId,
      createdAt: value.createdAt,
      role: value.role,
      interviewType: value.type,
      difficulty: value.difficulty,
      overallScore: validateScore(
        value.evaluation.overallScore,
        "overallScore"
      ),
      communication: validateScore(
        value.evaluation.communication,
        "communication"
      ),
      technicalKnowledge: validateScore(
        value.evaluation.technicalKnowledge,
        "technicalKnowledge"
      ),
      confidence: validateScore(
        value.evaluation.confidence,
        "confidence"
      ),
      status: "completed",
    };
  } catch {
    return null;
  }
}

export async function getInterviewHistory(
  userId: string,
  limit: number,
  nextToken?: string,
  repository: HistoryRepository = getInterviewResultsByUser
): Promise<InterviewHistoryPage> {
  const cursor = decodeCursor(nextToken, userId);

  try {
    const result = await repository(userId, limit, cursor);
    const items = result.items
      .map(normalizeHistoryItem)
      .filter((item): item is InterviewHistoryItem => item !== null);
    const ignoredRecords = result.items.length - items.length;

    if (ignoredRecords > 0) {
      console.warn(
        JSON.stringify({
          stage: "history_normalization",
          ignoredRecords,
        })
      );
    }

    return {
      items,
      nextToken: encodeCursor(result.lastEvaluatedKey),
    };
  } catch (error) {
    if (error instanceof InvalidHistoryRequestError) throw error;
    throw new HistoryUnavailableError({ cause: error });
  }
}
