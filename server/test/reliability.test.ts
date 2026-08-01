import assert from "node:assert/strict";
import test from "node:test";
import { env } from "../src/config/env.js";
import {
  AiServiceError,
  generateWithFallback,
  type RetryRuntime,
} from "../src/services/gemini-reliability.js";
import { runDeduplicated } from "../src/services/request-deduplication.js";

function apiError(status: number, details: unknown[] = []) {
  const error = new Error(
    JSON.stringify({
      error: {
        code: status,
        status:
          status === 503 ? "UNAVAILABLE" : "RESOURCE_EXHAUSTED",
        details,
      },
    })
  ) as Error & { status: number };
  error.status = status;
  return error;
}

function runtime(
  generate: RetryRuntime["generate"],
  sleep: RetryRuntime["sleep"] = async () => undefined
): RetryRuntime {
  return {
    generate,
    sleep,
    random: () => 0,
    logAttempt: () => undefined,
  };
}

test("returns a primary-model response without fallback", async () => {
  const models: string[] = [];
  const result = await generateWithFallback(
    "prompt",
    runtime(async (model) => {
      models.push(model);
      return "primary response";
    })
  );

  assert.equal(result.text, "primary response");
  assert.equal(result.fallback, false);
  assert.deepEqual(models, [env.geminiPrimaryModel]);
});

test("uses fallback after bounded primary 503 retries", async () => {
  const models: string[] = [];
  const delays: number[] = [];
  const result = await generateWithFallback(
    "prompt",
    runtime(
      async (model) => {
        models.push(model);
        if (model === env.geminiPrimaryModel) throw apiError(503);
        return "fallback response";
      },
      async (milliseconds) => {
        delays.push(milliseconds);
      }
    )
  );

  assert.equal(result.text, "fallback response");
  assert.equal(result.fallback, true);
  assert.equal(
    models.filter((model) => model === env.geminiPrimaryModel)
      .length,
    4
  );
  assert.equal(models.at(-1), env.geminiFallbackModel);
  assert.deepEqual(delays, [1_000, 2_000, 4_000]);
});

test("maps both unavailable models to AI_SERVICE_BUSY", async () => {
  let calls = 0;

  await assert.rejects(
    generateWithFallback(
      "prompt",
      runtime(async () => {
        calls += 1;
        throw apiError(503);
      })
    ),
    (error: unknown) =>
      error instanceof AiServiceError &&
      error.statusCode === 503 &&
      error.code === "AI_SERVICE_BUSY"
  );

  assert.equal(calls, 8);
});

test("retries a 429 only when RetryInfo has a short delay", async () => {
  let calls = 0;
  const result = await generateWithFallback(
    "prompt",
    runtime(async () => {
      calls += 1;
      if (calls === 1) {
        throw apiError(429, [
          {
            "@type": "type.googleapis.com/google.rpc.RetryInfo",
            retryDelay: "1s",
          },
        ]);
      }
      return "retried response";
    })
  );

  assert.equal(result.text, "retried response");
  assert.equal(calls, 2);
});

test("does not retry a daily-quota 429", async () => {
  let calls = 0;

  await assert.rejects(
    generateWithFallback(
      "prompt",
      runtime(async () => {
        calls += 1;
        throw apiError(429, [
          {
            "@type": "type.googleapis.com/google.rpc.QuotaFailure",
            violations: [{ quotaId: "GenerateRequestsPerDay" }],
          },
          {
            "@type": "type.googleapis.com/google.rpc.RetryInfo",
            retryDelay: "1s",
          },
        ]);
      })
    ),
    (error: unknown) =>
      error instanceof AiServiceError &&
      error.statusCode === 429 &&
      error.code === "AI_QUOTA_EXCEEDED"
  );

  assert.equal(calls, 1);
});

test("coalesces concurrent duplicate operations", async () => {
  let calls = 0;
  let release: (() => void) | undefined;
  const blocked = new Promise<void>((resolve) => {
    release = resolve;
  });
  const operation = async () => {
    calls += 1;
    await blocked;
    return "result";
  };

  const first = runDeduplicated("same-request", operation);
  const second = runDeduplicated("same-request", operation);
  release?.();

  assert.deepEqual(await Promise.all([first, second]), [
    "result",
    "result",
  ]);
  assert.equal(calls, 1);
});
