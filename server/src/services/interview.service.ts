import type {
  InterviewEvaluation,
  QuestionEvaluation,
} from "../models/interview-result.js";
import {
  invalidAiResponseError,
  invalidScoringDataError,
  resultSaveError,
} from "../errors/evaluation.errors.js";
import { saveInterviewResult } from "../repositories/interview-result.repository.js";
import { evaluateInterviewAnswers } from "./gemini.service.js";
import { validateScore } from "./score-validator.js";

export type EvaluateInterviewInput = {
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
): value is Omit<QuestionEvaluation, "score"> & { score: unknown } {
  return isRecord(value) &&
    typeof value.question === "string" &&
    "score" in value &&
    typeof value.feedback === "string";
}

type EvaluationDependencies = {
  evaluateAnswers: typeof evaluateInterviewAnswers;
  saveResult: typeof saveInterviewResult;
};

const defaultDependencies: EvaluationDependencies = {
  evaluateAnswers: evaluateInterviewAnswers,
  saveResult: saveInterviewResult,
};

function parseEvaluation(
  value: string,
  model: string,
  fallback: boolean
): InterviewEvaluation {
  let parsed: unknown;

  try {
    parsed = JSON.parse(value.replace(/```json|```/g, "").trim());
  } catch (error) {
    throw invalidAiResponseError(
      "gemini_response_parsing",
      model,
      fallback,
      error
    );
  }

  if (
    !isRecord(parsed) ||
    !("overallScore" in parsed) ||
    !("communication" in parsed) ||
    !("technicalKnowledge" in parsed) ||
    !("confidence" in parsed) ||
    !isStringArray(parsed.strengths) ||
    !isStringArray(parsed.weaknesses) ||
    !Array.isArray(parsed.questionEvaluation) ||
    !parsed.questionEvaluation.every(isQuestionEvaluation)
  ) {
    throw invalidAiResponseError(
      "evaluation_normalization",
      model,
      fallback
    );
  }

  let overallScore: number;
  let communication: number;
  let technicalKnowledge: number;
  let confidence: number;
  let questionEvaluation: QuestionEvaluation[];

  try {
    overallScore = validateScore(parsed.overallScore, "overallScore");
    communication = validateScore(parsed.communication, "communication");
    technicalKnowledge = validateScore(
      parsed.technicalKnowledge,
      "technicalKnowledge"
    );
    confidence = validateScore(parsed.confidence, "confidence");
    questionEvaluation = parsed.questionEvaluation.map((item, index) => ({
      question: item.question,
      score: validateScore(
        item.score,
        `questionEvaluation[${index}].score`
      ),
      feedback: item.feedback,
    }));
  } catch (error) {
    throw invalidScoringDataError(model, fallback, error);
  }

  return {
    overallScore,
    communication,
    technicalKnowledge,
    confidence,
    strengths: parsed.strengths,
    weaknesses: parsed.weaknesses,
    questionEvaluation,
  };
}

export async function evaluateAndSaveInterview(
  input: EvaluateInterviewInput,
  dependencies: EvaluationDependencies = defaultDependencies
) {
  const generation = await dependencies.evaluateAnswers({
    role: input.role,
    experience: input.experience,
    questions: input.questions,
    answers: input.answers,
  });

  if (!generation.text.trim()) {
    throw invalidAiResponseError(
      "gemini_response_parsing",
      generation.model,
      generation.fallback
    );
  }

  const evaluation = parseEvaluation(
    generation.text,
    generation.model,
    generation.fallback
  );

  try {
    return await dependencies.saveResult({
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
  } catch (error) {
    throw resultSaveError(
      generation.model,
      generation.fallback,
      error
    );
  }
}
