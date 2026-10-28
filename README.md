# Skills dos agentes

As skills e os prompts dos agentes do Marco. Os nomes vêm do neurônio: o dendrito capta, o axônio envia, a sinapse entrega e a mielina acelera.

| Pasta | Agente | O que faz |
|---|---|---|
| `dendro/` | Dendro | Pesquisa web, verificação de fatos, busca de skills; `dendro-olhos` para vídeos; `dendro-concorrentes` para concorrentes e voz do cliente |
| `axon/` | Axon | Vídeo, motion, cortes e copy (`axon-editor-de-video`, `axon-desempenho`, `axon-cortes`) |
| `cortex/` | Córtex | Sites, landing pages, dashboards e plataformas |
| `sinapse/` | Sinapse | Social media: estratégia, calendário, Metricool, métricas |
| `mielina/` | Mielina | Tráfego pago: Meta, TikTok e Google Ads |
| `voz-da-marca/` | Axon, Sinapse | Perfil de voz de cada marca |
| `empresa-dos-agentes/` | Todos | Equipe como empresa: líder, apoios, envelope, portões, travas |
| `visao-geral/` | Visão Geral | Coordenação, fluxos e checklist de QA (`visao-geral-coordenador`) |
| `ciclos-dos-agentes/` | Todos | Rotinas semanais que ligam os 4 agentes |
| `modo-economia/` | Todos | Gastar menos créditos sem perder qualidade |

Cada pasta tem o `SKILL.md` (a skill) e, quando existe, o prompt do projeto e a pesquisa que deu base a ele.

Para usar uma skill no Claude: salve pelo cartão de proposta na conversa, ou em Configurações > Skills, enviando a pasta com o `SKILL.md`.

A arquitetura da equipe (papéis, permissões, handoffs, fluxos, testes) está em [ARQUITETURA-AGENTES-CLAUDE-CODE.md](ARQUITETURA-AGENTES-CLAUDE-CODE.md). Para o Claude Code: subagentes em `.claude/agents/` (ver [docs/subagentes.md](docs/subagentes.md)), permissões em `.claude/settings.json`, allowlist em `config/allowlist.json`, formatos dos pacotes em `schemas/` e registro das tarefas em `equipe/`.

O mapa completo de skills por agente está em [CATALOGO.md](CATALOGO.md). As skills de fora que inspiraram partes destas estão em [FONTES.md](FONTES.md), com a licença de cada uma.
