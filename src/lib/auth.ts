export const MOCK_CREDENTIALS = {
  email: "aluno@fordenter.com",
  password: "123456",
} as const;

export const AUTH_STORAGE_KEY = "ford-enter-auth";

export interface AuthUser {
  email: string;
  name: string;
}

export function isValidCredentials(email: string, password: string): boolean {
  return (
    email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password
  );
}
