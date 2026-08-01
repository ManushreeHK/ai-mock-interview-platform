export type EvaluationFailureStage =
  | "gemini_response_parsing"
  | "evaluation_normalization"
  | "dynamodb_put_item";

type EvaluationErrorCode = "AI_RESPONSE_INVALID" | "RESULT_SAVE_FAILED";

export class EvaluationStageError extends Error {
  constructor(
    readonly statusCode: 502 | 503,
    readonly code: EvaluationErrorCode,
    message: string,
    readonly stage: EvaluationFailureStage,
    readonly model: string,
    readonly fallback: boolean,
    options?: ErrorOptions
  ) {
    super(message, options);
    this.name = "EvaluationStageError";
  }
}

export function invalidAiResponseError(
  stage: Extract<
    EvaluationFailureStage,
    "gemini_response_parsing" | "evaluation_normalization"
  >,
  model: string,
  fallback: boolean,
  cause?: unknown
) {
  return new EvaluationStageError(
    502,
    "AI_RESPONSE_INVALID",
    "The AI returned an invalid evaluation response. Please try again.",
    stage,
    model,
    fallback,
    { cause }
  );
}

export function invalidScoringDataError(
  model: string,
  fallback: boolean,
  cause?: unknown
) {
  return new EvaluationStageError(
    502,
    "AI_RESPONSE_INVALID",
    "The AI returned invalid scoring data. Please try again.",
    "evaluation_normalization",
    model,
    fallback,
    { cause }
  );
}

export function resultSaveError(
  model: string,
  fallback: boolean,
  cause: unknown
) {
  return new EvaluationStageError(
    503,
    "RESULT_SAVE_FAILED",
    "The evaluation was completed but could not be saved. Please try again.",
    "dynamodb_put_item",
    model,
    fallback,
    { cause }
  );
}
