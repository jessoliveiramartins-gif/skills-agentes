-- Agendador próprio (Instagram + TikTok). Rodar uma vez no SQL Editor do Supabase.
create table if not exists social_accounts (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  network text not null check (network in ('instagram','tiktok')),
  account_id text,                -- Instagram: ig-user-id. TikTok: open_id
  access_token text not null,
  refresh_token text,             -- só TikTok
  token_expires_at timestamptz,
  created_at timestamptz default now(),
  unique (brand, network)
);

create table if not exists scheduled_posts (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  network text not null check (network in ('instagram','tiktok')),
  caption text not null default '',
  media_url text not null,        -- link público do vídeo (Supabase Storage)
  scheduled_at timestamptz not null,
  mode text not null default 'direto' check (mode in ('direto','rascunho')),
  status text not null default 'pendente_aprovacao'
    check (status in ('pendente_aprovacao','aprovado','publicando','publicado','rascunho_enviado','erro')),
  attempts int not null default 0,
  result jsonb,
  error text,
  created_at timestamptz default now()
);
create index if not exists scheduled_posts_fila on scheduled_posts (status, scheduled_at);

-- Só a service role (Edge Function / Sinapse) acessa. Sem policies = ninguém mais lê os tokens.
alter table social_accounts enable row level security;
alter table scheduled_posts enable row level security;

-- Relógio: chama a função a cada 5 min e renova tokens 1x por dia.
-- Troque <PROJECT_REF> e <SERVICE_ROLE_KEY>; ative as extensões pg_cron e pg_net.
-- select cron.schedule('publicar-fila','*/5 * * * *', $$ select net.http_post(
--   url:='https://<PROJECT_REF>.supabase.co/functions/v1/publicar',
--   headers:='{"Authorization":"Bearer <SERVICE_ROLE_KEY>"}'::jsonb) $$);
-- select cron.schedule('renovar-tokens','0 6 * * *', $$ select net.http_post(
--   url:='https://<PROJECT_REF>.supabase.co/functions/v1/publicar?acao=renovar',
--   headers:='{"Authorization":"Bearer <SERVICE_ROLE_KEY>"}'::jsonb) $$);
