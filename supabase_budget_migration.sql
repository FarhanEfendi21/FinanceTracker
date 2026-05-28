-- ============================================================
-- FlowLedger — Budget/Spending Limits Migration
-- Run in: Supabase Dashboard > SQL Editor > New Query > Run
-- ============================================================

create table if not exists public.budgets (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete cascade not null default auth.uid(),
  category     text not null,
  amount_limit numeric(15, 2) not null check (amount_limit > 0),
  month        integer not null check (month between 1 and 12),
  year         integer not null check (year >= 2000),
  created_at   timestamptz default now() not null,
  updated_at   timestamptz default now() not null,
  unique (user_id, category, month, year)
);

-- Auto-update updated_at
drop trigger if exists budgets_updated_at on public.budgets;
create trigger budgets_updated_at
  before update on public.budgets
  for each row execute function public.set_updated_at();

-- Enable RLS
alter table public.budgets enable row level security;

-- RLS Policies
drop policy if exists "Users can view their own budgets" on public.budgets;
drop policy if exists "Users can insert their own budgets" on public.budgets;
drop policy if exists "Users can update their own budgets" on public.budgets;
drop policy if exists "Users can delete their own budgets" on public.budgets;

create policy "Users can view their own budgets"
  on public.budgets for select
  using (auth.uid() = user_id);

create policy "Users can insert their own budgets"
  on public.budgets for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own budgets"
  on public.budgets for update
  using (auth.uid() = user_id);

create policy "Users can delete their own budgets"
  on public.budgets for delete
  using (auth.uid() = user_id);

-- Indexes
create index if not exists budgets_user_id_idx on public.budgets(user_id);
create index if not exists budgets_month_year_idx on public.budgets(user_id, month, year);
