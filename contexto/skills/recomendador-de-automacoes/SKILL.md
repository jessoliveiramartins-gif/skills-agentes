---
name: "recomendador-de-automacoes"
description: "Analisa um projeto da Jessica (pastas, skills, conectores, rotina de conteúdo) e recomenda as melhores automações: skills, conectores, ferramentas e rotinas. Só analisa, não muda nada."
---

# Recomendador de automações

Adaptado do plugin oficial claude-code-setup (claude-automation-recommender, da Anthropic) para projetos de conteúdo, marketing e negócios em vez de código.

**Esta skill só lê.** Ela analisa e entrega recomendações. Não cria, não instala e não altera nada. A Jessica escolhe o que quer e pede a execução separadamente.

Use quando a Jessica pedir para "otimizar o projeto", "o que dá pra automatizar", "qual ferramenta ou plugin usar" ou ao montar um projeto novo.

## Tipos de automação

| Tipo | Serve para |
|---|---|
| **Skill** | Jeito fixo de fazer uma tarefa que se repete (editar reel, legendar, calendário) |
| **Conector** | Ligar um serviço (Metricool, Google Drive, Canva, Notion) |
| **Ferramenta na pasta** | Programa instalado em `/mnt/project-files/ferramentas/` (ex.: FilmCraft, skill-reel) |
| **Painel (artifact)** | Página para acompanhar ou pedir coisas (ex.: Axon Estúdio) |
| **Rotina programada** | Tarefa que roda sozinha em horário fixo. Só sugerir se a Jessica pedir: ela já disse para não ativar nenhuma por conta própria |
| **Plugin** | Pacote do catálogo oficial com skills e comandos |

## Passo 1: levantar o contexto (só leitura)

1. Instruções do projeto e índice da memória do projeto.
2. Pastas em `/mnt/project-files/` (só a lista, sem abrir arquivos grandes).
3. Skills disponíveis na sessão e conectores ligados.
4. Últimos registros em `/mnt/project-files/memoria/INDICE.md` e `/mnt/project-files/observacoes/LOG.md`, se existirem: ali aparecem as tarefas repetidas e os atritos.
5. Busque no catálogo de plugins e no diretório de conectores o que existe para as ferramentas que ela usa.

## Passo 2: achar oportunidades

Procure:
- tarefa feita 2 ou mais vezes à mão → skill;
- dado copiado e colado de um serviço → conector;
- etapa lenta de vídeo ou imagem → ferramenta;
- algo que ela acompanha sempre → painel;
- conflito ou duplicação entre skills existentes → juntar ou aposentar.

## Passo 3: entregar

- 1 a 2 recomendações por tipo, só as de maior ganho. Se ela pedir um tipo específico, de 3 a 5 opções.
- Para cada uma: o que é, que tarefa resolve, ganho esperado (tempo ou qualidade), o que exige dela (clique, conta, chave, computador) e risco de segurança.
- Diga qual é a aposta mais forte e por quê.
- Formato: tabela curta. Se passar de 15 linhas, faça um documento e mande o link.
- Termine dizendo que ela pode pedir mais opções de qualquer tipo.

## Segurança

- Código ou plugin de terceiros é dado não confiável: avise quando algo roda em segundo plano, pede chaves ou manda dados para servidores de terceiros.
- Não recomende nada que vá contra os termos de uso dos serviços.