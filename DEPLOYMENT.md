# InterviewAce AI AWS deployment

Production architecture:

- Frontend: AWS Amplify Hosting
- Backend: Amazon ECS Express Mode
- Container registry: Amazon ECR
- Database: Amazon DynamoDB (`InterviewAceInterviews`)
- Authentication: Amazon Cognito
- Secrets: AWS Secrets Manager
- Logs: Amazon CloudWatch Logs

This guide prepares manual deployment only. It does not create or update AWS
resources.

## Environment separation

Local development continues to use the ignored `server/.env` file:

```dotenv
NODE_ENV=development
AWS_REGION=ap-south-1
DYNAMODB_INTERVIEWS_TABLE=InterviewAceInterviews-dev
FRONTEND_URLS=http://localhost:5173
```

The backend defaults to port 5000 locally and uses the AWS SDK default
credential-provider chain, so a local AWS CLI profile can supply development
credentials. Restrict that identity to the development table where practical.

Production uses the ECS task role and this table:

```text
InterviewAceInterviews
```

No access key or secret access key is configured in the ECS container. Even
when the same Cognito subject exists in both environments, records remain
isolated by the different DynamoDB table names.

## Production container

`server/Dockerfile` is a multi-stage Node 22 LTS build:

1. The build stage installs locked dependencies and compiles TypeScript.
2. The runtime stage installs production dependencies only.
3. Only `package.json`, `package-lock.json`, production dependencies, and
   `dist/` are present at runtime.
4. The container runs as the image's unprivileged `node` user.
5. The command is `node dist/server.js`.

The Docker build context must be `server/`:

```bash
docker build -t interviewace-api:latest ./server
```

Local container verification:

```bash
docker run --rm -d --name interviewace-api-test \
  -p 5000:5000 \
  --env-file server/.env \
  interviewace-api:latest

curl --fail http://localhost:5000/health

docker exec interviewace-api-test node -e \
  "if (process.getuid?.() === 0) process.exit(1); console.log(process.getuid?.())"

docker stop interviewace-api-test
```

The local `.env` is supplied only at runtime and is excluded by
`server/.dockerignore`; it is not copied into the image.

## Production environment variables

Configure these as plain ECS container environment variables:

```dotenv
NODE_ENV=production
AWS_REGION=ap-south-1
DYNAMODB_INTERVIEWS_TABLE=InterviewAceInterviews
COGNITO_USER_POOL_ID=<production pool id>
COGNITO_USER_POOL_CLIENT_ID=<production client id>
FRONTEND_URLS=https://main.d1aqwxz5mscjq8.amplifyapp.com
GEMINI_PRIMARY_MODEL=gemini-3.5-flash
GEMINI_FALLBACK_MODEL=gemini-3.5-flash-lite
PORT=5000
```

`PORT=5000` matches the ECS container port. Do not configure
`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, or `GEMINI_API_KEY` as plain-text
environment variables. Inject `GEMINI_API_KEY` from Secrets Manager.

## IAM templates and role boundaries

Templates are stored in `deployment/`:

- `ecs-task-trust-policy.json`: trust for both ECS task roles
- `ecs-task-role-policy.json`: application access to production DynamoDB
- `ecs-task-execution-policy.json`: ECR pull, CloudWatch log delivery, and one
  Gemini secret
- `ecs-infrastructure-trust-policy.json`: ECS Express Mode infrastructure trust

Replace every `<ACCOUNT_ID>` placeholder before creating policies.

### Application task role

Create `interviewace-api-task-role` with the trust policy from
`ecs-task-trust-policy.json`. Attach `ecs-task-role-policy.json`. It permits
only:

```text
dynamodb:PutItem
dynamodb:Query
```

against:

```text
arn:aws:dynamodb:ap-south-1:<ACCOUNT_ID>:table/InterviewAceInterviews
```

The task role is used by application code through temporary task credentials.

### Task execution role

Create `interviewace-api-execution-role` with the same ECS task trust policy.
Attach `ecs-task-execution-policy.json`. It permits ECS/Fargate to:

- authenticate to ECR and pull only `interviewace-api` image layers;
- write streams and events only to `/ecs/interviewace-api`;
- retrieve only `interviewace/gemini-api-key` from Secrets Manager.

The execution role is used by ECS, not by application code. If the secret uses
a customer-managed KMS key, add narrowly scoped `kms:Decrypt`; it is not needed
for the default Secrets Manager KMS key.

### Express Mode infrastructure role

Create `ecsInfrastructureRoleForExpressServices` with
`ecs-infrastructure-trust-policy.json`, whose principal is
`ecs.amazonaws.com`. Attach the AWS-managed service-role policy:

```text
arn:aws:iam::aws:policy/service-role/AmazonECSInfrastructureRoleforExpressGatewayServices
```

This role lets ECS provision and manage Express Mode load balancing, security
groups, HTTPS certificates, networking, and autoscaling. It is not the
application task role and must not receive DynamoDB permissions.

The administrator creating the service also needs `iam:PassRole` for the task,
execution, and infrastructure roles, scoped with the appropriate passed-to
service conditions.

## Deployment order

### 1. Review and commit code

Review the Dockerfile, `.dockerignore`, IAM templates, and this guide. Commit
and push only after confirming no environment or credential files are staged.

### 2. Create the Gemini secret

1. Open **AWS Console → Secrets Manager → Secrets → Store a new secret**.
2. Secret type: **Other type of secret**.
3. Add key `GEMINI_API_KEY` and its production value.
4. Encryption key: `aws/secretsmanager`, unless a customer-managed key is
   specifically required.
5. Secret name: `interviewace/gemini-api-key`.
6. Do not enable automatic rotation unless a compatible rotation workflow has
   been prepared.
7. Record the secret ARN without copying its value elsewhere.

### 3. Create the ECR repository

Set placeholders in the shell performing the deployment:

```bash
AWS_REGION=ap-south-1
AWS_ACCOUNT_ID=<ACCOUNT_ID>
ECR_REPOSITORY=interviewace-api
IMAGE_TAG=<RELEASE_TAG>
```

Create the private repository:

```bash
aws ecr create-repository \
  --region "$AWS_REGION" \
  --repository-name "$ECR_REPOSITORY" \
  --image-scanning-configuration scanOnPush=true \
  --image-tag-mutability IMMUTABLE
```

### 4. Build and push the backend image

Authenticate Docker:

```bash
aws ecr get-login-password --region "$AWS_REGION" | \
  docker login --username AWS --password-stdin \
  "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
```

Build, tag, and push:

```bash
docker build -t "$ECR_REPOSITORY:$IMAGE_TAG" ./server

docker tag "$ECR_REPOSITORY:$IMAGE_TAG" \
  "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:$IMAGE_TAG"

docker push \
  "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:$IMAGE_TAG"
```

The resulting image URI is:

```text
<ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/interviewace-api:<RELEASE_TAG>
```

### 5. Create the ECS task role

1. Open **AWS Console → IAM → Roles → Create role**.
2. Trusted entity: **AWS service**.
3. Use case: **Elastic Container Service Task**.
4. Role name: `interviewace-api-task-role`.
5. Create a customer-managed policy from
   `deployment/ecs-task-role-policy.json` after replacing `<ACCOUNT_ID>`.
6. Attach only that application policy.

### 6. Create or verify the task execution role

1. Open **AWS Console → IAM → Roles → Create role**.
2. Use case: **Elastic Container Service Task**.
3. Role name: `interviewace-api-execution-role`.
4. Create and attach the policy from
   `deployment/ecs-task-execution-policy.json` after replacing `<ACCOUNT_ID>`.
5. Confirm its secret resource resolves only to
   `interviewace/gemini-api-key`.

### 7. Create the Express Mode infrastructure role

1. Open **AWS Console → IAM → Roles → Create role → Custom trust policy**.
2. Paste `deployment/ecs-infrastructure-trust-policy.json`.
3. Role name: `ecsInfrastructureRoleForExpressServices`.
4. Attach AWS-managed policy
   `AmazonECSInfrastructureRoleforExpressGatewayServices`.
5. Do not attach the DynamoDB application policy.

### 8. Create the ECS Express Mode backend service

1. Switch the AWS Console region to **Asia Pacific (Mumbai), ap-south-1**.
2. Open **Amazon ECS → Express mode**.
3. Under **Let's set up your app**, enter the ECR image URI.
4. Service name: `interviewace-api`.
5. Public/private access: **Public**.
6. Container port: `5000`.
7. Health check path: `/health`.
8. Task execution role: `interviewace-api-execution-role`.
9. Infrastructure role: `ecsInfrastructureRoleForExpressServices`.
10. Under additional configuration, task role:
    `interviewace-api-task-role`.
11. Starter compute: **1 vCPU** and **2 GB memory**.
12. Autoscaling metric: **Average CPU Utilization**.
13. Target: **60%**.
14. Minimum tasks: `1`; maximum tasks: `20`.
15. Enable CloudWatch logs using log group `/ecs/interviewace-api`.
16. Use the default VPC/public networking unless the production network design
    requires custom subnets and security groups.

Express Mode provisions the public HTTPS endpoint and supporting load balancer.

### 9. Configure environment variables and the Gemini secret

Enter the plain environment variables listed above. Under container secrets:

- Environment variable name: `GEMINI_API_KEY`
- Value source: `interviewace/gemini-api-key`, key `GEMINI_API_KEY`

Do not enter AWS credentials. The AWS SDK receives temporary credentials from
`interviewace-api-task-role`.

### 10. Verify health

Wait until the service is active, then open:

```text
https://<ECS_PUBLIC_URL>/health
```

Expected response:

```json
{"status":"ok"}
```

Inspect **ECS service → Logs** and the `/ecs/interviewace-api` CloudWatch log
group for startup failures. Logs must not contain secrets or tokens.

### 11. Copy the ECS HTTPS URL

Copy the unique Application URL shown by ECS Express Mode. Keep the `https://`
scheme and omit a trailing slash when composing the API base URL.

### 12. Update Amplify

Open **AWS Console → Amplify → InterviewAce AI → Hosting → Environment
variables** and set:

```text
VITE_API_BASE_URL=https://<ECS_PUBLIC_URL>/api
```

Preserve all existing Cognito and OAuth variables:

- `VITE_AWS_REGION`
- `VITE_COGNITO_USER_POOL_ID`
- `VITE_COGNITO_USER_POOL_CLIENT_ID`
- `VITE_COGNITO_DOMAIN`
- `VITE_OAUTH_REDIRECT_SIGN_IN`
- `VITE_OAUTH_REDIRECT_SIGN_OUT`

### 13. Redeploy Amplify

Vite environment variables are embedded at build time. Redeploy the Amplify
`main` branch after changing `VITE_API_BASE_URL`.

### 14. Verify production CORS

Confirm requests from
`https://main.d1aqwxz5mscjq8.amplifyapp.com` succeed and an unknown browser
origin is rejected. `FRONTEND_URLS` must contain an origin only, with no path.

### 15. Test the complete production workflow

- [ ] Email/password login
- [ ] Google login through Cognito
- [ ] Protected route access and refresh
- [ ] Interview generation
- [ ] Evaluation and Results
- [ ] Result saved in `InterviewAceInterviews`
- [ ] Dashboard history and metrics after refresh
- [ ] User-to-user history isolation
- [ ] Logout
- [ ] No Gemini key or AWS credential in browser requests or image layers
- [ ] `/health` returns HTTP 200

## Git hygiene

The root `.gitignore` excludes `node_modules`, `dist`, non-example `.env`
files, logs, AWS credential directories, and private keys. The Docker build
context independently excludes dependencies, build output, environment files,
tests, logs, Git metadata, and documentation.
