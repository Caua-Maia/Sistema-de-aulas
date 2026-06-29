-- ============================================================
-- Migration: create profiles
-- ============================================================

create table if not exists public.profiles (
  id         uuid        primary key references auth.users (id) on delete cascade,
  name       text        not null,
  email      text        not null unique,
  avatar_url text        null,
  created_at timestamptz not null default now()
);

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table public.profiles enable row level security;

-- SELECT: usuário lê apenas o seu próprio perfil
create policy "profiles: select own"
  on public.profiles
  for select
  using (auth.uid() = id);

-- INSERT: usuário insere apenas o seu próprio perfil
create policy "profiles: insert own"
  on public.profiles
  for insert
  with check (auth.uid() = id);

-- UPDATE: usuário atualiza apenas o seu próprio perfil
create policy "profiles: update own"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
