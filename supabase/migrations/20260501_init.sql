create extension if not exists pgcrypto;

create table if not exists public.organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  organisation_id uuid references public.organisations(id) on delete set null,
  full_name text,
  email text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.brand_kits (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  name text not null,
  logo_url text,
  primary_color text,
  secondary_color text,
  accent_color text,
  font_heading text,
  font_body text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid references public.organisations(id) on delete cascade,
  brand_kit_id uuid references public.brand_kits(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  name text not null,
  type text not null,
  preview_url text,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.uploads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  organisation_id uuid references public.organisations(id) on delete set null,
  kind text not null check (kind in ('source', 'preview')),
  bucket text not null,
  object_key text not null unique,
  file_url text not null,
  file_name text not null,
  content_type text,
  size_bytes bigint,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  organisation_id uuid references public.organisations(id) on delete set null,
  brand_kit_id uuid references public.brand_kits(id) on delete set null,
  template_id uuid references public.templates(id) on delete set null,
  source_upload_id uuid references public.uploads(id) on delete set null,
  preview_upload_id uuid references public.uploads(id) on delete set null,
  title text not null,
  type text not null,
  status text not null default 'completed',
  input_data jsonb not null default '{}'::jsonb,
  source_image_url text,
  preview_image_url text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_profiles_organisation_id on public.profiles (organisation_id);
create index if not exists idx_brand_kits_organisation_id on public.brand_kits (organisation_id);
create index if not exists idx_templates_organisation_id on public.templates (organisation_id);
create index if not exists idx_uploads_user_id on public.uploads (user_id);
create index if not exists idx_generations_user_id_created_at on public.generations (user_id, created_at desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null)
  )
  on conflict (user_id) do update
    set email = excluded.email,
        full_name = coalesce(excluded.full_name, public.profiles.full_name),
        updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.organisations enable row level security;
alter table public.profiles enable row level security;
alter table public.brand_kits enable row level security;
alter table public.templates enable row level security;
alter table public.uploads enable row level security;
alter table public.generations enable row level security;

drop policy if exists "profiles_select_self" on public.profiles;
create policy "profiles_select_self"
on public.profiles
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self"
on public.profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "organisations_select_member_org" on public.organisations;
create policy "organisations_select_member_org"
on public.organisations
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.user_id = auth.uid()
      and profiles.organisation_id = organisations.id
  )
);

drop policy if exists "brand_kits_select_member_org" on public.brand_kits;
create policy "brand_kits_select_member_org"
on public.brand_kits
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.user_id = auth.uid()
      and profiles.organisation_id = brand_kits.organisation_id
  )
);

drop policy if exists "templates_select_member_org" on public.templates;
create policy "templates_select_member_org"
on public.templates
for select
to authenticated
using (
  organisation_id is null
  or exists (
    select 1
    from public.profiles
    where profiles.user_id = auth.uid()
      and profiles.organisation_id = templates.organisation_id
  )
);

drop policy if exists "uploads_select_self" on public.uploads;
create policy "uploads_select_self"
on public.uploads
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "generations_select_self" on public.generations;
create policy "generations_select_self"
on public.generations
for select
to authenticated
using (auth.uid() = user_id);
