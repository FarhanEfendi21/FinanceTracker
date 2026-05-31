-- ============================================================
-- FlowLedger — Financial Goals Migration
-- Run in: Supabase Dashboard > SQL Editor > New Query > Run
-- ============================================================

create table if not exists public.goals (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users(id) on delete cascade not null default auth.uid(),
  name           text not null,
  target_amount  numeric(15, 2) not null check (target_amount > 0),
  current_amount numeric(15, 2) not null default 0 check (current_amount >= 0),
  target_date    date not null,
  category       text not null default 'General',
  created_at     timestamptz default now() not null,
  updated_at     timestamptz default now() not null
);

-- Auto-update updated_at
drop trigger if exists goals_updated_at on public.goals;
create trigger goals_updated_at
  before update on public.goals
  for each row execute function public.set_updated_at();

-- Enable RLS
alter table public.goals enable row level security;

-- RLS Policies
drop policy if exists "Users can view their own goals" on public.goals;
drop policy if exists "Users can insert their own goals" on public.goals;
drop policy if exists "Users can update their own goals" on public.goals;
drop policy if exists "Users can delete their own goals" on public.goals;

create policy "Users can view their own goals"
  on public.goals for select
  using (auth.uid() = user_id);

create policy "Users can insert their own goals"
  on public.goals for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own goals"
  on public.goals for update
  using (auth.uid() = user_id);

create policy "Users can delete their own goals"
  on public.goals for delete
  using (auth.uid() = user_id);

-- Indexes
create index if not exists goals_user_id_idx on public.goals(user_id);
create index if not exists goals_target_date_idx on public.goals(user_id, target_date);
