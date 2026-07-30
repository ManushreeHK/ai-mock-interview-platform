export type AuthenticatedUser = {
  sub: string;
  username: string;
  clientId: string;
  scope: string;
  groups: string[];
};

declare global {
  namespace Express {
    interface Request {
      authenticatedUser?: AuthenticatedUser;
    }
  }
}

export {};
