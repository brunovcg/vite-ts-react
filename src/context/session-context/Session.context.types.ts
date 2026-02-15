export type User = {
  name: string;
  email: string;
  username: string;
  isAuthenticated: boolean;
};

export type SessionContext = { user: User; logout: VoidFunction; login: (args: { email: string }) => void };
