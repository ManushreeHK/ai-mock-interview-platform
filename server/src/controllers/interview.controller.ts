import { Request, Response } from "express";
import { createHash } from "node:crypto";
import {
  generateInterviewQuestions,
} from "../services/gemini.service.js";
import { AiServiceError } from "../services/gemini-reliability.js";
import {
  evaluateAndSaveInterview,
  type EvaluateInterviewInput,
} from "../services/interview.service.js";
import { runDeduplicated } from "../services/request-deduplication.js";
import { EvaluationStageError } from "../errors/evaluation.errors.js";
import {
  getInterviewHistory,
  HistoryUnavailableError,
  InvalidHistoryRequestError,
} from "../services/interview-history.service.js";

function requestKey(
  userId: string,
  operation: "generate" | "evaluate",
  body: unknown
) {
  const digest = createHash("sha256")
    .update(JSON.stringify(body))
    .digest("hex");
  return `${userId}:${operation}:${digest}`;
}

function sendAiError(res: Response, error: unknown): boolean {
  if (!(error instanceof AiServiceError)) return false;

  res.status(error.statusCode).json({
    error: {
      code: error.code,
      message: error.message,
    },
  });
  return true;
}

export const generateInterview = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      role,
      experience,
      difficulty,
      domain,
      language,
      position,
    } = req.body;

    const prompt = `
Generate 10 interview questions.

Role: ${role}
Experience: ${experience}
Difficulty: ${difficulty}
Domain: ${domain}
Programming Language: ${language}
Position: ${position}

Return only the questions as a numbered list.
`;

    const result = await runDeduplicated(
      requestKey(
        req.authenticatedUser!.sub,
        "generate",
        req.body
      ),
      () => generateInterviewQuestions(prompt)
    );

    res.status(200).json({
      success: true,
      questions: result,
    });
  } catch (error) {
    if (sendAiError(res, error)) return;

    res.status(500).json({
      success: false,
      message: "Failed to generate interview.",
    });
  }
};

type EvaluationOperation = (
  input: EvaluateInterviewInput
) => ReturnType<typeof evaluateAndSaveInterview>;

type EvaluationHttpError = {
  statusCode: 429 | 500 | 502 | 503;
  body: {
    error: {
      code: string;
      message: string;
    };
  };
};

export function getEvaluationHttpError(
  error: unknown
): EvaluationHttpError {
  if (
    error instanceof AiServiceError ||
    error instanceof EvaluationStageError
  ) {
    return {
      statusCode: error.statusCode,
      body: {
        error: {
          code: error.code,
          message: error.message,
        },
      },
    };
  }

  return {
    statusCode: 500,
    body: {
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Unable to evaluate the interview.",
      },
    },
  };
}

function logEvaluationFailure(error: unknown) {
  console.error(
    JSON.stringify({
      stage:
        error instanceof EvaluationStageError
          ? error.stage
          : error instanceof AiServiceError
            ? "gemini_api_request"
            : "evaluation_unknown",
      errorClass:
        error instanceof Error ? error.constructor.name : "UnknownError",
      statusCode: getEvaluationHttpError(error).statusCode,
      model:
        error instanceof AiServiceError ||
        error instanceof EvaluationStageError
          ? error.model
          : null,
      fallback:
        error instanceof AiServiceError ||
        error instanceof EvaluationStageError
          ? error.fallback
          : false,
    })
  );
}

export function createEvaluateInterviewHandler(
  evaluateOperation: EvaluationOperation = evaluateAndSaveInterview,
  logFailure: (error: unknown) => void = logEvaluationFailure
) {
  return async (req: Request, res: Response) => {
  try {
    const {
      type,
      role,
      experience,
      difficulty,
      language,
      questions,
      answers,
    } = req.body;

    const result = await runDeduplicated(
      requestKey(
        req.authenticatedUser!.sub,
        "evaluate",
        req.body
      ),
      () =>
        evaluateOperation({
          userId: req.authenticatedUser!.sub,
          type,
          role,
          experience,
          difficulty,
          language,
          questions,
          answers,
        })
    );

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    logFailure(error);
    const response = getEvaluationHttpError(error);
    res.status(response.statusCode).json(response.body);
  }
  };
}

export const evaluateInterview = createEvaluateInterviewHandler();

type HistoryOperation = typeof getInterviewHistory;

function parseHistoryLimit(value: unknown) {
  if (value === undefined) return 20;
  if (typeof value !== "string" || !/^\d+$/.test(value)) return null;

  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1) return null;

  return Math.min(parsed, 100);
}

export function createGetInterviewHistoryHandler(
  historyOperation: HistoryOperation = getInterviewHistory
) {
  return async (req: Request, res: Response) => {
    const limit = parseHistoryLimit(req.query.limit);
    const nextToken = req.query.nextToken;

    if (
      limit === null ||
      (nextToken !== undefined && typeof nextToken !== "string")
    ) {
      res.status(400).json({
        error: {
          code: "INVALID_HISTORY_REQUEST",
          message: "The history request parameters are invalid.",
        },
      });
      return;
    }

    try {
      const result = await historyOperation(
        req.authenticatedUser!.sub,
        limit,
        nextToken
      );
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof InvalidHistoryRequestError) {
        res.status(400).json({
          error: {
            code: "INVALID_HISTORY_REQUEST",
            message: "The history request parameters are invalid.",
          },
        });
        return;
      }

      const unavailable =
        error instanceof HistoryUnavailableError
          ? error
          : new HistoryUnavailableError({ cause: error });
      res.status(503).json({
        error: {
          code: "HISTORY_UNAVAILABLE",
          message: unavailable.message,
        },
      });
    }
  };
}

export const getInterviewHistoryForCurrentUser =
  createGetInterviewHistoryHandler();
