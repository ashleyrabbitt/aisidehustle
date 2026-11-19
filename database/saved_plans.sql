begin;

create table public.saved_plans (
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  plan_id text not null check (plan_id ~ '^[a-z0-9][a-z0-9-]{0,95}$'),
  revision uuid not null default gen_random_uuid(),
  content jsonb not null check (
    jsonb_typeof(content) = 'object'
    and content ?& array['fields', 'done', 'prospects']
    and jsonb_typeof(content->'fields') = 'object'
    and jsonb_typeof(content->'done') = 'array'
    and jsonb_typeof(content->'prospects') = 'array'
    and octet_length(content::text) <= 262144
  ),
  primary key (owner_id, plan_id)
);

alter table public.saved_plans enable row level security;
revoke all on public.saved_plans from public, anon, authenticated;
grant select on public.saved_plans to authenticated;
grant insert (plan_id, content) on public.saved_plans to authenticated;
grant update (content, revision) on public.saved_plans to authenticated;

create policy read_own_plans on public.saved_plans for select to authenticated
  using (owner_id = (select auth.uid()));
create policy add_own_plans on public.saved_plans for insert to authenticated
  with check (owner_id = (select auth.uid()));
create policy change_own_plans on public.saved_plans for update to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));

commit;
