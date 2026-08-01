import type {
  InterviewHistoryItem,
  InterviewHistoryPage,
  InterviewResult,
} from "../models/interview-result.js";
import {
  getInterviewResultById,
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

export class InterviewNotFoundError extends Error {
  constructor() {
    super("The interview result was not found.");
    this.name = "InterviewNotFoundError";
  }
}

export class InvalidStoredInterviewError extends Error {
  constructor() {
    super("The stored interview result is invalid.");
    this.name = "InvalidStoredInterviewError";
  }
}

type HistoryRepository = typeof getInterviewResultsByUser;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) &&
    value.every((item) => typeof item === "string");
}

export function isValidInterviewId(value: string) {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z#[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
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

type DetailRepository = typeof getInterviewResultById;

function normalizeInterviewResult(value: unknown): InterviewResult {
  if (
    !isRecord(value) ||
    typeof value.userId !== "string" ||
    typeof value.interviewId !== "string" ||
    !isValidInterviewId(value.interviewId) ||
    typeof value.createdAt !== "string" ||
    !Number.isFinite(Date.parse(value.createdAt)) ||
    typeof value.type !== "string" ||
    typeof value.role !== "string" ||
    typeof value.experience !== "string" ||
    typeof value.difficulty !== "string" ||
    typeof value.language !== "string" ||
    !isStringArray(value.questions) ||
    !isStringArray(value.answers) ||
    value.status !== "completed" ||
    !isRecord(value.evaluation) ||
    !isStringArray(value.evaluation.strengths) ||
    !isStringArray(value.evaluation.weaknesses) ||
    !Array.isArray(value.evaluation.questionEvaluation)
  ) {
    throw new InvalidStoredInterviewError();
  }

  try {
    const questionEvaluation = value.evaluation.questionEvaluation.map(
      (item, index) => {
        if (
          !isRecord(item) ||
          typeof item.question !== "string" ||
          typeof item.feedback !== "string"
        ) {
          throw new InvalidStoredInterviewError();
        }

        return {
          question: item.question,
          score: validateScore(
            item.score,
            `questionEvaluation[${index}].score`
          ),
          feedback: item.feedback,
        };
      }
    );

    return {
      userId: value.userId,
      interviewId: value.interviewId,
      type: value.type,
      role: value.role,
      experience: value.experience,
      difficulty: value.difficulty,
      language: value.language,
      questions: value.questions,
      answers: value.answers,
      evaluation: {
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
        strengths: value.evaluation.strengths,
        weaknesses: value.evaluation.weaknesses,
        questionEvaluation,
      },
      status: "completed",
      createdAt: value.createdAt,
    };
  } catch (error) {
    if (error instanceof InvalidStoredInterviewError) throw error;
    throw new InvalidStoredInterviewError();
  }
}

export async function getInterviewHistoryDetail(
  userId: string,
  interviewId: string,
  repository: DetailRepository = getInterviewResultById
) {
  if (!isValidInterviewId(interviewId)) {
    throw new InterviewNotFoundError();
  }

  let item: unknown;
  try {
    item = await repository(userId, interviewId);
  } catch (error) {
    throw new HistoryUnavailableError({ cause: error });
  }

  if (item === undefined) throw new InterviewNotFoundError();

  const result = normalizeInterviewResult(item);
  if (result.userId !== userId || result.interviewId !== interviewId) {
    throw new InterviewNotFoundError();
  }

  return result;
}
