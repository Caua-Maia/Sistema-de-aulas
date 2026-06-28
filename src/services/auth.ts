/**
 * Serviço de autenticação — localStorage MVP.
 *
 * Para migrar para Supabase:
 *   - getUsers / saveUsers  →  supabase.from("users").select() / insert()
 *   - loginOrRegister       →  supabase.auth.signInWithPassword() / signUp()
 *   - getSession            →  supabase.auth.getSession()
 *   - logout                →  supabase.auth.signOut()
 *   Manter as mesmas assinaturas de retorno para que contexto/hooks não mudem.
 */

import { User, AuthSession } from "@/types/user";

export const USERS_STORAGE_KEY = "ford-enter-users";
export const SESSION_STORAGE_KEY = "ford-enter-auth";

// ─── Storage helpers ────────────────────────────────────────────────────────

function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function generateId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// ─── User helpers ────────────────────────────────────────────────────────────

export function findUserByEmail(email: string): User | undefined {
  return getUsers().find(
    (u) => u.email.toLowerCase() === email.toLowerCase().trim()
  );
}

export function createUser(email: string, password: string): User {
  const users = getUsers();
  const user: User = {
    id: generateId(),
    name: email.split("@")[0],
    email: email.toLowerCase().trim(),
    passwordHash: password,
    createdAt: new Date().toISOString(),
  };
  saveUsers([...users, user]);
  return user;
}

export function updateUser(updated: User): void {
  const users = getUsers().map((u) => (u.id === updated.id ? updated : u));
  saveUsers(users);
}

// ─── Session helpers ─────────────────────────────────────────────────────────

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as AuthSession;
  } catch {
    return null;
  }
}

function saveSession(userId: string): void {
  localStorage.setItem(
    SESSION_STORAGE_KEY,
    JSON.stringify({ userId } satisfies AuthSession)
  );
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

export function getCurrentUser(): User | null {
  const session = getSession();
  if (!session) return null;
  return getUsers().find((u) => u.id === session.userId) ?? null;
}

// ─── Auth actions ─────────────────────────────────────────────────────────────

export type LoginResult =
  | { ok: true; user: User; isNew: boolean }
  | { ok: false; error: string };

/**
 * Login MVP:
 *   - E-mail já existe → valida senha.
 *   - E-mail novo      → cria conta automaticamente (modo MVP).
 *
 * Substitua esta função por Supabase Auth sem alterar o contrato de retorno.
 */
export function loginOrRegister(
  email: string,
  password: string
): LoginResult {
  const trimmed = email.toLowerCase().trim();

  if (!trimmed || !password) {
    return { ok: false, error: "Preencha todos os campos." };
  }

  if (password.length < 4) {
    return { ok: false, error: "A senha deve ter pelo menos 4 caracteres." };
  }

  const existing = findUserByEmail(trimmed);

  if (existing) {
    if (existing.passwordHash !== password) {
      return { ok: false, error: "Senha incorreta." };
    }
    saveSession(existing.id);
    return { ok: true, user: existing, isNew: false };
  }

  const newUser = createUser(trimmed, password);
  saveSession(newUser.id);
  return { ok: true, user: newUser, isNew: true };
}

export function logout(): void {
  clearSession();
}
