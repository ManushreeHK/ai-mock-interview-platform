# Local development

## Prerequisites

- Node.js 22 or later and npm
- AWS CLI configured through the standard credential chain
- Access to Cognito and `InterviewAceInterviews-dev` in `ap-south-1`
- A local Gemini API key
- A browser with Web Speech API support for voice input

## Backend

```powershell
cd server
npm install
Copy-Item .env.example .env
npm run dev
```

The backend runs at `http://localhost:5000`; API routes use `http://localhost:5000/api`. `tsx watch` restarts the server when TypeScript source changes.

`server/.env` requires:

```dotenv
NODE_ENV=development
AWS_REGION=ap-south-1
DYNAMODB_INTERVIEWS_TABLE=InterviewAceInterviews-dev
FRONTEND_URLS=http://localhost:5173
COGNITO_USER_POOL_ID=<USER_POOL_ID>
COGNITO_USER_POOL_CLIENT_ID=<APP_CLIENT_ID>
GEMINI_API_KEY=<LOCAL_GEMINI_API_KEY>
GEMINI_PRIMARY_MODEL=gemini-3.5-flash
GEMINI_FALLBACK_MODEL=gemini-3.5-flash-lite
GEMINI_REQUEST_TIMEOUT_MS=24000
```

`PORT` is optional and defaults to `5000`. `GEMINI_SECRET_ID` is not used by the normal local server entry.

The DynamoDB SDK uses the normal AWS credential provider chain. For example:

```powershell
aws configure
aws sts get-caller-identity
aws dynamodb describe-table --region ap-south-1 --table-name InterviewAceInterviews-dev
```

Prefer a named profile or short-lived credentials and restrict access to the development table. Never put AWS keys in tracked files.

## Frontend

In a second terminal:

```powershell
cd client
npm install
Copy-Item .env.example .env
npm run dev
```

The frontend runs at `http://localhost:5173`.

`client/.env` requires:

```dotenv
VITE_API_BASE_URL=http://localhost:5000/api
VITE_AWS_REGION=ap-south-1
VITE_COGNITO_USER_POOL_ID=<USER_POOL_ID>
VITE_COGNITO_USER_POOL_CLIENT_ID=<APP_CLIENT_ID>
VITE_COGNITO_DOMAIN=<COGNITO_DOMAIN>
VITE_OAUTH_REDIRECT_SIGN_IN=http://localhost:5173,https://main.d1aqwxz5mscjq8.amplifyapp.com
VITE_OAUTH_REDIRECT_SIGN_OUT=http://localhost:5173,https://main.d1aqwxz5mscjq8.amplifyapp.com
```

Vite variables are browser-visible configuration. Do not place Gemini keys, AWS credentials, Cognito/Google client secrets, or JWTs in them.

## Local Cognito and Google OAuth

Local development uses a real Cognito User Pool; there is no local auth emulator. Register `http://localhost:5173` in the Cognito app client's allowed callback and sign-out URLs. Configure `openid email profile`, authorization code flow, and Google as a supported identity provider. The Google provider redirects through Cognito's `/oauth2/idpresponse`; Google credentials stay in Cognito.

Changes to `.env` require restarting Vite. Cognito callback settings must match scheme, host, port, path, and trailing slash behavior exactly.

## Microphone and speech recognition

The interview page uses the browser Web Speech API (`SpeechRecognition` or `webkitSpeechRecognition`) with `en-US`. Grant microphone permission separately for `http://localhost:5173` and the production Amplify origin. Localhost is treated as a secure context by modern browsers, but API support varies; Chromium-based browsers are the safest choice. Typed transcript entry remains available.

## Verification

```powershell
Invoke-RestMethod http://localhost:5000/health
```

Then test sign-in, generation, evaluation, dashboard reload, and a matching item in the development table.

## Common problems

- **Backend exits on startup:** compare `server/.env` with `server/.env.example`; configuration is validated during module import.
- **Frontend shows a configuration error:** all required Vite values must be present, and the User Pool region must match `VITE_AWS_REGION`.
- **401 from interview endpoints:** sign in again and confirm the frontend and server use the same User Pool/app client.
- **CORS error:** include `http://localhost:5173` in `FRONTEND_URLS`; restart the server.
- **DynamoDB resource not found:** create/locate `InterviewAceInterviews-dev` in `ap-south-1` with the exact key schema.
- **Google callback mismatch:** register the exact localhost root in Cognito and Vite configuration.
- **No speech input:** grant permission and use a supported browser; type answers when unavailable.
- **Gemini failures:** confirm the local key and inspect only safe status/error metadata, not prompts or credentials.

See [Troubleshooting](troubleshooting.md) for detailed diagnostics.

