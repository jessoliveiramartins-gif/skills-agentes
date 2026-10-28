---
name: "modo-economia"
description: "Modo economia de créditos para todos os projetos e agentes da Jessica (Marco): use em qualquer tarefa para escolher o menor modelo e esforço que mantêm a qualidade."
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

## 4. Escolha automática de modelo e esforço (v2, 28/10)
Padrão: **Sonnet 5.5** com esforço baixo/médio. Opus 5.5 só quando o ganho de qualidade compensa.

| Tipo de tarefa | Modelo | Esforço |
|---|---|---|
| Conversa, status, resumo, tradução, formatação, renomear, buscar um dado | Haiku 5.5 | baixo |
| Extrair, listar, converter, conferir arquivos, coletar links/dados | Haiku 5.5 | baixo |
| Copy, roteiro, legenda, edição de um arquivo, página simples, análise de planilha, pesquisa curta | Sonnet 5.5 | médio |
| Código médio, painéis, revisão (QA) de entregas | Sonnet 5.5 | médio/alto |
| Arquitetura, código grande, depuração difícil, estratégia com muitas fontes, decisão que muda vários agentes | Opus 5.5 | alto |

- Na dúvida entre dois níveis, comece no menor e suba só se o resultado vier fraco (avise em uma linha).
- Ao voltar a algo simples, desça de novo. Não fique no Opus "por via das dúvidas".

## 5. Delegar para economizar
- Subtarefas simples ou mecânicas (coletar dados, listar arquivos, resumir um documento, conferir formato) vão para subagente com `model: haiku`; trabalho de escrita ou análise média, `model: sonnet`. O agente principal só decide e junta o resultado.
- Passe ao subagente só o necessário (trecho, não o documento inteiro) e peça resposta curta.
- Um subagente por vez, salvo se as partes forem realmente independentes.
- Se a sessão tiver as ferramentas `switch_model` e `set_effort_level`, use-as para descer/subir o nível da própria thread conforme a tabela acima.

## 6. Hábitos de economia
- **Uma tarefa por vez.** Termine, entregue, só então comece a próxima. Pedidos de assuntos diferentes pertencem a threads diferentes.
- **Não releia documentos grandes.** Leia uma vez, anote o essencial em poucas linhas (ou na memória do projeto) e use as notas. Releia só o trecho que mudou.
- **Respostas curtas**: resultado primeiro, sem recapitular o que o Marco já sabe; documentos longos viram arquivo, não mensagem.
- **Sugira fechar threads concluídas** ("posso resolver esta thread?"): thread longa custa mais a cada mensagem porque o histórico inteiro é relido. Para um assunto novo, sugira thread nova.
- Prefira ferramentas gratuitas e comandos locais a buscas pagas ou repetidas.

## Limites
Uma skill não troca o modelo da conversa sozinha. Ela escolhe modelos mais baratos para subagentes, reduz o esforço e enxuga o trabalho. Para trocar o modelo da conversa principal, a Jessica pede explicitamente ou muda nas configurações.
O modelo da sessão principal vem do **modelo padrão do projeto** (Project settings). Para a economia valer de verdade, deixe o padrão de cada projeto (Visão geral, MWX, Meu Primeiro App, Lar com Propósito) em Sonnet 5.5 e peça Opus só nas tarefas complexas.
