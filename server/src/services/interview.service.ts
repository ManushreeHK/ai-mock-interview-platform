import type {
  InterviewEvaluation,
  QuestionEvaluation,
} from "../models/interview-result.js";
import { saveInterviewResult } from "../repositories/interview-result.repository.js";
import { evaluateInterviewAnswers } from "./gemini.service.js";

type EvaluateInterviewInput = {
  userId: string;
  type: string;
  role: string;
  experience: string;
  difficulty: string;
  language: string;
  questions: string[];
  answers: string[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) &&
    value.every((item) => typeof item === "string");
}

function isQuestionEvaluation(
  value: unknown
): value is QuestionEvaluation {
  return isRecord(value) &&
    typeof value.question === "string" &&
    typeof value.score === "number" &&
    typeof value.feedback === "string";
}

function parseEvaluation(value: string): InterviewEvaluation {
  const parsed: unknown = JSON.parse(
    value.replace(/```json|```/g, "").trim()
  );

  if (
    !isRecord(parsed) ||
    typeof parsed.overallScore !== "number" ||
    typeof parsed.communication !== "number" ||
    typeof parsed.technicalKnowledge !== "number" ||
    typeof parsed.confidence !== "number" ||
    !isStringArray(parsed.strengths) ||
    !isStringArray(parsed.weaknesses) ||
    !Array.isArray(parsed.questionEvaluation) ||
    !parsed.questionEvaluation.every(isQuestionEvaluation)
  ) {
    throw new Error("Gemini returned an invalid evaluation.");
  }

  return {
    overallScore: parsed.overallScore,
    communication: parsed.communication,
    technicalKnowledge: parsed.technicalKnowledge,
    confidence: parsed.confidence,
    strengths: parsed.strengths,
    weaknesses: parsed.weaknesses,
    questionEvaluation: parsed.questionEvaluation,
  };
}

export async function evaluateAndSaveInterview(
  input: EvaluateInterviewInput
) {
  const rawEvaluation = await evaluateInterviewAnswers({
    role: input.role,
    experience: input.experience,
    questions: input.questions,
    answers: input.answers,
  });

  if (!rawEvaluation) {
    throw new Error("Gemini returned an empty evaluation.");
  }

  const evaluation = parseEvaluation(rawEvaluation);

  return saveInterviewResult({
    userId: input.userId,
    type: input.type,
    role: input.role,
    experience: input.experience,
    difficulty: input.difficulty,
    language: input.language,
    questions: input.questions,
    answers: input.answers,
    evaluation,
  });
}
