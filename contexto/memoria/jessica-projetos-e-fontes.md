---
name: jessica-projetos-e-fontes
description: Quais são os 3 projetos que o painel acompanha (projetos Claude, não apps Base44) e de onde vêm os dados
metadata:
  type: project
  modified: 2026-10-26T00:23:04.730Z
---

Jessica fala português, fuso America/Sao_Paulo (BRT). O projeto "Visão geral" é só o controle dos outros projetos.

Os "3 projetos" são os **projetos Claude** MWX, Meu Primeiro App e Lar com Propósito (confirmado por ela em 25/10/2026). NÃO são os apps do Base44; usar Base44 como fonte principal foi um erro corrigido por ela.

Como ler o que ela fez: as sessões desses projetos não aparecem aqui, então a fonte são os artefatos dela. `Artifact list scope:"all"` lista tudo com data de atualização (sem hora). Artefatos tipo Docs: o index.html é só o shell; ler com `Claude_Docs__read` (ref project, depois ref node do conteúdo). Mapa (25/10):
- MWX (refrigeração, Goiânia): Agenda MWX (fixada, criptografada, sem como contar agendamentos), Plano de caixa rápido, Estratégias de crescimento, Hub SaaS.
- Meu Primeiro App (e-book R$ 97, Hotmart): landing, VSL, Estratégia de edição, Roteiro vídeo TikTok Shop, Roteiros seguidores, Roteiros cinematográficos. Metricool marca `meu.primeiro.app` (brandId 7652802) tem a fila de posts.
- Lar com Propósito (afiliada TikTok Shop/Shopee): Estratégia Shopee vs TikTok Shop, Guia de copy + prompt Manus, Roteiros 11.11 e Natal.

Painel (v3 "Controle Diário", estilo BI Linear/Stripe, claro e escuro): https://claude.ai/artifact/8thnjN4oEcmQ2gXnm5sTSt (cópia em /mnt/project-files/painel-controle/controle.html). Dados embutidos no HTML; para atualizar, reler os artefatos e republicar.
