-- ============================================================
-- Closet — Supabase Schema
-- Run this once in the Supabase SQL Editor:
--   Dashboard → SQL Editor → New query → paste → Run
-- ============================================================

-- ── Items ────────────────────────────────────────────────────
create table if not exists items (
  id         text        primary key,
  user_id    uuid        references auth.users(id) on delete cascade not null,
  name       text        not null default 'Untitled piece',
  cat        text        not null default 'TOPS',
  tone       text        not null default '#A89478',
  pat        text        not null default 'solid',
  image      text,
  ar         numeric     not null default 1.2,
  worn       integer     not null default 0,
  last       text        not null default '—',
  tags       jsonb       not null default '[]',
  season     jsonb       not null default '[]',
  brand      text        not null default '',
  price      text        not null default '',
  created_at timestamptz not null default now(),
  -- AI-generated fields (populated by Gemini after upload)
  colors        jsonb    not null default '[]',
  style_tags    jsonb    not null default '[]',
  occasion_tags jsonb    not null default '[]',
  fit           text     not null default '',
  material      text     not null default '',
  ai_tagged     boolean  not null default false
);
alter table items enable row level security;
create policy "items_owner" on items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Outfits ──────────────────────────────────────────────────
create table if not exists outfits (
  id         text        primary key,
  user_id    uuid        references auth.users(id) on delete cascade not null,
  name       text        not null default 'My Outfit',
  mood       text        not null default 'CASUAL',
  items      jsonb       not null default '[]',
  occasion   jsonb       not null default '[]',
  created_at timestamptz not null default now()
);
alter table outfits enable row level security;
create policy "outfits_owner" on outfits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Wear Log ─────────────────────────────────────────────────
create table if not exists wear_log (
  user_id    uuid references auth.users(id) on delete cascade not null,
  iso_date   text not null,
  outfit_id  text references outfits(id) on delete set null,
  primary key (user_id, iso_date)
);
alter table wear_log enable row level security;
create policy "wear_log_owner" on wear_log
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Liked ────────────────────────────────────────────────────
create table if not exists liked (
  user_id    uuid references auth.users(id) on delete cascade not null,
  outfit_id  text references outfits(id) on delete cascade not null,
  primary key (user_id, outfit_id)
);
alter table liked enable row level security;
create policy "liked_owner" on liked
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Storage Bucket ───────────────────────────────────────────
-- Create a PUBLIC bucket (URLs are non-guessable via UUID paths)
insert into storage.buckets (id, name, public)
values ('item-photos', 'item-photos', true)
on conflict (id) do nothing;

create policy "item_photos_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'item-photos'
    and auth.uid()::text = (storage.foldername(name))[1]);

create policy "item_photos_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'item-photos'
    and auth.uid()::text = (storage.foldername(name))[1]);

create policy "item_photos_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'item-photos'
    and auth.uid()::text = (storage.foldername(name))[1]);

-- ── AI columns migration (run if table already exists) ───────
alter table items add column if not exists colors        jsonb   not null default '[]';
alter table items add column if not exists style_tags    jsonb   not null default '[]';
alter table items add column if not exists occasion_tags jsonb   not null default '[]';
alter table items add column if not exists fit           text    not null default '';
alter table items add column if not exists material      text    not null default '';
alter table items add column if not exists ai_tagged     boolean not null default false;
