---
name: arquitetura-agentes
description: Arquitetura dos 5 agentes + Visão Geral no Claude Code (27/10/2026): documento, PR #2 e decisões pendentes D1–D13
metadata:
  type: project
  modified: 2026-10-27T23:48:06.822Z
---

Em 27/10/2026 o Marco pediu uma arquitetura operacional (pipeline com papéis separados, handoffs em envelope JSON, QA e aprovação humana antes de qualquer ação externa). Documento: `ARQUITETURA-AGENTES-CLAUDE-CODE.md` no repo skills-agentes (PR #2, branch claude/project-thread-941xrd) e cópia em /mnt/project-files/skills-agentes/.

- Marco mandou **tirar tudo que depende de plataforma paga** (Brave, DataForSEO, video-use/ElevenLabs etc.); ficou na seção 4.3 "Para o futuro".
- 27/10 23h53: Marco aprovou todas as recomendações D1–D13 (Córtex fica, Córdex é apelido; QA = Visão Geral + subagente qa-revisor; skills no Claude.ai + subagentes no Claude Code; Meta Ads só leitura). Troca: **allowlist de publicação = marcas ligadas no Metricool** (em 27/10 só TikTok larcomproposito.oficial, blogId 7654926; Meu Primeiro App e MWX não estão no Metricool). Contas de anúncio/domínios/teto vazios = bloqueado.
- Fases 1–4 aplicadas no PR #2 (subagentes, settings, hook de allowlist, schemas). Cartões enviados: empresa-dos-agentes, visao-geral-coordenador, mielina-trafego-pago. Próximos cartões: sinapse-social-media, axon-cortes e ajustes por agente (dendro, axon, cortex). Fases 5–6 (instalar skills/MCPs grátis na máquina dele) pendentes.
- Plano em fases: 1–4 só instruções e arquivos (reversível); depois skills grátis, MCPs locais, contas, allowlist, escrita externa uma a uma.

**How to apply:** antes de mexer nas skills dos agentes, ler o documento e conferir quais decisões o Marco já tomou. Ver [[tudo-interligado]], [[atualizar-skills-sem-perder]], [[skills-github-fontes]].
