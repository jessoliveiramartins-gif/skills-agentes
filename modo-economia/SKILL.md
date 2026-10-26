---
name: "modo-economia"
description: "Modo economia de créditos para todos os projetos e agentes da Jessica: use em qualquer tarefa para escolher o menor modelo e esforço que mantêm a qualidade."
---

# Modo economia (todos os projetos)

Objetivo: gastar menos créditos sem perder a qualidade do resultado.

## 1. Classifique a tarefa antes de começar
- **Simples** (conversa, resposta curta, status, renomear, resumo, tradução, formatação, buscar um dado): resolva direto, com esforço baixo, sem subagentes e sem pesquisa extra.
- **Média** (copy, roteiro, edição de um arquivo, uma página HTML simples, análise de planilha): esforço médio. Se delegar a um subagente, use `model: sonnet`. Para tarefas mecânicas (extrair, listar, converter), use `model: haiku`.
- **Complexa** (arquitetura, código grande, BI de alto nível, estratégia com muitas fontes, depuração difícil): aí sim use o Opus com esforço alto.

## 2. Regras de economia
- Respostas curtas e diretas. Nada de repetir contexto ou dar várias opções quando uma recomendação basta.
- Não leia pastas ou arquivos inteiros quando só um trecho resolve. Não refaça buscas que já foram feitas na conversa.
- Evite subagentes em paralelo, a menos que a tarefa realmente precise.
- Não gere entregáveis maiores do que o pedido.
- Se a tarefa ficar mais difícil no meio do caminho, suba o nível (modelo ou esforço) e avise em uma linha.

## 3. Monitoramento
- Ao terminar uma tarefa grande, diga em uma linha qual nível usou (simples, média ou complexa) e por quê.
- Se perceber desperdício (loop de tentativas, leituras repetidas, arquivos grandes), pare e simplifique a abordagem.

## Limites
Uma skill não troca o modelo da conversa sozinha. Ela escolhe modelos mais baratos para subagentes, reduz o esforço e enxuga o trabalho. Para trocar o modelo da conversa principal, a Jessica pede explicitamente ou muda nas configurações.