# InterviewAce AI serverless deployment

Production architecture:

- Frontend: AWS Amplify Hosting
- Backend: Amazon API Gateway REST API and AWS Lambda
- Database: Amazon DynamoDB (`InterviewAceInterviews`)
- Authentication: Amazon Cognito access tokens verified by Express middleware
- Secrets: AWS Secrets Manager
- Logs and duration metrics: Amazon CloudWatch

This guide contains manual deployment steps only. It does not create or modify
AWS resources until an operator explicitly runs `sam deploy`.

## Why API Gateway REST API

No production request-duration logs are available in this repository, and the
Gemini tests use controlled mock calls rather than the live provider. The
available Lambda adapter tests complete in approximately 1.1 seconds or less,
but those values do not predict generation or evaluation latency.

Before this change, the retry policy could wait 14 seconds in backoff and each
provider call had no deadline. Generation or evaluation could therefore exceed
29–30 seconds even with low quota usage. API Gateway HTTP APIs have a fixed
30-second maximum integration timeout. This deployment uses a Regional REST API
because its timeout can be explicitly controlled and can later be increased by
quota request if production measurements justify it.

Current synchronous limits:

- Gemini end-to-end deadline: 24 seconds, including calls and retry sleeps
- REST API Lambda integration timeout: 28 seconds
- Lambda timeout: 60 seconds

The application returns the existing `AI_SERVICE_BUSY` 503 response when the
24-second Gemini deadline expires. This leaves four seconds for Express and API
Gateway serialization before the integration deadline.

The asynchronous evaluation design is not implemented because there are no
live measurements showing regular deadline overruns and it would change the
client contract. If CloudWatch shows frequent durations near 22–24 seconds,
move evaluation to a job workflow before high traffic:

```text
POST /api/interview/evaluate -> 202 + jobId
worker Lambda -> Gemini evaluation and DynamoDB save
GET /api/interview/evaluation-status/:jobId -> job state/result
```

## Existing Express application

Local development remains unchanged:

```bash
cd server
npm run dev
```

The local backend remains `http://localhost:5000`, and the client continues to
use:

```dotenv
VITE_API_BASE_URL=http://localhost:5000/api
```

`server/src/server.ts` is the only file that calls `app.listen`. The Lambda
entry `server/src/lambda.ts` wraps the same exported Express app with
`@codegenie/serverless-express`. Routes, middleware, authentication, CORS,
errors, and `/health` are not duplicated.

`npm run build` produces both:

```text
server/dist/server.js
server/dist/lambda.js
```

## Environment separation

Local `server/.env` remains ignored and uses:

```dotenv
NODE_ENV=development
AWS_REGION=ap-south-1
DYNAMODB_INTERVIEWS_TABLE=InterviewAceInterviews-dev
FRONTEND_URLS=http://localhost:5173
```

Local credentials may come from the AWS CLI/default provider chain. Restrict
the local IAM identity to the development table where practical.

Lambda receives these production variables from `template.yaml`:

```dotenv
NODE_ENV=production
DYNAMODB_INTERVIEWS_TABLE=InterviewAceInterviews
COGNITO_USER_POOL_ID=<production pool id>
COGNITO_USER_POOL_CLIENT_ID=<production client id>
FRONTEND_URLS=https://main.d1aqwxz5mscjq8.amplifyapp.com
GEMINI_PRIMARY_MODEL=gemini-3.5-flash
GEMINI_FALLBACK_MODEL=gemini-3.5-flash-lite
GEMINI_REQUEST_TIMEOUT_MS=24000
GEMINI_SECRET_ID=interviewace/gemini-api-key
```

Lambda supplies the reserved `AWS_REGION=ap-south-1` variable automatically;
the template must not redefine that reserved name. No AWS access keys are
configured. The AWS SDK uses temporary Lambda execution-role credentials.

## AWS SAM resources

The repository-root `template.yaml` defines:

- `InterviewAceFunction`: Node.js 22, arm64, 1024 MB, 60-second Lambda
- `InterviewAceApi`: Regional API Gateway REST API with stage `prod`
- `/{proxy+}` Lambda proxy integration preserving every existing path
- API Gateway mock `OPTIONS` integration for production CORS preflight
- Lambda invoke permission scoped to this REST API
- Lambda basic CloudWatch logging permissions
- DynamoDB `PutItem` and `Query` on the production table only
- Secrets Manager `GetSecretValue` on the Gemini secret only
- outputs for the invoke URL and exact Amplify API base URL

All runtime dependencies are bundled by SAM's esbuild integration. Development
dependencies are build-time only and are not required by Lambda.

## IAM permissions

The generated Lambda execution role allows:

```text
logs:CreateLogGroup
logs:CreateLogStream
logs:PutLogEvents
dynamodb:PutItem
dynamodb:Query
secretsmanager:GetSecretValue
```

DynamoDB is restricted to:

```text
arn:aws:dynamodb:ap-south-1:<ACCOUNT_ID>:table/InterviewAceInterviews
```

Secrets Manager is restricted to the ARN for:

```text
interviewace/gemini-api-key
```

The development table, DynamoDB Scan, AWS access keys, and wildcard application
data permissions are not included.

## Deployment order

### 1. Install or update AWS SAM CLI

Follow the AWS SAM CLI installer for the deployment workstation, then verify:

```bash
sam --version
aws --version
```

Configure an AWS CLI identity authorized to deploy CloudFormation, Lambda, API
Gateway, IAM, and the referenced DynamoDB/Secrets Manager resources in
`ap-south-1`.

### 2. Create or verify the Gemini secret

Console path:

**AWS Console → Secrets Manager → Secrets → Store a new secret**

1. Secret type: **Other type of secret**.
2. Key: `GEMINI_API_KEY`.
3. Value: production Gemini key.
4. Encryption: default `aws/secretsmanager`, unless a managed KMS key is
   intentionally required.
5. Secret name: `interviewace/gemini-api-key`.

CLI verification without retrieving the secret value:

```bash
aws secretsmanager describe-secret \
  --region ap-south-1 \
  --secret-id interviewace/gemini-api-key
```

Never pass the secret through SAM parameters, Git, Amplify, or logs.

### 3. Build with SAM

From the repository root:

```bash
sam validate --lint --region ap-south-1
sam build
```

Optional local API emulation after building:

```bash
cd server
npm run sam:build
npm run sam:local
```

Regular local development does not require SAM.

### 4. Deploy through a reviewed change set

Copy the example configuration only if desired:

```bash
cp samconfig.toml.example samconfig.toml
```

Then run:

```bash
sam deploy --guided
```

Use:

```text
Stack name: interviewace-api-prod
Region: ap-south-1
Confirm changes before deploy: Yes
Allow SAM CLI IAM role creation: Yes
Save arguments to samconfig.toml: Yes
```

### 5. Supply production parameters

During the guided deployment provide:

```text
CognitoUserPoolId=<production pool id>
CognitoUserPoolClientId=<production app client id>
InterviewsTableName=InterviewAceInterviews
FrontendOrigin=https://main.d1aqwxz5mscjq8.amplifyapp.com
GeminiSecretName=interviewace/gemini-api-key
```

The DynamoDB table must already have:

- partition key `userId`, String
- sort key `interviewId`, String

### 6. Confirm REST API creation

SAM creates a Regional API Gateway REST API and `prod` stage. Console path:

**AWS Console → API Gateway → APIs → interviewace-api → Stages → prod**

Confirm the proxy integration timeout is 28,000 milliseconds and the API type
is REST, not HTTP.

### 7. Verify health and preflight

Read the stack output:

```bash
aws cloudformation describe-stacks \
  --region ap-south-1 \
  --stack-name interviewace-api-prod \
  --query "Stacks[0].Outputs"
```

Health check:

```bash
curl --fail \
  "https://<API_ID>.execute-api.ap-south-1.amazonaws.com/prod/health"
```

Expected body:

```json
{"status":"ok"}
```

Production preflight:

```bash
curl -i -X OPTIONS \
  -H "Origin: https://main.d1aqwxz5mscjq8.amplifyapp.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Authorization,Content-Type" \
  "https://<API_ID>.execute-api.ap-south-1.amazonaws.com/prod/api/interview/generate"
```

The response must not use `Access-Control-Allow-Origin: *`.

### 8. Copy the API Gateway base URL

Because the client already calls `/interview/...`, the exact Amplify value is:

```text
https://<API_ID>.execute-api.ap-south-1.amazonaws.com/prod/api
```

Do not append another `/api`.

### 9. Update Amplify

Console path:

**AWS Console → Amplify → InterviewAce AI → Hosting → Environment variables**

Set:

```dotenv
VITE_API_BASE_URL=https://<API_ID>.execute-api.ap-south-1.amazonaws.com/prod/api
```

Preserve all existing Cognito and OAuth variables.

### 10. Redeploy Amplify

Vite variables are build-time configuration. Redeploy branch `main` after the
API base URL changes.

### 11. Test production

- [ ] Email/password login
- [ ] Google login
- [ ] Protected route refresh
- [ ] Interview generation
- [ ] Evaluation and Results
- [ ] DynamoDB persistence in `InterviewAceInterviews`
- [ ] Dashboard history and metrics after refresh
- [ ] User history isolation
- [ ] Logout
- [ ] Unknown CORS origin rejected
- [ ] Browser contains no Gemini key or AWS credentials

### 12. Monitor duration and errors

Console paths:

- **AWS Console → Lambda → interviewace-api → Monitor**
- **AWS Console → CloudWatch → Log groups → /aws/lambda/interviewace-api**
- **AWS Console → API Gateway → interviewace-api → Stages → prod**

Monitor Lambda `Duration`, `Errors`, `Throttles`, API latency, 5XX responses,
and `AI_SERVICE_BUSY`. Do not log prompts, answers, tokens, or secret values.
Prepare the asynchronous evaluation workflow if live evaluation regularly
approaches the 24-second provider deadline.
