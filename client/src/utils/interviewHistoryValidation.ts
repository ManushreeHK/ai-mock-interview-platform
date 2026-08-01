import type {
  InterviewHistoryItem,
  InterviewHistoryPage,
} from "../types/interview-history";
import type { SavedInterviewResult } from "../types/evaluation";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isScore(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 10
  );
}

export function parseHistoryItem(value: unknown): InterviewHistoryItem | null {
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

export function parseHistoryPage(value: unknown): InterviewHistoryPage {
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

  return {
    items,
    nextToken: typeof value.nextToken === "string" ? value.nextToken : null,
  };
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) &&
    value.every((item) => typeof item === "string");
}

export function parseSavedInterviewResult(
  value: unknown
): SavedInterviewResult | null {
  if (
    !isRecord(value) ||
    typeof value.userId !== "string" ||
    typeof value.interviewId !== "string" ||
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
    !isScore(value.evaluation.overallScore) ||
    !isScore(value.evaluation.communication) ||
    !isScore(value.evaluation.technicalKnowledge) ||
    !isScore(value.evaluation.confidence) ||
    !isStringArray(value.evaluation.strengths) ||
    !isStringArray(value.evaluation.weaknesses) ||
    !Array.isArray(value.evaluation.questionEvaluation)
  ) {
    return null;
  }

  const questionEvaluation = value.evaluation.questionEvaluation.map(
    (item) => {
      if (
        !isRecord(item) ||
        typeof item.question !== "string" ||
        typeof item.feedback !== "string" ||
        !isScore(item.score)
      ) {
        return null;
      }
      return {
        question: item.question,
        score: item.score,
        feedback: item.feedback,
      };
    }
  );
  if (questionEvaluation.some((item) => item === null)) return null;

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
      overallScore: value.evaluation.overallScore,
      communication: value.evaluation.communication,
      technicalKnowledge: value.evaluation.technicalKnowledge,
      confidence: value.evaluation.confidence,
      strengths: value.evaluation.strengths,
      weaknesses: value.evaluation.weaknesses,
      questionEvaluation: questionEvaluation.filter(
        (item): item is NonNullable<typeof item> => item !== null
      ),
    },
    status: "completed",
    createdAt: value.createdAt,
  };
}

export function getInterviewHistoryDetailPath(interviewId: string) {
  return `/interview/history/${encodeURIComponent(interviewId)}`;
}
