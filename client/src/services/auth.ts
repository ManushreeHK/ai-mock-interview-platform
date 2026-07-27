import {
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  fetchAuthSession,
  confirmSignUp,
  fetchUserAttributes
} from "aws-amplify/auth";


export async function login(email: string, password: string) {
  return await signIn({
    username: email,
    password,
  });
}

export async function register(name: string,email: string, password: string) {
  return await signUp({
    username: email,
    password,
    options: {
      userAttributes: {
        email,
        name
      },
    },
  });
}

export async function verifyEmail(
  email: string,
  code: string
) {
  return await confirmSignUp({
    username: email,
    confirmationCode: code,
  });
}

export async function logout() {
  await signOut();
}

export async function currentUser() {
  return await getCurrentUser();
}

export async function getSession() {
  return await fetchAuthSession();
}
export async function getUserAttributes() {
  return await fetchUserAttributes();
}