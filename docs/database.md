# Database

## Tables and isolation

| Environment | Table |
| --- | --- |
| Local/development | `InterviewAceInterviews-dev` |
| Production | `InterviewAceInterviews` |

The table name is selected with `DYNAMODB_INTERVIEWS_TABLE`. The SAM template references the production table but does not create either table; they must already exist. Keeping table names separate prevents local writes from mixing with production data.

An email address is not a database identity. Records are partitioned by Cognito `sub`. If the same email exists in separate User Pools or as separate identities, its `sub` may differ and its records remain separate.

## Key schema

| Attribute | Type | Role |
| --- | --- | --- |
| `userId` | String | Partition key; verified Cognito `sub` |
| `interviewId` | String | Sort key; `<createdAt>#<UUID>` |

`createdAt` is generated with `new Date().toISOString()`. `interviewId` is generated as:

```text
<ISO-8601 timestamp>#<random UUID>
```

Example:

```text
2026-08-01T12:34:56.789Z#550e8400-e29b-41d4-a716-446655440000
```

The fixed-width ISO prefix makes descending sort-key order equivalent to newest-first creation order, while the UUID avoids collisions at the same timestamp.

## Completed-result item

`POST /api/interview/evaluate` writes one document only after Gemini output is parsed and validated:

```json
{
  "userId": "<COGNITO_SUB>",
  "interviewId": "2026-08-01T12:34:56.789Z#<UUID>",
  "type": "technical",
  "role": "Backend Developer",
  "experience": "3-5 Years",
  "difficulty": "Medium",
  "language": "TypeScript",
  "questions": ["Question text"],
  "answers": ["Candidate answer"],
  "evaluation": {
    "overallScore": 8.2,
    "communication": 8,
    "technicalKnowledge": 8.5,
    "confidence": 8,
    "strengths": ["Clear explanation"],
    "weaknesses": ["Add an example"],
    "questionEvaluation": [
      {
        "question": "Question text",
        "score": 8.2,
        "feedback": "Specific feedback"
      }
    ]
  },
  "status": "completed",
  "createdAt": "2026-08-01T12:34:56.789Z"
}
```

The stored interview-type field is named `type`; the history API maps it to `interviewType`. Role, experience, difficulty, language, questions, and answers are the values submitted for evaluation. There is no separate aggregate or dashboard-metrics item.

## Writes

`server/src/repositories/interview-result.repository.ts` uses DynamoDB `PutItem` through `PutCommand`. Its condition requires both key attributes not to exist, preventing accidental replacement of an item with the same composite key.

Only completed results are stored. An invalid AI response is rejected before the write. A write failure becomes `RESULT_SAVE_FAILED` and the client remains on the interview page with its in-memory answers available for retry.

## History access pattern

History uses `Query`, never `Scan`:

```text
userId = verified Cognito sub
ScanIndexForward = false
Limit = requested page size
ExclusiveStartKey = decoded nextToken, when supplied
```

The projection returns only keys, display metadata, status, and four score fields. Full questions, answers, feedback, strengths, and weaknesses are not returned by history.

The API default page size is 20; the maximum is 100. `LastEvaluatedKey` is encoded as an opaque base64url `nextToken`. Tokens embed the partition key and sort key, and the service rejects a token whose `userId` does not match the authenticated user. Clients must treat tokens as opaque.

The Dashboard client retrieves every page at up to 100 records, re-sorts by `createdAt`, and derives totals and metrics locally. This is suitable for the current data volume but may require bounded time ranges or precomputed aggregates as histories grow.

The Interview History page retrieves only its first 20-record page initially and appends subsequent pages through the opaque token. Search, filters, sorting, and summary cards apply only to records loaded so far. The UI labels the count accordingly rather than presenting it as a table-wide count.

## Saved-result access pattern

`GET /api/interview/history/:interviewId` uses `GetItem` with both key values: the verified Cognito `sub` and the validated `interviewId` path value. No user identifier is accepted from request input. A composite-key miss returns 404, including when the interview ID belongs to another partition. The complete item is validated before return.

## Score fields

These stored numbers are validated as finite values in the inclusive `0`–`10` range:

- `evaluation.overallScore`
- `evaluation.communication`
- `evaluation.technicalKnowledge`
- `evaluation.confidence`
- every `evaluation.questionEvaluation[].score`

History normalization revalidates the four projected scores and silently excludes malformed legacy items, while logging only the number excluded.

## IAM

The production Lambda role defined by `template.yaml` has only:

```text
dynamodb:PutItem
dynamodb:Query
dynamodb:GetItem
```

These actions are scoped to the configured production table ARN. It has no `Scan`, delete, update, batch, table-management, or development-table permission. Local credentials should likewise be reduced to `PutItem`, `Query`, and `GetItem` on `InterviewAceInterviews-dev` where practical.
