# Security

## Authentication and JWT verification

Protected API routes require a Bearer token. `aws-jwt-verify` validates Cognito access tokens against the configured User Pool, app client, signature keys, expiry, and `token_use=access`. Missing, expired, and invalid tokens return distinct 401 codes. ID tokens are used by the frontend for profile display, not API authorization.

## User isolation

The server obtains identity from the verified Cognito `sub`. The evaluation controller supplies that value as `userId`, and history always queries that partition. History accepts only `limit` and `nextToken`; it does not accept a caller-provided `userId`. Pagination tokens are rejected when their embedded partition does not match the current user.

This isolates application reads/writes at the code and DynamoDB-key level. It is not attribute-based DynamoDB authorization per end user; Lambda is the trusted data-access tier.

## Secrets and AWS credentials

Production stores the Gemini key in AWS Secrets Manager:

```text
Secret ID: interviewace/gemini-api-key
JSON key:  GEMINI_API_KEY
```

Lambda loads it before importing the Express configuration on cold start and retains it only in process memory. The secret must never be placed in SAM parameters, Amplify/Vite variables, Git, logs, or client code.

Lambda does not use static AWS access keys. AWS supplies temporary execution-role credentials. Local development uses the AWS CLI/SDK credential chain; prefer short-lived credentials and a dedicated least-privilege identity.

## Lambda IAM

The SAM role grants:

- CloudWatch log creation/writes through `AWSLambdaBasicExecutionRole`;
- `dynamodb:PutItem` and `dynamodb:Query` on the configured production table ARN;
- `secretsmanager:GetSecretValue` on the named Gemini secret ARN pattern.

There is no production DynamoDB `Scan`, update, delete, batch, table-management, or development-table permission. The previously used `interviewace-local` identity had broad DynamoDB permissions; reduce it to development-table-only access, ideally only the operations needed (`PutItem`, `Query`, and narrowly justified diagnostics).

## Environment isolation

Production uses `InterviewAceInterviews`; local development uses `InterviewAceInterviews-dev`. The Lambda role is scoped to the production name provided at deployment. Do not reuse production credentials or table configuration in local `.env` files.

## CORS

Production CORS is restricted to `https://main.d1aqwxz5mscjq8.amplifyapp.com`. API Gateway's mock preflight allows only `GET,POST,OPTIONS` and `Authorization,Content-Type`; Express independently checks normalized configured origins. The design does not use `Access-Control-Allow-Origin: *`, particularly because authenticated browser requests carry an Authorization header.

CORS is browser policy, not authorization. JWT verification remains mandatory.

## Logging and data sensitivity

Do not log:

- Authorization headers, access/ID/refresh tokens, or OAuth codes;
- Gemini or Google secrets;
- prompts, interview questions/answers, full evaluations, or result documents;
- raw provider error payloads if they may echo request content.

Current structured application logs use stage, model, fallback flag, status, attempt, error class, and aggregate malformed-record counts. CloudWatch access and retention should be restricted operationally.

## Secret rotation

Rotate the Gemini value by updating the existing secret's `GEMINI_API_KEY` field. Warm Lambda environments cache the loaded value; publish/redeploy or recycle existing environments when immediate adoption is required. Test health and one authenticated AI request after rotation without printing the key.

## Recommended hardening

These are recommendations, not currently implemented features:

- Add rate limiting/abuse controls at API Gateway, AWS WAF, or an application-aware layer.
- Run `npm audit` and dependency-update review regularly in both packages; assess findings rather than blindly applying breaking fixes.
- Use short-lived local credentials, MFA where applicable, and a development-table-only IAM policy.
- Add retention/redaction policies and alarms for CloudWatch.
- Add server-side request schemas and payload-size/array-length limits.
- Add durable idempotency if duplicate writes must be prevented across Lambda instances.
- Review Cognito password, MFA, recovery, token lifetime, and deletion policies outside this repository.

