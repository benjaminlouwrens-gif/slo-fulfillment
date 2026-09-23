create table if not exists public.slof_faq_requests (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists slof_faq_requests_ip_created_idx
  on public.slof_faq_requests (ip_hash, created_at desc);

alter table public.slof_faq_requests enable row level security;
