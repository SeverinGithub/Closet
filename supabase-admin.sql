-- ============================================================
-- Closet — Creator / Admin setup (one-shot)
--
-- BEVOR du das ausführst:
--   1. Öffne die App (http://localhost:5173), klicke "Create account"
--      und melde dich mit deiner gewünschten Creator-Email an.
--      Vorschlag:  creator@closet.test  /  Cr34tor-Closet-2026!
--
-- Dann diese Datei komplett in den Supabase SQL Editor einfügen
-- und "Run" drücken. Fertig — Login → siehst alle Items & Outfits.
--
-- Die Creator-Email steht unten (@ CREATOR_EMAIL). Ändern wenn nötig.
-- ============================================================

-- ── 1. Admin-Registry + Policies ─────────────────────────────
create table if not exists app_admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  note       text        not null default '',
  created_at timestamptz not null default now()
);
alter table app_admins enable row level security;

drop policy if exists "app_admins_self_read" on app_admins;
create policy "app_admins_self_read" on app_admins
  for select using (auth.uid() = user_id);

create or replace function is_admin() returns boolean
  language sql stable security definer set search_path = public as $$
  select exists (select 1 from app_admins where user_id = auth.uid());
$$;

-- Read-all SELECT policies for admins (writes stay owner-scoped)
drop policy if exists "items_admin_read" on items;
create policy "items_admin_read" on items
  for select using (is_admin());

drop policy if exists "outfits_admin_read" on outfits;
create policy "outfits_admin_read" on outfits
  for select using (is_admin());

drop policy if exists "wear_log_admin_read" on wear_log;
create policy "wear_log_admin_read" on wear_log
  for select using (is_admin());

drop policy if exists "liked_admin_read" on liked;
create policy "liked_admin_read" on liked
  for select using (is_admin());

drop policy if exists "item_photos_admin_read" on storage.objects;
create policy "item_photos_admin_read" on storage.objects
  for select to authenticated
  using (bucket_id = 'item-photos' and is_admin());


-- ── 2. Creator-User als Admin markieren + auto-confirm ──────
-- Passt automatisch, sobald du dich mit dieser Email in der App
-- registriert hast — keine UUID zu kopieren, keine E-Mail-Bestätigung.
do $$
declare
  v_creator_email text := 'creator@closet.test';   -- ← ggf. ändern
  v_user_id uuid;
begin
  select id into v_user_id from auth.users where email = v_creator_email;

  if v_user_id is null then
    raise notice
      'User % existiert noch nicht. Zuerst in der App "Create account" durchführen, dann diese Datei nochmal ausführen.',
      v_creator_email;
    return;
  end if;

  -- Auto-confirm falls die Bestätigungs-Mail noch nicht geklickt ist
  update auth.users
     set email_confirmed_at = coalesce(email_confirmed_at, now()),
         confirmed_at       = coalesce(confirmed_at, now())
   where id = v_user_id;

  -- Als Admin markieren
  insert into app_admins (user_id, note)
  values (v_user_id, 'creator test account')
  on conflict (user_id) do nothing;

  raise notice 'Creator % ist jetzt Admin (id = %).', v_creator_email, v_user_id;
end $$;
