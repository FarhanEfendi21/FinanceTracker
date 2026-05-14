-- ============================================================
-- FlowLedger — Supabase Database Migration (UPDATED)
-- Jalankan seluruh file ini di: 
-- Supabase Dashboard > SQL Editor > New Query > Paste > Run
-- ============================================================


-- =============================================
-- 1. TABLE: transactions
-- =============================================
create table if not exists public.transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null default auth.uid(),
  type        text check (type in ('income', 'expense')) not null,
  category    text not null,
  amount      numeric(15, 2) not null check (amount > 0),
  description text,
  date        date not null default current_date,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

-- Trigger: auto-update updated_at on row change
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists transactions_updated_at on public.transactions;
create trigger transactions_updated_at
  before update on public.transactions
  for each row execute function public.set_updated_at();

-- Enable Row Level Security
alter table public.transactions enable row level security;

-- Drop old policies if exist
drop policy if exists "Users can view their own transactions" on public.transactions;
drop policy if exists "Users can insert their own transactions" on public.transactions;
drop policy if exists "Users can update their own transactions" on public.transactions;
drop policy if exists "Users can delete their own transactions" on public.transactions;

-- RLS Policies
create policy "Users can view their own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own transactions"
  on public.transactions for update
  using (auth.uid() = user_id);

create policy "Users can delete their own transactions"
  on public.transactions for delete
  using (auth.uid() = user_id);

-- Indexes for performance
create index if not exists transactions_user_id_idx on public.transactions(user_id);
create index if not exists transactions_date_idx on public.transactions(date desc);
create index if not exists transactions_type_idx on public.transactions(type);


-- =============================================
-- 2. TABLE: categories
-- =============================================
create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade not null default auth.uid(),
  name       text not null,
  type       text check (type in ('income', 'expense')) not null,
  icon       text default 'Tag',
  color      text default '#000000',
  created_at timestamptz default now() not null,
  unique (user_id, name, type)
);

-- Enable Row Level Security
alter table public.categories enable row level security;

-- Drop old policies if exist
drop policy if exists "Users can manage their own categories" on public.categories;
drop policy if exists "Users can view their own categories" on public.categories;
drop policy if exists "Users can insert their own categories" on public.categories;
drop policy if exists "Users can update their own categories" on public.categories;
drop policy if exists "Users can delete their own categories" on public.categories;

-- RLS Policies
create policy "Users can view their own categories"
  on public.categories for select
  using (auth.uid() = user_id);

create policy "Users can insert their own categories"
  on public.categories for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own categories"
  on public.categories for update
  using (auth.uid() = user_id);

create policy "Users can delete their own categories"
  on public.categories for delete
  using (auth.uid() = user_id);

-- Index
create index if not exists categories_user_id_idx on public.categories(user_id);


-- =============================================
-- VERIFIKASI: jalankan query ini setelah migrasi
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public';
-- =============================================

-- =============================================
-- 3. TABLE: user_settings
-- =============================================
create table if not exists public.user_settings (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade not null unique default auth.uid(),
  theme      text check (theme in ('light', 'dark', 'system')) default 'system',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

drop trigger if exists user_settings_updated_at on public.user_settings;
create trigger user_settings_updated_at
  before update on public.user_settings
  for each row execute function public.set_updated_at();

alter table public.user_settings enable row level security;

drop policy if exists "Users can manage their own settings" on public.user_settings;

create policy "Users can manage their own settings"
  on public.user_settings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists user_settings_user_id_idx on public.user_settings(user_id);


-- =============================================
-- 4. TABLE: profiles
-- =============================================
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  email      text,
  avatar_url text,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

-- Policies
drop policy if exists "Profiles are viewable by owner" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;

create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.email
  );
  
  -- Also create default user_settings
  insert into public.user_settings (user_id, theme)
  values (new.id, 'system');
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
