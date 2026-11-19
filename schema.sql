-- Reference only: these tables were already created in your Supabase project.
-- Do not rerun blindly. The live project also needs reviewed security policies
-- before any public launch.

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null,
  guest_name_normalized text not null unique,
  attending boolean not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.guestbook (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null,
  message text not null,
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);
