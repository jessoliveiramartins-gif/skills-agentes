---
name: find-skills
description: Acha as melhores skills para o que o Marco quer realizar (GitHub e skills.sh), checa licença e segurança e entrega pronta para salvar. Use quando ele pedir "tem skill para...", "como faço X" ou quiser ampliar o que os agentes sabem fazer.
---

# Find Skills (Marco)

Adaptada de vercel-labs/skills `find-skills` (MIT, Vercel). A original instala com `npx skills add`, que só roda no Claude Code. Aqui o caminho é: buscar, verificar, adaptar e entregar por cartão.

## Quando usar
- "Tem skill para X?", "como faço X?", "acha uma skill de..."
- Quando um agente (Dendro, Axon, Sinapse, Mielina, Córtex) esbarra numa tarefa que uma skill pronta resolveria.

## Passo a passo (curto)
1. **Entender o objetivo** em uma frase: domínio + tarefa. Olhar antes `CATALOGO.md` do repo skills-agentes e a memória `skills-github-fontes`: se já foi avaliada, reaproveitar o veredito.
2. **Buscar**, nesta ordem:
   - https://skills.sh/ (ranking por instalações)
   - GitHub: repositórios e `filename:SKILL.md` + palavra-chave
   - Fontes confiáveis: anthropics/skills, vercel-labs/agent-skills, coreyhaines31/marketingskills, remotion-dev/skills
3. **Verificar antes de recomendar** (nunca só pelo resultado da busca):
   - Instalações: preferir 1K+; abaixo de 100, desconfiar
   - Origem: oficial/conhecida > autor desconhecido; repo com menos de 100 estrelas = cautela
   - **Licença**: MIT/Apache/BSD ok. Sem LICENSE ou licença restritiva = não copiar, só citar
   - **Segurança**: ler o SKILL.md e qualquer script; recusar o que baixa e executa código remoto, pede chaves, envia dados para fora ou apaga arquivos
   - **Custo**: só ferramentas grátis; o que depende de plataforma paga vai para "para o futuro"
4. **Apresentar até 3 opções**, cada uma em 3 linhas: o que faz, licença/instalações, veredito. Recomendar uma.
5. **Entregar**: se o Marco aprovar, adaptar ao português e à regra dos agentes e propor pelo cartão (`propose_skills`). Skill existente: partir da versão atual completa e só acrescentar, nunca perder conteúdo. No Claude Code, o comando é `npx skills add <dono/repo@skill> -g -y`.
6. **Registrar**: acrescentar no `CATALOGO.md` e `FONTES.md` do repo skills-agentes e na memória `skills-github-fontes`.

## Se não achar
Dizer em uma linha que não existe skill boa, fazer a tarefa direto, e sugerir criar uma com skill-creator se for repetitiva.

## Regras
- Respostas curtas e objetivas. Não ler arquivos que a tarefa não exige.
- Nada instalado sem o Marco ver o veredito.
