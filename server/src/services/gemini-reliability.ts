import { ApiError, GoogleGenAI } from "@google/genai";
import { env } from "../config/env.js";

const MAX_ATTEMPTS_PER_MODEL = 4;
const MAX_TRANSIENT_RETRY_DELAY_MS = 5_000;

type AiErrorCode = "AI_SERVICE_BUSY" | "AI_QUOTA_EXCEEDED";

export class AiServiceError extends Error {
  constructor(
    readonly statusCode: 503 | 429,
    readonly code: AiErrorCode,
    message: string,
    readonly model: string,
    readonly fallback: boolean
  ) {
    super(message);
    this.name = "AiServiceError";
  }
}

class RetryExhaustedError extends Error {
  constructor(readonly status: 503 | 429) {
    super("Gemini retry attempts were exhausted.");
    this.name = "RetryExhaustedError";
  }
}

type GenerateRequest = (
  model: string,
  contents: string,
  signal: AbortSignal
) => Promise<string>;

type RetryRuntime = {
  generate: GenerateRequest;
  sleep: (milliseconds: number, signal: AbortSignal) => Promise<void>;
  random: () => number;
  logAttempt: (details: {
    model: string;
    attempt: number;
    status: number;
    fallback: boolean;
  }) => void;
};

const ai = new GoogleGenAI({ apiKey: env.geminiApiKey });

const defaultRuntime: RetryRuntime = {
  async generate(model, contents, signal) {
    const response = await ai.models.generateContent({
      model,
      contents,
      config: { abortSignal: signal },
    });
    return response.text ?? "";
  },
  sleep(milliseconds, signal) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(resolve, milliseconds);
      signal.addEventListener(
        "abort",
        () => {
          clearTimeout(timer);
          reject(signal.reason);
        },
        { once: true }
      );
    });
  },
  random: Math.random,
  logAttempt(details) {
    console.warn(JSON.stringify(details));
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getStatus(error: unknown): number | null {
  if (error instanceof ApiError) return error.status;

  if (isRecord(error) && typeof error.status === "number") {
    return error.status;
  }

  return null;
}

function readRetryDelay(value: unknown): number | null {
  if (typeof value === "string") {
    const match = /^(\d+(?:\.\d+)?)s$/.exec(value.trim());
    return match ? Number(match[1]) * 1_000 : null;
  }

  if (isRecord(value)) {
    const seconds = Number(value.seconds ?? 0);
    const nanos = Number(value.nanos ?? 0);

    if (Number.isFinite(seconds) && Number.isFinite(nanos)) {
      return seconds * 1_000 + nanos / 1_000_000;
    }
  }

  return null;
}

function findRetryDelay(value: unknown): number | null {
  if (Array.isArray(value)) {
    for (const item of value) {
      const delay = findRetryDelay(item);
      if (delay !== null) return delay;
    }
    return null;
  }

  if (!isRecord(value)) return null;

  const type = value["@type"];
  if (
    typeof type === "string" &&
    type.endsWith("google.rpc.RetryInfo")
  ) {
    return readRetryDelay(value.retryDelay);
  }

  for (const child of Object.values(value)) {
    const delay = findRetryDelay(child);
    if (delay !== null) return delay;
  }

  return null;
}

function containsDailyQuota(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(containsDailyQuota);
  if (!isRecord(value)) return false;

  for (const [key, child] of Object.entries(value)) {
    if (
      key === "quotaId" &&
      typeof child === "string" &&
      /per.?day|daily/i.test(child)
    ) {
      return true;
    }

    if (containsDailyQuota(child)) return true;
  }

  return false;
}

function parseErrorPayload(error: unknown): unknown {
  if (!(error instanceof Error)) return null;

  try {
    return JSON.parse(error.message) as unknown;
  } catch {
    return null;
  }
}

function getShortRetryDelay(error: unknown): number | null {
  const payload = parseErrorPayload(error);
  if (containsDailyQuota(payload)) return null;

  const delay = findRetryDelay(payload);

  if (
    delay !== null &&
    delay >= 0 &&
    delay <= MAX_TRANSIENT_RETRY_DELAY_MS
  ) {
    return delay;
  }

  return null;
}

function quotaError(model: string, fallback: boolean) {
  return new AiServiceError(
    429,
    "AI_QUOTA_EXCEEDED",
    "The AI usage limit has been reached. Please try again later.",
    model,
    fallback
  );
}

function busyError(model: string, fallback: boolean) {
  return new AiServiceError(
    503,
    "AI_SERVICE_BUSY",
    "The AI service is temporarily busy. Please try again shortly.",
    model,
    fallback
  );
}

function backoffDelay(
  failedAttempt: number,
  minimumDelay: number,
  random: () => number
) {
  const exponentialDelay = 1_000 * 2 ** (failedAttempt - 1);
  const jitter = Math.floor(random() * 250);
  return Math.min(
    MAX_TRANSIENT_RETRY_DELAY_MS,
    Math.max(exponentialDelay + jitter, minimumDelay)
  );
}

async function generateWithModel(
  model: string,
  contents: string,
  fallback: boolean,
  runtime: RetryRuntime,
  signal: AbortSignal
): Promise<GeminiGenerationResult> {
  for (
    let attempt = 1;
    attempt <= MAX_ATTEMPTS_PER_MODEL;
    attempt += 1
  ) {
    try {
      return {
        text: await runtime.generate(model, contents, signal),
        model,
        fallback,
      };
    } catch (error) {
      const status = getStatus(error);
      const shortRetryDelay =
        status === 429 ? getShortRetryDelay(error) : null;
      const retryable = status === 503 || shortRetryDelay !== null;

      runtime.logAttempt({
        model,
        attempt,
        status: status ?? 0,
        fallback,
      });

      if (status === 429 && shortRetryDelay === null) {
        throw quotaError(model, fallback);
      }

      if (!retryable) throw error;

      if (attempt === MAX_ATTEMPTS_PER_MODEL) {
        throw new RetryExhaustedError(status === 429 ? 429 : 503);
      }

      await runtime.sleep(
        backoffDelay(attempt, shortRetryDelay ?? 0, runtime.random),
        signal
      );
    }
  }

  throw busyError(model, fallback);
}

export type GeminiGenerationResult = {
  text: string;
  model: string;
  fallback: boolean;
};

export async function generateWithFallback(
  contents: string,
  runtime: RetryRuntime = defaultRuntime,
  timeoutMs: number = env.geminiRequestTimeoutMs
): Promise<GeminiGenerationResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  timer.unref();

  try {
    return await generateWithFallbackBeforeDeadline(
      contents,
      runtime,
      controller.signal
    );
  } finally {
    clearTimeout(timer);
  }
}

async function generateWithFallbackBeforeDeadline(
  contents: string,
  runtime: RetryRuntime,
  signal: AbortSignal
): Promise<GeminiGenerationResult> {
  try {
    return await generateWithModel(
      env.geminiPrimaryModel,
      contents,
      false,
      runtime,
      signal
    );
  } catch (error) {
    if (signal.aborted) {
      throw busyError(env.geminiPrimaryModel, false);
    }
    if (
      !(error instanceof RetryExhaustedError)
    ) {
      throw error;
    }

    if (env.geminiFallbackModel === env.geminiPrimaryModel) {
      throw error.status === 429
        ? quotaError(env.geminiPrimaryModel, false)
        : busyError(env.geminiPrimaryModel, false);
    }
  }

  try {
    return await generateWithModel(
      env.geminiFallbackModel,
      contents,
      true,
      runtime,
      signal
    );
  } catch (error) {
    if (signal.aborted) {
      throw busyError(env.geminiFallbackModel, true);
    }
    if (error instanceof RetryExhaustedError) {
      throw error.status === 429
        ? quotaError(env.geminiFallbackModel, true)
        : busyError(env.geminiFallbackModel, true);
    }

    throw error;
  }
}

export type { RetryRuntime };
