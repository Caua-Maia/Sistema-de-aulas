-- ============================================================
-- Migration: create sprint_progress
-- ============================================================

create table if not exists public.sprint_progress (
  id                uuid        primary key default gen_random_uuid(),
  user_id           uuid        not null references public.profiles (id) on delete cascade,
  sprint_id         text        not null,
  xp                integer     not null default 0,
  completed_lessons integer     not null default 0,
  total_lessons     integer     not null default 0,
  updated_at        timestamptz not null default now(),

  constraint sprint_progress_user_sprint_unique unique (user_id, sprint_id)
);

-- Índice para buscas por usuário
create index if not exists sprint_progress_user_id_idx
  on public.sprint_progress (user_id);

-- Trigger: atualizar updated_at automaticamente
create or replace function public.update_sprint_progress_timestamp()
  returns trigger
  language plpgsql
  security definer
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger sprint_progress_updated_at
  before update on public.sprint_progress
  for each row
  execute function public.update_sprint_progress_timestamp();

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table public.sprint_progress enable row level security;

-- SELECT
create policy "sprint_progress: select own"
  on public.sprint_progress
  for select
  using (auth.uid() = user_id);

-- INSERT
create policy "sprint_progress: insert own"
  on public.sprint_progress
  for insert
  with check (auth.uid() = user_id);

-- UPDATE
create policy "sprint_progress: update own"
  on public.sprint_progress
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
