-- ============================================================
-- Migration: monitor RLS policies
-- Permite leitura irrestrita para o e-mail do monitor.
-- As policies existentes dos alunos NAO sao removidas.
-- ============================================================

-- ─── profiles: monitor pode ler todos ────────────────────────────────────────

create policy "monitor: read all profiles"
  on public.profiles
  for select
  using (
    auth.jwt() ->> 'email' = 'cauamaia488@gmail.com'
  );

-- ─── lesson_progress: monitor pode ler todos ─────────────────────────────────

create policy "monitor: read all lesson_progress"
  on public.lesson_progress
  for select
  using (
    auth.jwt() ->> 'email' = 'cauamaia488@gmail.com'
  );

-- ─── sprint_progress: monitor pode ler todos ─────────────────────────────────

create policy "monitor: read all sprint_progress"
  on public.sprint_progress
  for select
  using (
    auth.jwt() ->> 'email' = 'cauamaia488@gmail.com'
  );
