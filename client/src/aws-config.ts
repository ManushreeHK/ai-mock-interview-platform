import { Amplify } from "aws-amplify";
import { env } from "./config/env";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: env.cognitoUserPoolId,
      userPoolClientId: env.cognitoUserPoolClientId,
      loginWith: {
        email: true,
      },
    },
  },
});
