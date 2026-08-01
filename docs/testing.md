# Testing

## Current strategy

The repository has focused Node test-runner suites rather than end-to-end browser automation.

- Server tests cover retry/fallback behavior, evaluation parsing and error mapping, score validation, persistence failure handling, history pagination/isolation/normalization, and the Lambda adapter/secret-loading path.
- Client tests cover deterministic dashboard metrics plus history parsing, search, filters, sorting, pagination de-duplication, and saved-result validation.
- TypeScript builds catch type errors; client lint enforces the configured ESLint rules.
- SAM validation/build checks infrastructure syntax and bundles the Lambda entry.
- Production smoke tests remain manual and require a real authenticated session and cloud resources.

Test counts are intentionally not recorded here until the commands are run against the final documentation worktree; see the verification report in the task handoff for current output.

## Server commands

```powershell
cd server
npm test
npm run build
```

`npm test` runs these explicit suites:

```text
test/reliability.test.ts
test/evaluation.test.ts
test/history.test.ts
test/lambda.test.ts
```

## Client commands

```powershell
cd client
npm test
npm run build
npm run lint
```

The user-requested baseline is build and lint; `npm test` is also implemented and should be run because it verifies real dashboard metrics.

## SAM commands

From the repository root:

```powershell
sam validate --lint --region ap-south-1
sam build
```

These commands do not deploy. `sam build` requires esbuild, which is declared in `server/devDependencies`, and a working SAM CLI installation.

## Deployment smoke-test checklist

- [ ] `GET /health` returns `{"status":"ok"}`
- [ ] Email/password registration, verification, and login work
- [ ] Google login returns to the production application
- [ ] Protected route refresh retains or restores the session
- [ ] Authenticated generate returns questions
- [ ] Authenticated evaluate returns scores and feedback
- [ ] Every returned score is between 0 and 10
- [ ] A completed result is persisted in `InterviewAceInterviews`
- [ ] History returns only the current user's records, newest first
- [ ] Saved history detail refreshes and another user receives 404 for that ID
- [ ] Dashboard refresh displays persisted metrics and recent interviews
- [ ] CORS preflight accepts the Amplify origin and rejects an unknown origin
- [ ] Logout clears the session and returns to the public application
- [ ] Browser bundle/network inspection exposes no Gemini key or AWS credentials

Example public health test:

```powershell
Invoke-RestMethod https://wbdxdn6su7.execute-api.ap-south-1.amazonaws.com/prod/health
```

Authenticated calls should use a short-lived token supplied interactively or by a secure test harness. Do not commit it or paste it into test artifacts.

## Gaps

There are no repository tests for full browser navigation, real Cognito/Google OAuth, browser microphone permissions, live Gemini behavior, deployed CORS, CloudFormation deployment, or DynamoDB integration against a disposable table. Those require manual smoke tests or future integration/E2E automation.
