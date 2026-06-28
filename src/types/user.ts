/**
 * Estrutura de um usuário da plataforma.
 * passwordHash: plain text neste MVP — substituir por hash real ao migrar para Supabase.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

/** Sessão armazenada localmente (apenas o userId — pronto para JWT depois). */
export interface AuthSession {
  userId: string;
}
