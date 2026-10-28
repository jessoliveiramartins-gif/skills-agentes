# Subagentes da equipe (Claude Code)

Cada arquivo é um subagente do Claude Code com ferramentas limitadas (menor privilégio). Eles valem quando o Claude Code roda dentro deste repositório. No Claude.ai (chat e projetos) quem manda são as skills da conta.

| Arquivo | Agente | Pode escrever em | Escrita externa |
|---|---|---|---|
| visao-geral.md | Visão Geral | `equipe/` | nenhuma |
| qa-revisor.md | Revisor de QA | nada (só lê) | nenhuma |
| dendro.md | Dendro | `pesquisa/` | nenhuma |
| axon.md | Axon | `videos/` | nenhuma |
| cortex.md | Córtex | repositório do site (branch de trabalho) | push e deploy pedem aprovação |
| sinapse.md | Sinapse | `social/` | Metricool: post para revisão; publicar pede aprovação |
| mielina.md | Mielina | `trafego/` | nenhuma por enquanto (só leitura) |

**Ferramentas MCP ainda não instaladas** (Playwright, Fetch, YouTube Transcript, Kinocut, Google Analytics, Google Ads, Search Console, Meta Ads): os nomes delas entram no campo `tools` de cada subagente na fase 6 do plano, depois de instalar e conferir com `/mcp` os nomes exatos. Até lá, os subagentes usam só o que já existe.

Limites de pasta: o campo `tools` limita quais ferramentas cada agente tem, mas não limita a pasta. A pasta de cada um está na instrução e as travas fortes (segredos, comandos destrutivos, publicação) estão em `.claude/settings.json` e no hook `.claude/hooks/checa-allowlist.py`.
