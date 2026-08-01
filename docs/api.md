# API reference

## Base URLs

| Environment | Base |
| --- | --- |
| Local invoke root | `http://localhost:5000` |
| Local API base | `http://localhost:5000/api` |
| Production invoke root | `https://wbdxdn6su7.execute-api.ap-south-1.amazonaws.com/prod` |
| Production API base | `https://wbdxdn6su7.execute-api.ap-south-1.amazonaws.com/prod/api` |

Examples use placeholders. Never paste real JWTs into documentation, shell history, screenshots, or issue reports.

## Authentication and content type

All `/api/interview/*` endpoints require a Cognito access token:

```http
Authorization: Bearer <COGNITO_ACCESS_TOKEN>
Content-Type: application/json
```

The verifier is configured for access tokens from the deployed User Pool and app client. `GET /health` and `GET /api/hello` are public.

## Error format

Most protected and reliability errors use:

```json
{
  "error": {
    "code": "AI_SERVICE_BUSY",
    "message": "The AI service is temporarily busy. Please try again shortly."
  }
}
```

Authentication and CORS errors additionally include `"success": false`. The generation controller still has a legacy generic 500 shape (`success` and `message`, without a code); this inconsistency is documented rather than hidden.

| HTTP | Code | Meaning |
| --- | --- | --- |
| 400 | `INVALID_HISTORY_REQUEST` | Invalid limit or opaque pagination token |
| 401 | `AUTH_TOKEN_MISSING` | No Authorization header |
| 401 | `AUTH_TOKEN_INVALID` | Malformed or unverifiable access token |
| 401 | `AUTH_TOKEN_EXPIRED` | Expired access token |
| 403 | `CORS_ORIGIN_FORBIDDEN` | Origin is not allowed by Express CORS |
| 429 | `AI_QUOTA_EXCEEDED` | Non-transient/daily Gemini quota reached |
| 502 | `AI_RESPONSE_INVALID` | Evaluation response is empty, malformed, structurally invalid, or has an invalid score |
| 503 | `AI_SERVICE_BUSY` | Retryable AI failures exhausted or the AI deadline elapsed |
| 503 | `RESULT_SAVE_FAILED` | Evaluation succeeded but DynamoDB persistence failed |
| 503 | `HISTORY_UNAVAILABLE` | History query failed |
| 500 | `INTERNAL_SERVER_ERROR` | Unexpected evaluation failure |

## `GET /health`

Public liveness endpoint.

Response `200`:

```json
{"status":"ok"}
```

```bash
curl "https://wbdxdn6su7.execute-api.ap-south-1.amazonaws.com/prod/health"
```

## `GET /api/hello`

Public welcome endpoint implemented in `server/src/app.ts`; it is not used by the client.

Response `200`:

```json
{"message":"Welcome to InterviewAce AI API 🚀"}
```

```bash
curl "https://wbdxdn6su7.execute-api.ap-south-1.amazonaws.com/prod/api/hello"
```

## `POST /api/interview/generate`

Generates ten interview questions. Authentication is required.

Request body used by the client:

```json
{
  "role": "Backend Developer",
  "experience": "3-5 Years",
  "difficulty": "Medium",
  "domain": "Web Development",
  "language": "TypeScript",
  "position": "Platform Engineer"
}
```

The frontend validates these fields before calling the endpoint. The server currently interpolates body values into its prompt and does not perform request-schema validation.

Response `200`:

```json
{
  "success": true,
  "questions": [
    "How would you design ...?",
    "Explain ..."
  ]
}
```

The service splits non-empty model output lines and removes a leading numeric-list marker. It does not validate that exactly ten lines were returned.

Possible responses:

- `200` success
- `401` authentication error
- `429 AI_QUOTA_EXCEEDED`
- `503 AI_SERVICE_BUSY`
- `500` legacy `{ "success": false, "message": "Failed to generate interview." }` for unexpected failures

```bash
curl -X POST "https://wbdxdn6su7.execute-api.ap-south-1.amazonaws.com/prod/api/interview/generate" \
  -H "Authorization: Bearer <COGNITO_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  --data '{"role":"Backend Developer","experience":"3-5 Years","difficulty":"Medium","domain":"Web Development","language":"TypeScript","position":"Platform Engineer"}'
```

## `POST /api/interview/evaluate`

Evaluates answers, validates all scores, and saves the completed result. Authentication is required. If persistence fails, the endpoint does not return an unsaved result.

Request:

```json
{
  "type": "technical",
  "role": "Backend Developer",
  "experience": "3-5 Years",
  "difficulty": "Medium",
  "language": "TypeScript",
  "questions": ["What is idempotency?"],
  "answers": ["It means repeated equivalent requests have the same effect."]
}
```

Response `200`:

```json
{
  "success": true,
  "result": {
    "userId": "<COGNITO_SUB>",
    "interviewId": "2026-08-01T12:34:56.789Z#<UUID>",
    "type": "technical",
    "role": "Backend Developer",
    "experience": "3-5 Years",
    "difficulty": "Medium",
    "language": "TypeScript",
    "questions": ["What is idempotency?"],
    "answers": ["It means repeated equivalent requests have the same effect."],
    "evaluation": {
      "overallScore": 8.2,
      "communication": 8,
      "technicalKnowledge": 8.5,
      "confidence": 8,
      "strengths": ["Clear definition"],
      "weaknesses": ["Could include an HTTP example"],
      "questionEvaluation": [
        {
          "question": "What is idempotency?",
          "score": 8.2,
          "feedback": "Accurate and concise."
        }
      ]
    },
    "status": "completed",
    "createdAt": "2026-08-01T12:34:56.789Z"
  }
}
```

Every overall, category, and question score must be a finite number from 0 through 10 inclusive. The server validates model response structure but currently does not validate the incoming request schema or enforce equal question/answer counts.

Possible responses:

- `200` evaluated and saved
- `401` authentication error
- `429 AI_QUOTA_EXCEEDED`
- `502 AI_RESPONSE_INVALID`
- `503 AI_SERVICE_BUSY`
- `503 RESULT_SAVE_FAILED`
- `500 INTERNAL_SERVER_ERROR`

```bash
curl -X POST "https://wbdxdn6su7.execute-api.ap-south-1.amazonaws.com/prod/api/interview/evaluate" \
  -H "Authorization: Bearer <COGNITO_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  --data '{"type":"technical","role":"Backend Developer","experience":"3-5 Years","difficulty":"Medium","language":"TypeScript","questions":["What is idempotency?"],"answers":["Repeated equivalent requests have the same effect."]}'
```

## `GET /api/interview/history`

Returns completed summaries belonging to the authenticated Cognito `sub`. The endpoint never takes a `userId` query parameter.

Query parameters:

| Name | Default | Rules |
| --- | --- | --- |
| `limit` | `20` | Positive integer; values over 100 are capped at 100 |
| `nextToken` | none | Opaque base64url cursor returned by the preceding page |

Response `200`:

```json
{
  "items": [
    {
      "interviewId": "2026-08-01T12:34:56.789Z#<UUID>",
      "createdAt": "2026-08-01T12:34:56.789Z",
      "role": "Backend Developer",
      "interviewType": "technical",
      "difficulty": "Medium",
      "overallScore": 8.2,
      "communication": 8,
      "technicalKnowledge": 8.5,
      "confidence": 8,
      "status": "completed"
    }
  ],
  "nextToken": "<OPAQUE_TOKEN_OR_NULL>"
}
```

Results use DynamoDB descending key order. Because `interviewId` begins with an ISO timestamp, this is newest first. Malformed stored records are omitted from a page and logged only as a count. The client dashboard follows every page with `limit=100`, guards against repeated tokens, and sorts again by `createdAt`.

Possible responses:

- `200` page (including an empty `items` array)
- `400 INVALID_HISTORY_REQUEST`
- `401` authentication error
- `503 HISTORY_UNAVAILABLE`

```bash
curl --get "https://wbdxdn6su7.execute-api.ap-south-1.amazonaws.com/prod/api/interview/history" \
  -H "Authorization: Bearer <COGNITO_ACCESS_TOKEN>" \
  --data-urlencode "limit=20" \
  --data-urlencode "nextToken=<OPAQUE_NEXT_TOKEN>"
```

