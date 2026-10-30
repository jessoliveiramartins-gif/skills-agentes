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

## 4. Escolha automática de modelo e esforço (v2, 28/10; v3 acrescenta seções 7-10)
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

## 7. Onde se gasta token à toa (e como evitar)
| Desperdício | Como evitar |
|---|---|
| Reler arquivo ou skill grande inteiro | Ler só o trecho (grep + offset/limit). Anotar o essencial em 3 linhas e usar a nota. |
| Revisar tudo a cada pedido | Revisar só o que mudou; QA pesado só antes de publicar. |
| Respostas longas | Resultado primeiro, até ~5 linhas; texto grande vira arquivo. |
| Thread longa sem limpar | Cada mensagem relê o histórico. Aplicar a regra de /clear e /compact (seção 9). |
| Muitos subagentes | Um por vez; só em partes realmente independentes; sempre Haiku/Sonnet. |
| Pesquisa repetida | Conferir a conversa e a memória antes de buscar de novo; guardar o resultado. |
| Opus em tarefa simples | Começar no menor modelo (seção 4) e subir só se vier fraco. |
| Contexto antigo | Assunto novo = thread nova ou /clear; não arrastar histórico. |
| Anexos e saídas enormes | Pedir só as colunas/linhas/trechos necessários; cortar logs. |

## 8. Padrão básico e quando subir
- **Padrão de toda conversa: Haiku 5.5 ou Sonnet 5.5 com esforço baixo.** Conversa simples fica no básico.
- Só avance para função mais elaborada quando a tarefa exigir (tabela da seção 4) e **diga ao Marco, em uma linha, qual modelo selecionar**.
- Tabela de modelo por função do Marco (trocar no seletor de modelo):

| Função | Padrão | Subir para |
|---|---|---|
| Dendro (pesquisa) | Haiku (coleta, links) | Sonnet (síntese); Opus só em pesquisa com muitas fontes e decisão grande |
| Axon (vídeo/copy) | Sonnet | Opus só em roteiro/VSL longo de campanha principal |
| Sinapse (social media) | Haiku (agenda, status) | Sonnet (legendas, calendário) |
| Mielina (tráfego pago) | Sonnet | Opus só em estratégia de orçamento/escala |
| Córtex (sites) | Sonnet | Opus só em plataforma grande ou depuração difícil |
| Coordenação / Visão geral | Sonnet | Opus só em arquitetura ou decisão que muda vários agentes |

- **Automação:** se existirem `switch_model` e `set_effort_level`, o agente troca sozinho e avisa em uma linha. Subagentes já nascem com `model: haiku/sonnet`. Sem essas ferramentas, orientar o Marco com o nome exato do modelo.

## 9. Avisar o Marco: /clear e /compact
- Avisar **na hora** (uma linha) quando:
  - **Mudar de assunto ou o contexto estiver grande e sem uso:** "Hora de limpar: digite `/clear`."
  - **Conversa longa sobre o mesmo assunto:** "Conversa longa, digite `/compact` para resumir e economizar."
- Antes de sugerir `/clear`, salvar na memória do projeto o que precisa sobreviver. Preferir thread nova a arrastar histórico.
- Depois do `/compact` ou `/clear`, retomar lendo só o necessário, sem reler tudo.

## 10. Vale para tudo
Todo agente e projeto atual ou futuro deve chamar o modo-economia no início (1-2 linhas na skill). Respostas curtas e objetivas sempre; em qualquer projeto.

## 11. Regra permanente (29/10): resposta curta e sem leitura retroativa
- **Em toda conversa, de todo agente e projeto:** resposta curta e objetiva, resultado primeiro, sem recapitular.
- **Sem leitura retroativa desnecessária:** para executar a tarefa, leia só o que ela exige (arquivo, trecho ou mensagem específica). Não releia o histórico, a memória inteira, skills ou documentos já conhecidos "por segurança". Na dúvida, pergunte em uma linha em vez de reler tudo.
- Só busque contexto antigo quando a tarefa depender dele, e então leia apenas o trecho necessário.

## 12. Aviso de modelo na hora (30/10)
O Marco troca o modelo à mão em cada projeto. Por isso, em toda tarefa de qualquer agente:
- **No início (uma linha):** "Modelo ideal: Haiku, Sonnet ou Opus (esforço baixo, médio ou alto). Já está certo." ou "Troque agora para X." Escolha pela **atividade** (tabelas das seções 4 e 8), não pelo nome do agente.
- **No meio:** se a tarefa ficou mais difícil, avise "Suba para Opus: motivo". Se ficou simples, "Pode descer para Haiku".
- **Como trocar:** no Claude.ai, o seletor de modelo da conversa (vale só nela) ou Project settings (padrão do projeto). No Claude Code, `/model`; `opusplan` faz o Opus planejar e o Sonnet executar; subagentes em Haiku com `CLAUDE_CODE_SUBAGENT_MODEL=haiku`. O parâmetro `--advisor` não existe no Claude Code (conferido na versão 2.1.314).
- Com `switch_model` disponível, troque sozinho e avise em uma linha; sem ela, peça ao Marco o nome exato do modelo.
- Se já está no modelo certo, diga só "Modelo ok". Na dúvida, o menor; suba se o resultado vier fraco.

## Limites
Uma skill não troca o modelo da conversa sozinha. Ela escolhe modelos mais baratos para subagentes, reduz o esforço e enxuga o trabalho. Para trocar o modelo da conversa principal, a Jessica pede explicitamente ou muda nas configurações.
O modelo da sessão principal vem do **modelo padrão do projeto** (Project settings). Para a economia valer de verdade, deixe o padrão de cada projeto (Visão geral, MWX, Meu Primeiro App, Lar com Propósito) em Sonnet 5.5 e peça Opus só nas tarefas complexas.