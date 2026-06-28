/**
 * Serviço de autenticação — localStorage MVP.
 *
 * Para migrar para Supabase, substitua cada função mantendo o mesmo contrato de retorno:
 *   login()           →  supabase.auth.signInWithPassword()
 *   register()        →  supabase.auth.signUp() + supabase.from("users").insert()
 *   logout()          →  supabase.auth.signOut()
 *   getCurrentUser()  →  supabase.auth.getUser() + supabase.from("users").select()
 *   getSession()      →  supabase.auth.getSession()
 */

import { User, AuthSession } from "@/types/user";

export const USERS_STORAGE_KEY = "ford-enter-users";
export const SESSION_STORAGE_KEY = "ford-enter-auth";

// ─── Resultado comum ──────────────────────────────────────────────────────────

export type AuthResult =
  | { ok: true; user: User }
  | { ok: false; error: string };

// ─── Storage helpers (privados) ───────────────────────────────────────────────

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

function saveSession(userId: string): void {
  localStorage.setItem(
    SESSION_STORAGE_KEY,
    JSON.stringify({ userId } satisfies AuthSession)
  );
}

// ─── User helpers (exportados para uso interno) ───────────────────────────────

export function findUserByEmail(email: string): User | undefined {
  return getUsers().find(
    (u) => u.email.toLowerCase() === email.toLowerCase().trim()
  );
}

export function updateUser(updated: User): void {
  saveUsers(getUsers().map((u) => (u.id === updated.id ? updated : u)));
}

// ─── Session helpers ──────────────────────────────────────────────────────────

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

export function clearSession(): void {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

export function getCurrentUser(): User | null {
  const session = getSession();
  if (!session) return null;
  return getUsers().find((u) => u.id === session.userId) ?? null;
}

// ─── Ações de autenticação ────────────────────────────────────────────────────

/**
 * Faz login com e-mail e senha.
 * Nunca cria conta — retorna erro se o e-mail não existir.
 *
 * Supabase: substituir por supabase.auth.signInWithPassword({ email, password })
 */
export function login(email: string, password: string): AuthResult {
  const trimmed = email.toLowerCase().trim();

  if (!trimmed || !password) {
    return { ok: false, error: "Preencha todos os campos." };
  }

  const user = findUserByEmail(trimmed);

  if (!user) {
    return {
      ok: false,
      error: "Conta não encontrada. Crie uma conta para continuar.",
    };
  }

  if (user.passwordHash !== password) {
    return { ok: false, error: "Senha incorreta." };
  }

  saveSession(user.id);
  return { ok: true, user };
}

/**
 * Cria uma nova conta e inicia sessão automaticamente.
 * Retorna erro se o e-mail já estiver cadastrado.
 *
 * Supabase: substituir por supabase.auth.signUp() + insert na tabela users.
 */
export function register(
  name: string,
  email: string,
  password: string
): AuthResult {
  const trimmedEmail = email.toLowerCase().trim();
  const trimmedName = name.trim();

  if (!trimmedName || !trimmedEmail || !password) {
    return { ok: false, error: "Preencha todos os campos." };
  }

  if (findUserByEmail(trimmedEmail)) {
    return { ok: false, error: "Este e-mail já está cadastrado." };
  }

  const users = getUsers();
  const newUser: User = {
    id: generateId(),
    name: trimmedName,
    email: trimmedEmail,
    passwordHash: password,
    createdAt: new Date().toISOString(),
  };

  saveUsers([...users, newUser]);
  saveSession(newUser.id);
  return { ok: true, user: newUser };
}

/**
 * Encerra a sessão atual.
 *
 * Supabase: substituir por supabase.auth.signOut()
 */
export function logout(): void {
  clearSession();
}
