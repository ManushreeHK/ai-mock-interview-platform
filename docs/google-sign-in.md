# Google Sign-In Setup

Google Sign-In uses Google as a social identity provider for the existing
Amazon Cognito User Pool. The React application never receives or stores
Google OAuth tokens directly.

## Local application values

Add these values to `client/.env`:

```env
VITE_COGNITO_DOMAIN=<domain-prefix>.auth.<aws-region>.amazoncognito.com
VITE_OAUTH_REDIRECT_SIGN_IN=http://localhost:5173
VITE_OAUTH_REDIRECT_SIGN_OUT=http://localhost:5173
```

The Cognito domain value must not include `https://`.

## 1. Google Cloud OAuth client

In Google Cloud Console:

1. Configure the OAuth consent screen.
2. Create an OAuth client with application type **Web application**.
3. Add this exact authorized redirect URI:

```text
https://<your-cognito-domain>/oauth2/idpresponse
```

For example:

```text
https://interviewace.auth.ap-south-1.amazoncognito.com/oauth2/idpresponse
```

Copy the generated Google client ID and client secret into the Cognito
identity-provider configuration. Do not add the Google secret to the React
environment.

## 2. Cognito Google identity provider

In the existing Cognito User Pool:

1. Open **Social and external providers**.
2. Add **Google**.
3. Enter the Google OAuth client ID and client secret.
4. Authorize the scopes `openid email profile`.
5. Configure these attribute mappings:

```text
email       -> email
given_name  -> given_name
family_name -> family_name
name        -> name
```

Ensure mapped user-pool attributes are mutable and writable by the app
client.

## 3. Cognito app client

In the existing app client's managed-login settings:

1. Enable **Google** as an identity provider. Keep the existing Cognito
   user-pool provider enabled for email/password authentication.
2. Enable **Authorization code grant**.
3. Disable implicit grant unless another application explicitly requires it.
4. Enable these OpenID Connect scopes:

```text
openid
email
profile
```

5. Add this exact callback URL:

```text
http://localhost:5173
```

6. Add this exact sign-out URL:

```text
http://localhost:5173
```

Production callback and sign-out URLs must also be added here and supplied
through the corresponding production Vite environment variables. Cognito
allows HTTP callback URLs for localhost development; deployed applications
must use HTTPS.

## 4. Cognito domain

Under the User Pool's managed-login domain settings, create a Cognito domain
if one does not exist. Copy only the hostname into
`VITE_COGNITO_DOMAIN`.

The resulting authorization endpoint will be:

```text
https://<your-cognito-domain>/oauth2/authorize
```

## Verification

1. Start the client at `http://localhost:5173`.
2. Select **Continue with Google** from Login or Signup.
3. Complete Google authentication.
4. Confirm the browser returns to `/` while authentication is processed and
   then opens `/dashboard`.
5. Confirm `fetchAuthSession()` contains a Cognito access token.
6. Confirm interview API requests include:

```text
Authorization: Bearer <cognito-access-token>
```
