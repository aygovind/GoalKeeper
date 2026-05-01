-- GoalKeeper V1 (no auth). Create these tables in Supabase SQL Editor.
-- IMPORTANT: Disable RLS for both tables (single-user app).

create table if not exists public.sleep_goals (
  id uuid primary key default gen_random_uuid(),
  hours_goal numeric not null,
  hours_whole_goal numeric,
  sleep_time_goal text,
  sleep_time_whole_goal text,
  wake_time_goal text,
  wake_time_whole_goal text,
  updated_at timestamptz not null default now()
);

create table if not exists public.sleep_logs (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  hours_slept numeric,
  sleep_time text,
  wake_time text,
  logged_at timestamptz not null default now()
);

create index if not exists sleep_logs_date_idx on public.sleep_logs (date);

