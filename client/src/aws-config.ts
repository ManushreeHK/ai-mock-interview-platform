import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "ap-south-1_BZAwQA8lI",
      userPoolClientId: "3mc28s01d84a8n38di06vlb9lh",
      loginWith: {
        email: true,
      },
    },
  },
});