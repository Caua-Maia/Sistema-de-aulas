-- ============================================================
-- Migration: create lesson_progress
-- ============================================================

create table if not exists public.lesson_progress (
  id                 uuid        primary key default gen_random_uuid(),
  user_id            uuid        not null references public.profiles (id) on delete cascade,
  lesson_id          text        not null,
  watched            boolean     not null default false,
  challenge_completed boolean    not null default false,
  completed          boolean     not null default false,
  challenge_answer   text        null,
  updated_at         timestamptz not null default now(),

  constraint lesson_progress_user_lesson_unique unique (user_id, lesson_id)
);

-- Índice para buscas por usuário
create index if not exists lesson_progress_user_id_idx
  on public.lesson_progress (user_id);

-- ─── Trigger: manter completed em sincronia ───────────────────────────────────
-- completed = watched AND challenge_completed

create or replace function public.sync_lesson_completed()
  returns trigger
  language plpgsql
  security definer
as $$
begin
  new.completed := new.watched and new.challenge_completed;
  new.updated_at := now();
  return new;
end;
$$;

create trigger lesson_progress_sync_completed
  before insert or update on public.lesson_progress
  for each row
  execute function public.sync_lesson_completed();

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table public.lesson_progress enable row level security;

-- SELECT
create policy "lesson_progress: select own"
  on public.lesson_progress
  for select
  using (auth.uid() = user_id);

-- INSERT
create policy "lesson_progress: insert own"
  on public.lesson_progress
  for insert
  with check (auth.uid() = user_id);

-- UPDATE
create policy "lesson_progress: update own"
  on public.lesson_progress
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
