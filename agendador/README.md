# Agendador próprio (Instagram + TikTok), 100% grátis

Substitui o Metricool para agendar. A Sinapse grava posts na tabela `scheduled_posts`; o relógio (pg_cron, a cada 5 min) chama a função `publicar`, que publica os aprovados e vencidos.

- **Instagram:** publica Reels direto (Graph API / Instagram Login, `instagram_business_content_publish`).
- **TikTok:** envia para o RASCUNHO do app (você toca em publicar). Publicação direta só após auditoria do app no TikTok.
- Fluxo de status: `pendente_aprovacao` → `aprovado` (só depois do "aprovado" do Marco) → `publicando` → `publicado` / `rascunho_enviado` / `erro` (3 tentativas).
- Vídeo: enviar ao Supabase Storage (bucket público) e usar o link em `media_url`. TikTok: até 64 MB por vídeo nesta versão.

## Instalação (uma vez)
1. Criar projeto grátis no Supabase; rodar `schema.sql` no SQL Editor.
2. Ativar extensões `pg_cron` e `pg_net`; descomentar e rodar os 2 `cron.schedule` do fim do `schema.sql`.
3. Publicar a função: `supabase functions deploy publicar` (pasta `supabase/functions/publicar`).
4. Secrets: `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`.
5. Cadastrar as contas em `social_accounts` (token de acesso de longa duração; Instagram dura ~60 dias, a função renova sozinha).

## O que o Marco precisa fazer
1. **Meta:** developers.facebook.com → criar app (tipo Business) → adicionar "Instagram" com Instagram Login → adicionar a conta @meuprimeiroapp.oficial como testadora/função do app → gerar token com `instagram_business_basic` e `instagram_business_content_publish`. A conta precisa ser Business ou Creator. Para a própria conta não precisa de revisão da Meta.
2. **TikTok:** developers.tiktok.com → criar app → produto "Content Posting API" → escopo `video.upload` → autorizar @meu.primeiro.app (login uma vez). Para publicação direta (`video.publish`), pedir auditoria depois.
3. Passar os tokens/IDs pelo cartão de confiança (nunca no chat público nem no GitHub).

Status: código escrito, ainda NÃO testado com contas reais.
