---
name: "memoria-viva"
description: "Memória contínua entre conversas para todos os agentes da Jessica (Axon, Dendro, Sinapse, Mielina, Córtex): lê o resumo no início e registra o que foi feito ao fim de cada tarefa."
---

# Memória viva

Versão em skill do claude-mem, feita para os projetos na nuvem. Mesmo objetivo: nenhuma conversa nova começa do zero e nada que a Jessica já explicou precisa ser perguntado de novo. Sem programa instalado, sem servidor, sem chave: tudo em arquivos de texto.

Use junto com qualquer outra skill, em toda tarefa de qualquer projeto.

## Onde fica

- **Regras e fatos duráveis**: a memória do projeto (pasta de memória da sessão, índice MEMORY.md). Continua sendo o lugar das regras aprovadas.
- **Diário de trabalho**: `/mnt/project-files/memoria/` (pasta compartilhada do projeto)
  - `INDICE.md`: uma linha por registro, a mais nova no topo. Formato: `AAAA-MM-DD | marca | tipo | resumo de até 15 palavras | arquivo`
  - `AAAA-MM/AAAA-MM-DD-assunto.md`: o registro completo da tarefa.

Tipos: `entrega`, `decisao`, `correcao`, `preferencia`, `bloqueio`, `ideia`.

## 1. No início de toda tarefa (leitura em camadas)

Gaste pouco contexto: leia do mais barato para o mais caro.

1. Leia o índice da memória do projeto (já vem no contexto).
2. Leia só as 30 primeiras linhas de `/mnt/project-files/memoria/INDICE.md`.
3. Procure no índice pela marca e pelo assunto da tarefa (`grep -i` com 2 ou 3 palavras-chave).
4. Abra o registro completo **apenas** das linhas que importam para a tarefa (no máximo 3).
5. Se nada bater, siga sem abrir mais nada.

Nunca leia a pasta inteira. Nunca recite a memória para a Jessica; use em silêncio.

## 2. Durante a tarefa

Anote mentalmente (não escreva ainda):
- o que a Jessica aprovou, recusou ou corrigiu, com as palavras dela;
- decisões tomadas e por quê;
- arquivos gerados e onde estão;
- o que ficou pendente.

## 3. Ao fim de cada tarefa (ou antes de uma pausa longa)

1. Escreva o registro em `/mnt/project-files/memoria/AAAA-MM/AAAA-MM-DD-assunto.md`, comprimido, no máximo 25 linhas:

```
# <assunto> — <marca> — <data>
Pedido: <1 linha>
Feito: <bullets curtos>
Decisões: <o que e por quê>
Correções da Jessica: <frase dela entre aspas>
Arquivos: <caminhos>
Pendente: <o que falta e de quem depende>
```

2. Acrescente a linha no topo de `INDICE.md` (releia o arquivo logo antes de escrever, porque outras conversas também escrevem nele).
3. **Promova** para a memória do projeto o que é regra durável: correção ou aprovação que vale para as próximas vezes, preferência de estilo, dado de conta ou ferramenta. Atualize o arquivo existente do assunto em vez de criar outro.

## Privacidade

- Nunca grave senha, token, chave de API, dados de cartão ou dados pessoais de clientes.
- Trecho que a Jessica marcar como `<privado>` ou disser "não guarda isso" não entra em nenhum arquivo.

## Manutenção

- Quando `INDICE.md` passar de 300 linhas, mova as linhas com mais de 90 dias para `INDICE-AAAA.md` e deixe só as recentes.
- Registro que virou errado: corrija ou apague, e ajuste a linha do índice.
- Se a pasta não existir, crie `/mnt/project-files/memoria/` e um `INDICE.md` vazio com o cabeçalho do formato.