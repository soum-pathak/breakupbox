-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- NextAuth required tables (for SupabaseAdapter)
create table if not exists accounts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null,
  type text not null,
  provider text not null,
  provider_account_id text not null,
  refresh_token text,
  access_token text,
  expires_at bigint,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  unique(provider, provider_account_id)
);

create table if not exists sessions (
  id uuid default uuid_generate_v4() primary key,
  session_token text unique not null,
  user_id uuid not null,
  expires timestamptz not null
);

create table if not exists users (
  id uuid default uuid_generate_v4() primary key,
  name text,
  email text unique,
  email_verified timestamptz,
  image text
);

create table if not exists verification_tokens (
  identifier text not null,
  token text not null,
  expires timestamptz not null,
  primary key (identifier, token)
);

-- BreakupBox custom tables
create table if not exists user_profiles (
  id uuid references users(id) on delete cascade primary key,
  email text,
  tier text not null default 'free' check (tier in ('free', 'one_time', 'subscription')),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  created_at timestamptz default now()
);

create table if not exists checklists (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) on delete cascade not null,
  title text not null,
  input_text text not null,
  categories jsonb not null default '[]',
  tier_at_creation text not null default 'free',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Row Level Security
alter table user_profiles enable row level security;
alter table checklists enable row level security;

-- RLS Policies
create policy "Users can view own profile" on user_profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on user_profiles
  for update using (auth.uid() = id);

create policy "Users can view own checklists" on checklists
  for select using (auth.uid() = user_id);

create policy "Users can insert own checklists" on checklists
  for insert with check (auth.uid() = user_id);

create policy "Users can update own checklists" on checklists
  for update using (auth.uid() = user_id);

create policy "Users can delete own checklists" on checklists
  for delete using (auth.uid() = user_id);

-- Indexes
create index if not exists checklists_user_id_idx on checklists(user_id);
create index if not exists checklists_created_at_idx on checklists(created_at desc);
create index if not exists user_profiles_stripe_customer_id_idx on user_profiles(stripe_customer_id);
