# AI reliability

## Provider and models

The declared dependency is `@google/genai` `^2.12.0`; the current lockfile and installed dependency resolve to version `2.12.0`. Production defaults in `template.yaml` are:

| Setting | Value |
| --- | --- |
| Primary | `gemini-3.5-flash` |
| Fallback | `gemini-3.5-flash-lite` |
| Whole-operation deadline | 24,000 ms |
| Maximum attempts per model | 4 |
| Maximum retry delay | 5,000 ms |

Environment variables can override model names and deadline locally. This behavior improves recovery from selected provider failures; it does not guarantee availability.

## Retry and fallback rules

`server/src/services/gemini-reliability.ts` applies one `AbortController` deadline across primary attempts, retry sleeps, and fallback attempts.

- HTTP 503 is transient and retryable.
- HTTP 429 is retryable only when the parsed provider error includes a `google.rpc.RetryInfo` delay from 0 through 5 seconds and does not identify a daily/per-day quota.
- Daily quota or 429 without a short retry delay fails immediately as `AI_QUOTA_EXCEEDED`.
- Other errors are not retried by this layer and reach the controller's unexpected-error mapping.
- Fallback is attempted only after all retryable attempts on the primary model are exhausted.
- If primary and fallback model names are equal, no duplicate fallback phase runs.
- The 24-second deadline can end the sequence before the theoretical eight attempts complete.

After failed attempt `n`, delay is:

```text
min(5000 ms, max(1000 ms * 2^(n-1) + random jitter [0,249] ms, provider retry delay))
```

The fallback has the same four-attempt bound and shares the original deadline.

## HTTP mappings

| Condition | HTTP/code |
| --- | --- |
| Deadline or exhausted 503 retries | `503 AI_SERVICE_BUSY` |
| Daily/non-transient quota | `429 AI_QUOTA_EXCEEDED` |
| Empty, malformed, or structurally invalid evaluation | `502 AI_RESPONSE_INVALID` |
| Any score outside 0–10 or not finite numeric data | `502 AI_RESPONSE_INVALID` |
| DynamoDB save after successful evaluation fails | `503 RESULT_SAVE_FAILED` |
| Unexpected evaluation failure | `500 INTERNAL_SERVER_ERROR` |

Generation has the same AI busy/quota mappings, but an unexpected error uses its legacy generic 500 response without an error code.

## Response parsing and score validation

Question generation trims lines, removes leading numeric markers, and discards empty lines. It does not enforce the requested count.

Evaluation tells Gemini to return JSON only. The server removes Markdown JSON fences, parses JSON, and requires:

- four top-level scores;
- string arrays for `strengths` and `weaknesses`;
- a `questionEvaluation` array;
- string `question` and `feedback` fields for each question evaluation;
- a finite numeric score from 0 through 10 for every top-level and per-question score.

Malformed output and invalid scoring never reach DynamoDB. There is no second “repair” prompt; the user retries the evaluation request.

## Duplicate-request protection

Generate and evaluate controllers hash the complete JSON request body with SHA-256 and combine it with verified user `sub` and operation name. Concurrent identical requests on the same warm process share one promise. The entry is removed when the operation settles.

This is in-memory coalescing, not durable idempotency. It does not deduplicate sequential retries, requests reaching different Lambda instances, or semantically identical bodies with different JSON serialization/order.

## Evaluation failure recovery and answer preservation

The interview page keeps questions and answers in React state. On evaluation failure it displays a safe message, clears its submission lock, and remains on the page, allowing another submit without intentionally clearing answers. This preservation lasts only while the page remains mounted; a refresh or navigation loses router/in-memory state.

Because evaluation and persistence are one endpoint, `RESULT_SAVE_FAILED` requires reevaluation on retry. Durable idempotency or a separately resumable evaluated result is not implemented.

## Safe logging

Retry logs contain model, attempt, HTTP status, and fallback flag. Evaluation failure logs contain stage, error class, status, model, and fallback flag. History normalization logs only an ignored-record count. The code does not intentionally log prompts, answers, API keys, JWTs, full provider payloads, or result documents.

## Current limitations

- Synchronous work must fit the 24-second Gemini and 28-second gateway budgets.
- Only selected 429 and 503 errors are retried.
- Provider retry metadata is parsed from an error message JSON payload and may be sensitive to SDK/provider format changes.
- Fallback does not run for malformed successful model output or non-retryable provider errors.
- No circuit breaker, queue, durable idempotency key, application rate limiter, or asynchronous evaluation exists.
- Question count and request input shapes are not validated server-side.
