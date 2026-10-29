-- Plerona — signed client agreements (e.g. /abide-agreement)
-- Run once in the Supabase SQL editor (same project as `orders`).
-- Writes happen server-side with the SERVICE ROLE key. RLS on, no public policies.

create table if not exists public.contract_signatures (
  id                 uuid primary key default gen_random_uuid(),
  confirmation_id    text not null unique,
  agreement_version  text not null,
  client_company     text not null,
  typed_name         text not null,
  signer_title       text,
  signature_png      text not null,           -- data:image/png;base64,...
  checkboxes         jsonb not null,          -- { readAgree: true, ... }
  monthly_choice     text not null check (monthly_choice in ('yes', 'no')),
  signed_at_utc      timestamptz not null,
  signed_at_pacific  text not null,           -- display string with PDT/PST
  user_agent         text,
  ip                 text,
  email_status       text not null default 'pending' check (email_status in ('pending', 'sent', 'failed')),
  email_detail       text,
  email_updated_at   timestamptz,
  created_at         timestamptz not null default now()
);

create index if not exists contract_signatures_created_idx on public.contract_signatures (created_at desc);

alter table public.contract_signatures enable row level security;
