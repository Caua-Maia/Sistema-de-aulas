/** Usuário autenticado — espelha a tabela public.profiles do Supabase. */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string | null;
  created_at: string;
}
