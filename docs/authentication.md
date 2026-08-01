# Authentication

## Cognito User Pool

InterviewAce AI uses an Amazon Cognito User Pool and one configured app client. The client identifiers and Cognito hosted-domain name are Vite configuration; they are identifiers, not secrets. The app does not use a Cognito Identity Pool.

## Email/password flow

1. `/signup` calls Amplify `signUp` using the email as the username and sends `email` and `name` user attributes.
2. Cognito sends a confirmation code.
3. `/verify` calls `confirmSignUp` with the email and code.
4. `/login` calls `signIn` with email and password.
5. After a successful session refresh, the client navigates to `/dashboard`.

Password rules, message delivery, and token lifetimes are Cognito pool configuration and are not defined as infrastructure in this repository.

## Google federation

The Google button calls `signInWithRedirect({ provider: "Google" })`. Amplify uses the Cognito hosted UI with:

- authorization code response type
- scopes `openid`, `email`, and `profile`
- account-selection prompt

Google client credentials belong in the Cognito identity-provider configuration, not in this repository or the React environment.

## Callback and sign-out URLs

The application accepts comma-separated URL lists through:

```dotenv
VITE_OAUTH_REDIRECT_SIGN_IN=http://localhost:5173,https://main.d1aqwxz5mscjq8.amplifyapp.com
VITE_OAUTH_REDIRECT_SIGN_OUT=http://localhost:5173,https://main.d1aqwxz5mscjq8.amplifyapp.com
```

These exact roots must also be registered as allowed callback and sign-out URLs on the Cognito app client. The corresponding Google OAuth authorized redirect is Cognito's provider endpoint (normally `https://<cognito-domain>/oauth2/idpresponse`), while the application callback remains one of the roots above.

On a browser URL containing `code`, `AuthProvider` retries session resolution up to 20 times at 250 ms intervals while Amplify completes code exchange. Amplify Hub events also trigger resolution. A successful OAuth callback is replaced with `/dashboard`; callback failure produces an unauthenticated state.

## `AuthProvider`

`client/src/auth/AuthProvider.tsx` is the centralized source for:

- `loading`, `authenticated`, and `unauthenticated` state
- current Amplify user
- normalized profile
- explicit session refresh
- sign-in, redirect, failure, and sign-out Hub events

The provider requires both access and ID tokens before marking a session authenticated. It derives profile data from ID-token claims:

| Profile field | Claim behavior |
| --- | --- |
| `userId` | `sub` (required) |
| `email` | `email` |
| `displayName` | `name`, then `given_name`, then `preferred_username`, then email prefix |
| `picture` | `picture`, when present |

Profile claims are for display. API authorization and data ownership use the verified access-token `sub`.

## Protected routes

`ProtectedRoute` displays a loading state while authentication is resolving, redirects unauthenticated visitors to `/login`, and renders children for authenticated sessions. It currently wraps `/dashboard`, `/create-interview`, `/results`, `/profile`, `/settings`, `/subscription`, and `/help`.

Implementation note: `/interview` is not wrapped by `ProtectedRoute`. It normally receives questions from the protected creation page through router state, and its evaluate API request remains protected server-side. Direct route protection is a known gap.

## Access tokens on API calls

`client/src/services/api.ts` installs an Axios request interceptor. Before every API request it calls `fetchAuthSession`, attaches the access token as a Bearer token when present, and removes the header if session retrieval fails.

The server middleware in `server/src/middleware/authenticate.ts`:

- requires a syntactically valid Bearer header;
- verifies a Cognito access token for the configured User Pool and app client;
- distinguishes missing, expired, and otherwise invalid tokens;
- exposes verified `sub`, username, client ID, scopes, and groups to controllers.

The code does not impose an additional required OAuth scope on interview routes. A valid access token issued to the configured client is sufficient.

## User identity and isolation

Generate/evaluate deduplication keys and all DynamoDB ownership use `req.authenticatedUser.sub`. Evaluation and history requests do not accept `userId` as a trusted input. Users with the same email address in separate development and production User Pools can have different `sub` values and therefore separate records; email is not the database key.

## Logout

Navigation logout actions call Amplify `signOut`. The auth Hub `signedOut` handler clears user/profile state and replaces the current route with `/`. Components also navigate to `/` after successful logout. No server-side session store exists.

## Security considerations

- Never log or commit access tokens, ID tokens, authorization codes, Google client secrets, or populated environment files.
- Use HTTPS outside localhost and register only exact callback/sign-out URLs.
- The API must receive access tokens, not ID tokens.
- Keep the Cognito app client free of a client secret for a browser public client.
- Configure only necessary OAuth scopes (`openid email profile` currently).
- Token expiry is enforced by `aws-jwt-verify`; the frontend relies on Amplify for session refresh.
- CORS is not authentication. The API verifies every protected call independently.
