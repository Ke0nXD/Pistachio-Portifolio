create table if not exists public.gallery_items (
  id text primary key,
  title text not null check (char_length(title) between 1 and 120),
  category text not null check (category in ('icons', 'half-body', 'full-body', 'reference-sheet', 'sketches')),
  src text not null check (char_length(src) <= 1000 and src ~ '^(https://|/[^/]).+'),
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.completed_commissions (
  id text primary key,
  title text not null check (char_length(title) between 1 and 120),
  client_name text not null check (char_length(client_name) between 1 and 120),
  category text not null check (category in ('icon', 'half-body', 'full-body', 'reference-sheet', 'custom')),
  src text not null check (char_length(src) <= 1000 and src ~ '^(https://|/[^/]).+'),
  description text not null default '' check (char_length(description) <= 500),
  completed_at date not null default current_date,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists gallery_items_set_updated_at on public.gallery_items;
create trigger gallery_items_set_updated_at
before update on public.gallery_items
for each row execute function public.set_updated_at();

drop trigger if exists completed_commissions_set_updated_at on public.completed_commissions;
create trigger completed_commissions_set_updated_at
before update on public.completed_commissions
for each row execute function public.set_updated_at();

alter table public.gallery_items enable row level security;
alter table public.completed_commissions enable row level security;

revoke all on table public.gallery_items from anon, authenticated;
revoke all on table public.completed_commissions from anon, authenticated;
grant select, insert, update, delete on table public.gallery_items to service_role;
grant select, insert, update, delete on table public.completed_commissions to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-art',
  'portfolio-art',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into public.gallery_items (id, title, category, src, featured, active)
values
  ('g1', 'Pistache Full Body', 'full-body', 'https://placehold.co/400x500/B9FF8A/211827?text=Full+Body+1', true, true),
  ('g2', 'Cat Icon Commission', 'icons', 'https://placehold.co/400x400/C04BEA/FFFBEF?text=Icon+1', true, true),
  ('g3', 'Reference Sheet Example', 'reference-sheet', 'https://placehold.co/800x600/FFF4A8/211827?text=Ref+Sheet', true, true),
  ('g4', 'Half Body Commission', 'half-body', 'https://placehold.co/400x500/F8B8DD/211827?text=Half+Body+1', false, true),
  ('g5', 'Sketch Example', 'sketches', 'https://placehold.co/400x400/FFFBEF/7A2BA8?text=Sketch+1', false, true),
  ('g6', 'Icon Commission 2', 'icons', 'https://placehold.co/400x400/8BE75A/211827?text=Icon+2', false, true)
on conflict (id) do nothing;

insert into public.completed_commissions (id, title, client_name, category, src, description, completed_at, active)
values
  ('c1', 'Soft Icon Commission', 'Client Example', 'icon', 'https://placehold.co/600x600/B9FF8A/211827?text=Finished+Icon', 'Finished icon commission with soft expression, clean rendering and pastel colors.', '2026-05-01', true),
  ('c2', 'Full Body Character Art', 'Client Example', 'full-body', 'https://placehold.co/600x800/C04BEA/FFFBEF?text=Finished+Full+Body', 'Completed full body commission showing pose, personality and character details.', '2026-05-08', true),
  ('c3', 'Reference Sheet Delivery', 'Client Example', 'reference-sheet', 'https://placehold.co/900x600/FFF4A8/211827?text=Finished+Ref+Sheet', 'Final reference sheet with front view, back view, palette and small details.', '2026-05-15', true)
on conflict (id) do nothing;

