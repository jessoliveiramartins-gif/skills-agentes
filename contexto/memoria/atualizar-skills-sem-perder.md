---
name: atualizar-skills-sem-perder
description: Regra do Marco (27/10/2026): toda atualização de skill parte da versão anterior e preserva o que já existia
metadata:
  type: feedback
  modified: 2026-10-27T12:30:06.701Z
---

Ao atualizar qualquer skill de qualquer agente: ler a versão atual salva na conta (cache local de skills) E a do repo skills-agentes (e o histórico git), comparar, aproveitar tudo que ainda serve e só então propor a versão nova completa. Salvar pelo cartão substitui o SKILL.md inteiro.

**Why:** Marco não sabe se, ao salvar atualizações, está apagando o que já tinha (27/10/2026).

**How to apply:** antes de cada propose_skills de melhoria, fazer um diff seção por seção e dizer ao Marco o que foi mantido, o que entrou e o que saiu (e por quê). Se a conta tiver versão diferente do repo, sincronizar o repo. Ver [[skills-github-fontes]], [[tudo-interligado]].

Reforço do Marco (28/10/2026): ele quer que as skills **só evoluam, nunca substituam**. Não existe botão de "mesclar": salvar o cartão troca o arquivo inteiro, então o cartão precisa conter 100% da versão atual da conta + o que entra. Antes de cada cartão, reler a versão da conta NA HORA (outras threads mudam skills: em 28/10 o axon-editor-de-video ganhou "Voz padrão" depois do meu cartão) e conferir linha a linha que nada antigo sumiu; dizer ao Marco o resultado da conferência.
