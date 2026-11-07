---
name: "observador-de-tarefas"
description: "Observa toda tarefa de várias etapas dos agentes da Jessica, anota correções e jeitos de fazer que deram certo, melhora as skills numa revisão semanal e aponta trabalho repetido que deveria virar skill."
---

# Observador de tarefas

Adaptado do Task Observer ("One Skill to Rule Them All", de Eoghan Henn e colaboradores, CC-BY-4.0, github.com/rebelytics/one-skill-to-rule-them-all) para os projetos da Jessica.

As skills melhoram com o atrito percebido no trabalho real. Esta skill garante que esse aprendizado não se perca entre as conversas. Ela complementa a `memoria-viva`: a memória guarda **o que foi feito**, o observador guarda **como fazer melhor**.

Use em toda tarefa com mais de uma etapa, em qualquer projeto e com qualquer agente (Axon, Dendro, Sinapse, Mielina, Córtex).

## Onde fica

`/mnt/project-files/observacoes/`
- `LOG.md`: uma observação por bloco, a mais nova no topo.
- `REVISOES.md`: o que foi revisado e quando.

Se a pasta não existir, crie. Releia `LOG.md` logo antes de escrever, porque outras conversas também escrevem nele.

## O que observar durante a tarefa

1. **Correção da Jessica**: ela mudou algo que o agente fez ("não, assim não", "tira isso", "prefiro..."). Guarde a frase dela.
2. **Método que funcionou**: um caminho que resolveu bem e deveria virar padrão.
3. **Atrito**: uma skill que mandou fazer algo errado, desatualizado ou que faltou.
4. **Trabalho repetido**: a mesma sequência de passos feita pela segunda vez sem skill que cubra.

## Como anotar (ao fim da tarefa, em silêncio)

```
## AAAA-MM-DD | <agente> | <marca> | <tipo: correcao, metodo, atrito, repeticao>
Skill afetada: <nome ou "nenhuma, nova skill?">
O que aconteceu: <1 a 2 linhas>
Frase da Jessica: "<se houver>"
Sugestão: <a mudança exata na skill>
Status: aberta
```

Não interrompa a Jessica para anotar. Não anote o óbvio nem coisas que só valem para aquela tarefa.

Se for uma correção que vale sempre, grave também na memória do projeto na mesma hora, porque a regra do projeto é que tudo que ela corrige vira regra.

## Revisão semanal (ou quando a Jessica pedir "revisa as observações")

1. Junte as observações com status `aberta` por skill.
2. Para cada skill com 2 ou mais observações (ou 1 correção importante), monte a versão nova completa do SKILL.md e mostre com o cartão de salvar skill (`propose_skills`, tipo melhoria). Leia o SKILL.md atual antes, para não perder nada.
3. Repetição vista 2 ou mais vezes: proponha uma skill nova.
4. Marque as observações como `revisada AAAA-MM-DD` e registre em `REVISOES.md`.
5. No máximo 3 propostas por vez. Uma pergunta por vez para a Jessica.

## Regras

- Nunca altere arquivo de skill direto: mudança de skill só pelo cartão de salvar, aprovado pela Jessica.
- Nunca grave senha, chave, token ou dado pessoal de cliente.
- Um subagente chamado por uma conversa que já usa esta skill não anota nada: ele coloca o que percebeu no relatório dele.