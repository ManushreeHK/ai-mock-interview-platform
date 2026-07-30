# InterviewAce AI production deployment

This guide deploys the existing application with:

- Frontend: AWS Amplify Hosting
- Backend: Render Web Service
- Database: existing AWS DynamoDB table
- Authentication: existing AWS Cognito user pool
- AI provider: Gemini API

It does not create, update, or deploy any cloud resources automatically.

## Discovered project structure

This repository contains two Node projects but is not an npm workspace:

- `client/`: React, TypeScript, Vite, Tailwind, React Router, Amplify Auth
- `server/`: Express, TypeScript, Gemini, DynamoDB, Cognito JWT verification
- `client/src/main.tsx`: browser entry point
- `client/src/App.tsx`: active frontend routes
- `client/src/services/api.ts`: Axios client and Cognito access-token interceptor
- `client/src/aws-config.ts`: Amplify/Cognito configuration
- `server/src/server.ts`: backend process entry
- `server/src/app.ts`: Express middleware, routes, and `/health`
- `server/src/config/env.ts`: centralized backend environment validation
- `server/src/config/dynamodb.ts`: DynamoDB client using the AWS SDK default credential chain

The client builds to `client/dist`. With `rootDir: server`,
`server/src/server.ts` compiles to `server/dist/server.js`.

## Verified commands

| Project | Install | Development | Build | Production start | Lint | Tests |
| --- | --- | --- | --- | --- | --- | --- |
| Client | `npm ci` | `npm run dev` | `npm run build` | `npm run preview` | `npm run lint` | No test script |
| Server | `npm ci` | `npm run dev` | `npm run build` | `npm start` | No lint script | No test script |

The server scripts are:

```text
Build: npm ci && npm run build
Start: npm start
Compiled entry: node dist/server.js
```

The server reads `process.env.PORT`, defaults to `5000` locally, binds to
`0.0.0.0`, and exposes `GET /health`. Render supplies `PORT`; do not add it
manually.

## Environment variables

### Render backend

Configure these under **Render Dashboard → interviewace-api → Environment**:

| Name | Type | Value |
| --- | --- | --- |
| `NODE_ENV` | Plain | `production` |
| `AWS_REGION` | Plain or secret | `<AWS_REGION>` |
| `DYNAMODB_INTERVIEWS_TABLE` | Plain or secret | `<DYNAMODB_INTERVIEWS_TABLE>` |
| `COGNITO_USER_POOL_ID` | Plain or secret | `<COGNITO_USER_POOL_ID>` |
| `COGNITO_USER_POOL_CLIENT_ID` | Plain or secret | `<COGNITO_USER_POOL_CLIENT_ID>` |
| `FRONTEND_URLS` | Plain | `https://<AMPLIFY_DOMAIN>` |
| `GEMINI_API_KEY` | Secret | Enter in Render only |
| `AWS_ACCESS_KEY_ID` | Secret | Dedicated backend IAM user access-key ID |
| `AWS_SECRET_ACCESS_KEY` | Secret | Dedicated backend IAM user secret |

Do not configure `PORT`. Render provides it automatically.

Never commit or expose:

- Gemini API key
- AWS access-key ID
- AWS secret access key
- AWS session token
- Cognito client secret

The existing Cognito app client ID is public configuration, but any Cognito
client **secret** must never be used in the browser or committed.

### Amplify frontend

All `VITE_` variables are embedded in browser assets and must contain public
configuration only:

| Name | Production value |
| --- | --- |
| `VITE_API_BASE_URL` | `https://<RENDER_SERVICE>.onrender.com/api` |
| `VITE_AWS_REGION` | `<AWS_REGION>` |
| `VITE_COGNITO_USER_POOL_ID` | `<COGNITO_USER_POOL_ID>` |
| `VITE_COGNITO_USER_POOL_CLIENT_ID` | `<COGNITO_USER_POOL_CLIENT_ID>` |
| `VITE_COGNITO_DOMAIN` | `<PREFIX>.auth.<AWS_REGION>.amazoncognito.com` |
| `VITE_OAUTH_REDIRECT_SIGN_IN` | `http://localhost:5173,https://<AMPLIFY_DOMAIN>` |
| `VITE_OAUTH_REDIRECT_SIGN_OUT` | `http://localhost:5173,https://<AMPLIFY_DOMAIN>` |

The Cognito domain must not include `https://`. The API base URL includes
`/api` because the client calls `/interview/...` and Express mounts the API at
`/api/interview`.

Never place Gemini or AWS credentials in a `VITE_` variable.

## DynamoDB access from Render

Render runs outside AWS and does not automatically inherit an AWS workload
role. For the initial deployment, create a dedicated IAM user used only by
this backend.

The repository currently sends only DynamoDB `PutCommand`, so
`deployment/dynamodb-backend-policy.json` grants only:

```text
dynamodb:PutItem
```

It does not grant `GetItem`, `UpdateItem`, `DeleteItem`, `Query`, or `Scan`.
The policy resource must resolve to:

```text
arn:aws:dynamodb:<AWS_REGION>:<AWS_ACCOUNT_ID>:table/<DYNAMODB_INTERVIEWS_TABLE>
```

IAM users do not use role trust policies. Attach the permissions policy
directly to the dedicated user, then create one access key for the Render
workload.

The application does not read explicit credential variables itself.
`DynamoDBClient` uses the AWS SDK default credential-provider chain:

- local development can use AWS CLI/profile credentials;
- Render can use `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` supplied as
  secret environment variables.

Do not hard-code credentials. Do not add them to `.env.example` as real
values. Do not print them in startup logs.

## CORS behavior

`FRONTEND_URLS` is a comma-separated allowlist:

```text
https://<AMPLIFY_DOMAIN>,https://app.example.com
```

- Development automatically permits `http://localhost:5173`.
- Production requires at least one configured origin.
- Trailing slashes are normalized.
- Values must be HTTP(S) origins without paths, query strings, or fragments.
- Unknown browser origins receive HTTP 403.
- Requests without an `Origin` header remain allowed.
- Cross-origin cookies are not enabled; API authentication uses bearer access
  tokens.

## Deployment order

### 1. Review the prepared changes

Review:

- `render.yaml`
- `amplify.yml`
- `deployment/dynamodb-backend-policy.json`
- `.env.example` files
- `.gitignore`
- this guide

No obsolete provider-specific runtime or trust configuration should remain.

### 2. Remove tracked server dependencies from Git

The local directory is already ignored, but approximately 2,058 files under
`server/node_modules` are tracked. From the repository root run:

```bash
git rm -r --cached server/node_modules
```

This removes the directory from Git's index without deleting the local
working copy. Review `git status` before committing.

Inspection found:

- tracked `server/node_modules`: yes
- tracked `client/node_modules`: no
- tracked `server/dist`: no
- tracked `client/dist`: no

### 3. Commit and push to GitHub

Commit only reviewed source/configuration changes and the intentional cached
dependency removals. Push to the existing GitHub repository's `main` branch.
Do not commit automatically generated secrets or local `.env` files.

### 4. Create a least-privilege IAM user

1. Open **AWS Console → IAM → Users → Create user**.
2. User name: `interviewace-render-backend` or the approved naming convention.
3. Do not enable AWS Management Console access.
4. Open **IAM → Policies → Create policy → JSON**.
5. Paste `deployment/dynamodb-backend-policy.json`.
6. Replace:
   - `<AWS_REGION>`
   - `<AWS_ACCOUNT_ID>`
   - `<DYNAMODB_INTERVIEWS_TABLE>`
7. Policy name: `InterviewAceDynamoDbBackendWrite`.
8. Create the policy.
9. Return to **IAM → Users → interviewace-render-backend → Add permissions →
   Attach policies directly**.
10. Attach only `InterviewAceDynamoDbBackendWrite`.
11. Open **Security credentials → Access keys → Create access key**.
12. Select the non-AWS workload/application use case and acknowledge the
    recommendation.
13. Copy the access-key ID and secret once into the corresponding Render
    secret fields.
14. Do not store them in Git, Amplify, browser storage, or frontend variables.

Rotate and revoke this access key according to the project's security policy.

### 5. Create the Render Web Service

You can create the service from the root Blueprint or enter the same values
manually.

#### Blueprint path

1. Open **Render Dashboard → New + → Blueprint**.
2. Connect the existing GitHub repository.
3. Blueprint file path: `render.yaml`.
4. Branch: `main`.
5. Service name: `interviewace-api`.
6. Supply every `sync: false` environment value when prompted.
7. Review the plan; do not add a database because DynamoDB already exists.

#### Equivalent Web Service fields

Open **Render Dashboard → New + → Web Service**, connect the GitHub
repository, and enter:

| Render field | Value |
| --- | --- |
| Name | `interviewace-api` |
| Language/Runtime | `Node` |
| Branch | `main` |
| Root Directory | `server` |
| Build Command | `npm ci && npm run build` |
| Start Command | `npm start` |
| Health Check Path | `/health` |
| Auto-Deploy | `On Commit` |

Choose the Render region and instance type according to latency, availability,
and budget requirements. Do not guess these values from source code.

Under **Environment**, add all backend variables listed above. Mark
`GEMINI_API_KEY`, `AWS_ACCESS_KEY_ID`, and `AWS_SECRET_ACCESS_KEY` as secrets.
Do not add `PORT`.

Before the Amplify URL exists, use a syntactically valid temporary value:

```text
FRONTEND_URLS=https://replace-after-amplify.invalid
```

Replace it immediately after Amplify assigns the production domain.

### 6. Deploy and verify Render

Trigger the first Render deploy. Then open:

```text
https://<RENDER_SERVICE>.onrender.com/health
```

Expected response:

```json
{"status":"ok"}
```

Copy:

```text
https://<RENDER_SERVICE>.onrender.com
```

The Amplify API variable must be:

```text
VITE_API_BASE_URL=https://<RENDER_SERVICE>.onrender.com/api
```

### 7. Deploy the frontend with Amplify

1. Open **AWS Console → AWS Amplify → Create new app**.
2. Choose **GitHub** and the existing repository.
3. Select branch `main`.
4. Enable monorepo mode.
5. App root: `client`.
6. Set `AMPLIFY_MONOREPO_APP_ROOT=client` if the console does not create it.
7. Confirm the repository-root `amplify.yml` runs:
   - `npm ci`
   - `npm run build`
   - publishes `client/dist`
8. Open **Hosting → Environment variables**.
9. Add all frontend variables listed above.
10. Set `VITE_API_BASE_URL` to the Render URL plus `/api`.
11. Save and deploy.

### 8. Configure the Amplify SPA rewrite

Open **AWS Amplify → InterviewAce app → Hosting → Rewrites and redirects →
Open text editor** and add:

```json
[
  {
    "source": "</^[^.]+$|\\.(?!(css|gif|ico|jpg|jpeg|js|png|txt|svg|woff|woff2|ttf|map|json|webp)$)([^.]+$)/>",
    "target": "/index.html",
    "status": "200",
    "condition": null
  }
]
```

This covers the actual routes `/`, `/login`, `/signup`, `/verify`,
`/dashboard`, `/create-interview`, `/interview`, and `/results`.

### 9. Update Cognito callback and sign-out URLs

1. Open **AWS Console → Amazon Cognito → User pools →
   `<COGNITO_USER_POOL>`**.
2. Open **App integration → App clients and analytics →
   `<COGNITO_USER_POOL_CLIENT_ID>`**.
3. Edit the managed-login/Hosted UI configuration.
4. Preserve and add callback URLs:
   - `http://localhost:5173`
   - `https://<AMPLIFY_DOMAIN>`
5. Preserve and add sign-out URLs:
   - `http://localhost:5173`
   - `https://<AMPLIFY_DOMAIN>`
6. Confirm:
   - identity provider: Google
   - OAuth grant: Authorization code grant
   - scopes: `openid`, `email`, `profile`
7. Save.

Update Amplify environment variables:

```text
VITE_OAUTH_REDIRECT_SIGN_IN=http://localhost:5173,https://<AMPLIFY_DOMAIN>
VITE_OAUTH_REDIRECT_SIGN_OUT=http://localhost:5173,https://<AMPLIFY_DOMAIN>
```

Redeploy Amplify because Vite variables are build-time configuration.

### 10. Preserve the Google OAuth redirect

Open **Google Cloud Console → APIs & Services → Credentials → Web application
OAuth client**.

The authorized redirect URI remains:

```text
https://<COGNITO_DOMAIN>/oauth2/idpresponse
```

Do not replace it with the Render backend URL or Amplify URL. Google returns
to Cognito; Cognito then returns to the registered Amplify callback.
Production URLs use HTTPS, while localhost may remain HTTP.

### 11. Finalize Render CORS

Open **Render Dashboard → interviewace-api → Environment** and set:

```text
FRONTEND_URLS=https://<AMPLIFY_DOMAIN>
```

For an optional custom domain:

```text
FRONTEND_URLS=https://<AMPLIFY_DOMAIN>,https://app.example.com
```

Save and redeploy the Render service. Redeploy Amplify only if a frontend
build-time variable also changed.

## Production test checklist

- [ ] Landing page loads over HTTPS.
- [ ] Signup and email verification work.
- [ ] Email/password login reaches the dashboard.
- [ ] Google login completes through Cognito.
- [ ] Google profile name, email, and photo render.
- [ ] New Interview works immediately after Google login.
- [ ] Logout returns to the landing page.
- [ ] Dashboard and protected routes refresh directly.
- [ ] `/create-interview` blocks unauthenticated users.
- [ ] `/interview` without questions shows the existing empty state.
- [ ] Interview generation succeeds.
- [ ] Voice recording works with browser permission.
- [ ] Evaluation submission succeeds.
- [ ] Results page displays the saved result.
- [ ] DynamoDB receives the expected item.
- [ ] Mobile layout works.
- [ ] Amplify SPA rewrites work for every actual route.
- [ ] Allowed production CORS origin succeeds.
- [ ] Unknown browser origin is rejected.
- [ ] Missing, expired, and invalid tokens return standardized 401 responses.
- [ ] Runtime exceptions show the protected-route error boundary.
- [ ] Render `/health` returns HTTP 200.
- [ ] Browser requests never expose Gemini or AWS credentials.
- [ ] Render logs never print credentials, tokens, or personal claims.

## Git and release safety

The root `.gitignore` covers:

- `node_modules`
- `.env`, `.env.local`, and `.env.production`
- `dist`
- logs
- local AWS credential directories/files
- private key files

Safe `.env.example` files remain tracked.

Before production:

1. Run a full-history secret scanner such as Gitleaks or TruffleHog.
2. If a real secret is found, revoke and rotate it before cleanup.
3. Do not rewrite Git history without explicit coordination.
4. Review `git diff --check` and `git status`.
5. Confirm `server/node_modules` is no longer tracked after the cached removal.

## Known verification findings

- The client production build currently emits a non-blocking Vite chunk-size
  warning.
- The client production dependency audit previously reported high-severity
  findings involving `react-router-dom` and `react-router`; review a tested
  dependency remediation before production.
- The server production dependency audit reported zero vulnerabilities.
- Neither project currently defines automated tests, and the server does not
  define a lint script.
