/**
 * Serviço de autenticação — Supabase Auth.
 *
 * Todas as funções são async e retornam Promise<AuthResult>.
 * O AuthContext consome este serviço e expõe a interface para a UI.
 */

import { supabase } from "@/lib/supabase";
import { isMonitorEmail } from "@/lib/monitor";
import { User } from "@/types/user";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type AuthResult =
  | { ok: true; user: User }
  | { ok: false; error: string };

// ─── Mapeamento de erros do Supabase ──────────────────────────────────────────

function mapAuthError(message: string): string {
  const m = message.toLowerCase();

  if (m.includes("user already registered") || m.includes("already been registered")) {
    return "Este e-mail já está cadastrado.";
  }
  if (m.includes("invalid login credentials") || m.includes("invalid email or password")) {
    return "E-mail ou senha incorretos.";
  }
  if (m.includes("email not confirmed")) {
    return "Confirme seu e-mail antes de entrar.";
  }
  if (m.includes("password should be at least")) {
    return "A senha deve ter pelo menos 6 caracteres.";
  }
  if (m.includes("unable to validate email address")) {
    return "Informe um e-mail válido.";
  }
  if (m.includes("network") || m.includes("fetch")) {
    return "Sem conexão. Verifique sua internet e tente novamente.";
  }

  return "Ocorreu um erro inesperado. Tente novamente.";
}

// ─── Monitor ─────────────────────────────────────────────────────────────────

/** Verifica monitor pelo perfil ou pelo e-mail da sessão Supabase Auth (fonte das RLS). */
export async function checkIsMonitor(
  profileEmail?: string | null
): Promise<boolean> {
  if (isMonitorEmail(profileEmail)) return true;

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  return isMonitorEmail(authUser?.email);
}

// ─── Busca de perfil ──────────────────────────────────────────────────────────

async function fetchProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, email, avatar_url, created_at")
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  return data as User;
}

// ─── Ações de autenticação ────────────────────────────────────────────────────

/**
 * Cria nova conta via Supabase Auth e insere o perfil na tabela profiles.
 * Retorna erro se o e-mail já estiver cadastrado.
 */
export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResult> {
  const trimmedName = name.trim();
  const trimmedEmail = email.toLowerCase().trim();

  if (!trimmedName || !trimmedEmail || !password) {
    return { ok: false, error: "Preencha todos os campos." };
  }

  const { data, error } = await supabase.auth.signUp({
    email: trimmedEmail,
    password,
  });

  if (error) {
    return { ok: false, error: mapAuthError(error.message) };
  }

  const authUser = data.user;
  if (!authUser) {
    return { ok: false, error: "Não foi possível criar a conta. Tente novamente." };
  }

  // Cria o perfil na tabela profiles
  const { error: profileError } = await supabase.from("profiles").insert({
    id: authUser.id,
    name: trimmedName,
    email: trimmedEmail,
  });

  if (profileError) {
    // Perfil pode já existir em retenativas — ignora o conflito de unique
    if (!profileError.code?.includes("23505")) {
      return { ok: false, error: "Conta criada, mas erro ao salvar perfil. Tente entrar." };
    }
  }

  const profile = await fetchProfile(authUser.id);
  if (!profile) {
    // Sessão criada mas perfil ainda não disponível (pode ocorrer em confirmação de e-mail)
    const fallback: User = {
      id: authUser.id,
      name: trimmedName,
      email: trimmedEmail,
      created_at: new Date().toISOString(),
    };
    return { ok: true, user: fallback };
  }

  return { ok: true, user: profile };
}

/**
 * Autentica usuário existente via Supabase Auth.
 * Nunca cria conta — retorna erro se o e-mail não existir ou a senha estiver errada.
 */
export async function login(
  email: string,
  password: string
): Promise<AuthResult> {
  const trimmedEmail = email.toLowerCase().trim();

  if (!trimmedEmail || !password) {
    return { ok: false, error: "Preencha todos os campos." };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: trimmedEmail,
    password,
  });

  if (error) {
    return { ok: false, error: mapAuthError(error.message) };
  }

  const authUser = data.user;
  if (!authUser) {
    return { ok: false, error: "Não foi possível autenticar. Tente novamente." };
  }

  const profile = await fetchProfile(authUser.id);
  if (!profile) {
    return { ok: false, error: "Perfil não encontrado. Entre em contato com o suporte." };
  }

  return { ok: true, user: profile };
}

/**
 * Encerra a sessão atual no Supabase Auth.
 */
export async function logout(): Promise<void> {
  await supabase.auth.signOut();
}

/**
 * Retorna o usuário da sessão ativa, ou null se não estiver autenticado.
 * Usado internamente pelo AuthContext na inicialização.
 */
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) return null;
  return fetchProfile(authUser.id);
}
