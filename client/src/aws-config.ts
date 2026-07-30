import { Amplify } from "aws-amplify";
import { env } from "./config/env";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: env.cognitoUserPoolId,
      userPoolClientId: env.cognitoUserPoolClientId,
      loginWith: {
        email: true,
        oauth: {
          domain: env.cognitoDomain,
          scopes: ["openid", "email", "profile"],
          redirectSignIn: [...env.oauthRedirectSignIn],
          redirectSignOut: [...env.oauthRedirectSignOut],
          responseType: "code",
        },
      },
    },
  },
});
