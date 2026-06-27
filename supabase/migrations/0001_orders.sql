-- Plerona — orders table (CRM record entry for completed checkouts)
-- Run this in the Supabase SQL editor, or via the Supabase CLI as a migration.
--
-- Writes happen server-side from the Stripe webhook using the SERVICE ROLE key,
-- which bypasses Row Level Security. RLS is enabled with no public policies so
-- the table is not readable/writable by the anon or authenticated roles.

create table if not exists public.orders (
  id                      uuid primary key default gen_random_uuid(),
  stripe_session_id       text not null unique,           -- idempotency key
  offer                   text not null check (offer in ('consult', 'implementation')),
  contact_name            text,
  business_name           text,
  email                   text,
  phone                   text,
  amount_total            numeric(10,2) not null default 0,   -- one-time total (USD)
  currency                text not null default 'USD',
  additional_connections  integer not null default 0,
  total_connections       integer not null default 0,
  hosting                 text not null default 'none',       -- ai-care | ai-systems | ai-account | none
  hosting_monthly         numeric(10,2) not null default 0,   -- begins after implementation
  created_at              timestamptz not null default now(),
  recorded_at             timestamptz not null default now()
);

create index if not exists orders_email_idx       on public.orders (email);
create index if not exists orders_created_at_idx  on public.orders (created_at desc);

alter table public.orders enable row level security;
-- No policies are added on purpose: only the service role (used by the webhook)
-- can read or write. Add a policy later if you build an authenticated admin view.
