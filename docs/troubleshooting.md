# Troubleshooting

Run diagnostics without printing secrets, full JWTs, interview answers, or production records.

## AWS CLI not found on `PATH`

- **Symptom:** `aws` is not recognized.
- **Likely cause:** AWS CLI is absent or its install directory is missing from `PATH`.
- **Diagnostic:** `Get-Command aws -ErrorAction SilentlyContinue`
- **Fix:** Install AWS CLI v2, reopen the terminal, or add its documented install directory to `PATH`.
- **Verify:** `aws --version` and `aws sts get-caller-identity` (the latter prints identity metadata, not credentials).

## SAM cannot find esbuild

- **Symptom:** `sam build` reports that the esbuild executable is unavailable.
- **Likely cause:** `server/node_modules` was not installed, or SAM cannot resolve the project-local binary.
- **Diagnostic:** `Test-Path server/node_modules/.bin/esbuild.cmd; npm --prefix server exec esbuild -- --version`
- **Fix:** Run `npm install` in `server`; run `sam build` from the repository root. Do not install an unpinned arbitrary binary.
- **Verify:** `sam build` completes and creates `.aws-sam/build/InterviewAceFunction`.

## Secrets Manager secret not found

- **Symptom:** Lambda cold start fails with a resource-not-found error or missing Gemini secret.
- **Likely cause:** Wrong region/name, absent secret, or deployment parameter mismatch.
- **Diagnostic:** `aws secretsmanager describe-secret --region ap-south-1 --secret-id interviewace/gemini-api-key`
- **Fix:** Create the secret in `ap-south-1` or redeploy with `GeminiSecretName=interviewace/gemini-api-key`; store JSON with key `GEMINI_API_KEY`.
- **Verify:** `describe-secret` succeeds without retrieving the value, then `/health` succeeds after a new Lambda environment initializes.

## API Gateway returns `Internal Server Error`

- **Symptom:** Gateway returns a generic 500, often before Express JSON is visible.
- **Likely cause:** Lambda initialization/configuration error, secret loading failure, invocation permission issue, or integration failure.
- **Diagnostic:** `aws logs tail /aws/lambda/interviewace-api --since 10m --region ap-south-1`
- **Fix:** Correct the specific missing environment value/secret/IAM issue; confirm the stack integration and Lambda permission from `template.yaml`; redeploy the reviewed change.
- **Verify:** Call `/health`, then an authenticated endpoint and confirm no new Lambda error.

## CORS preflight returns 403

- **Symptom:** Browser blocks an API call and `OPTIONS` returns 403.
- **Likely cause:** API Gateway lacks/deployed the wrong `OPTIONS` route, the origin differs from `FrontendOrigin`, or the request bypasses the expected proxy resource.
- **Diagnostic:** `curl.exe -i -X OPTIONS -H "Origin: https://main.d1aqwxz5mscjq8.amplifyapp.com" -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: Authorization,Content-Type" "https://wbdxdn6su7.execute-api.ap-south-1.amazonaws.com/prod/api/interview/generate"`
- **Fix:** Deploy the SAM template with the exact `FrontendOrigin`; ensure the browser uses the `/prod/api` base and that `OPTIONS` allows `Authorization,Content-Type` and `GET,POST,OPTIONS`.
- **Verify:** Preflight returns 200 with the exact Amplify origin, while an unknown origin is not authorized.

## Production frontend still calls localhost

- **Symptom:** Browser network requests target `http://localhost:5000` in production.
- **Likely cause:** Amplify built with the local/default `VITE_API_BASE_URL`.
- **Diagnostic:** Inspect the browser Network request URL and the Amplify branch environment variable.
- **Fix:** Set `VITE_API_BASE_URL=https://wbdxdn6su7.execute-api.ap-south-1.amazonaws.com/prod/api` in Amplify.
- **Verify:** Rebuild, hard-refresh, and confirm requests use API Gateway.

## Amplify variable change has no effect

- **Symptom:** The console shows a new variable but the application uses the old value.
- **Likely cause:** Vite embeds `VITE_*` values at build time.
- **Diagnostic:** Compare the Amplify build timestamp/commit with the variable-change time.
- **Fix:** Start a new Amplify build/redeploy of `main` after changing the variable.
- **Verify:** Inspect the rebuilt browser request URL and auth redirect.

## Cognito redirect mismatch

- **Symptom:** Hosted UI reports `redirect_mismatch` or returns to the wrong origin.
- **Likely cause:** Vite, Cognito callback/sign-out settings, and actual URL differ.
- **Diagnostic:** Compare `VITE_OAUTH_REDIRECT_SIGN_IN`/`SIGN_OUT`, browser origin, and Cognito app-client allowed URLs character for character.
- **Fix:** Register `http://localhost:5173` and `https://main.d1aqwxz5mscjq8.amplifyapp.com` as appropriate, preserving scheme and port; rebuild the client.
- **Verify:** Google login reaches `/dashboard`, and logout returns to an allowed root.

## Invalid Google OAuth scopes

- **Symptom:** Hosted UI/provider rejects scopes or profile claims are missing.
- **Likely cause:** Google/Cognito provider or app-client scopes do not match the client request.
- **Diagnostic:** Inspect Cognito app-client OAuth settings and Google provider scopes; do not inspect/log token bodies in shared output.
- **Fix:** Enable exactly `openid`, `email`, and `profile` in Cognito and ensure the Google consent configuration permits them.
- **Verify:** Login succeeds and the UI resolves email/name (and picture when Google supplies it).

## Cognito access token missing expected scopes

- **Symptom:** A downstream check expects a scope not present in the token.
- **Likely cause:** App client/resource-server configuration differs from the requested OAuth scopes, or an ID token was supplied instead of an access token.
- **Diagnostic:** In a private local session, inspect only the token's `token_use`, client ID, and `scope`; never paste the full JWT. The current API code does not require a custom scope.
- **Fix:** Send `session.tokens.accessToken`; align configured OAuth scopes. Add custom scope enforcement only as a deliberate application change.
- **Verify:** The current protected endpoint accepts the valid access token and rejects an ID token.

## Gemini 503 high demand

- **Symptom:** API returns `503 AI_SERVICE_BUSY`.
- **Likely cause:** Gemini returned retryable 503s or the shared 24-second deadline expired.
- **Diagnostic:** Search CloudWatch logs for status/stage/model/fallback metadata: `aws logs tail /aws/lambda/interviewace-api --since 15m --region ap-south-1 --filter-pattern '503'`.
- **Fix:** Retry later; confirm primary/fallback model names. Do not lengthen gateway-sensitive deadlines without latency analysis.
- **Verify:** A later generate/evaluate succeeds and logs stay free of prompt/answer content.

## Gemini 429 quota exceeded

- **Symptom:** API returns `429 AI_QUOTA_EXCEEDED`.
- **Likely cause:** Daily/non-transient quota or a 429 without an eligible short retry delay.
- **Diagnostic:** Check quota/usage in the provider console and safe CloudWatch status metadata.
- **Fix:** Wait for reset or adjust provider quota/billing through authorized administration. Do not loop retries for daily quota.
- **Verify:** One controlled request succeeds after quota is available.

## DynamoDB table missing

- **Symptom:** History returns `HISTORY_UNAVAILABLE` or evaluate returns `RESULT_SAVE_FAILED` with resource-not-found logs.
- **Likely cause:** Wrong table name/region or table was never created.
- **Diagnostic:** `aws dynamodb describe-table --region ap-south-1 --table-name InterviewAceInterviews`
- **Fix:** Create/restore the correct environment table with String keys `userId` and `interviewId`, or correct `DYNAMODB_INTERVIEWS_TABLE` and redeploy/restart.
- **Verify:** `describe-table` shows `ACTIVE`, evaluation persists, and history returns the item.

## DynamoDB `PutItem` failure

- **Symptom:** `503 RESULT_SAVE_FAILED`; evaluation completed but results do not open.
- **Likely cause:** IAM denial, missing table, key conflict, throttling, or service error.
- **Diagnostic:** Tail Lambda logs and inspect the Lambda role policy/table state without querying user data.
- **Fix:** Restore `dynamodb:PutItem` on only the production table, correct the table/region, or retry a transient failure. Do not add `Scan` or wildcard permissions.
- **Verify:** Complete an interview, confirm one item through a key-scoped authorized check, then refresh dashboard history.

## Scores above 10

- **Symptom:** Evaluation returns `502 AI_RESPONSE_INVALID`; invalid data is not saved.
- **Likely cause:** Gemini returned percentage/out-of-100 data despite the prompt.
- **Diagnostic:** Look for safe `evaluation_normalization` failure metadata; do not log the response or answers.
- **Fix:** Retry. The current server deliberately rejects rather than clamps scores.
- **Verify:** A successful result has every overall/category/question score in `0`–`10`, and no invalid record was written.

## Dashboard still shows mock data

- **Symptom:** UI values do not match persisted history or old docs say dashboard data is mocked.
- **Likely cause:** Stale frontend deployment/cache or legacy documentation; current `DashboardPage` calls `/interview/history` and `dashboardMetrics.ts` derives metrics.
- **Diagnostic:** Inspect the browser Network tab for authenticated `/api/interview/history` and confirm the deployed commit.
- **Fix:** Deploy/rebuild the current client and hard-refresh; resolve history API errors. Do not reintroduce static metric arrays.
- **Verify:** Completing an interview and refreshing changes totals/recent interviews deterministically.

## Microphone permission differs by domain

- **Symptom:** Voice works on localhost but not Amplify, or conversely.
- **Likely cause:** Browser permissions are stored per origin or the browser lacks Web Speech API support.
- **Diagnostic:** Check site permissions for each exact origin and browser support for `SpeechRecognition`/`webkitSpeechRecognition`.
- **Fix:** Grant microphone permission separately for localhost and Amplify; use a supported browser or type the transcript.
- **Verify:** Start/stop recording on that origin and confirm editable transcript text appears.

## Git pager shows `:` and appears stuck

- **Symptom:** A Git log/diff screen ends with `:` and keyboard input does not run shell commands.
- **Likely cause:** Git opened the `less` pager.
- **Diagnostic:** The terminal shows pager content rather than a PowerShell prompt.
- **Fix:** Press `q`. For one command, use `git --no-pager diff`; optionally configure paging according to personal preference.
- **Verify:** The PowerShell prompt returns.

