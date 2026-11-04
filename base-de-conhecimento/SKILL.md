---
name: base-de-conhecimento
description: Memória e base de conhecimento compartilhada dos agentes (Dendro, Axon, Sinapse, Mielina, Córtex) com cofre Obsidian (notas em markdown) e LightRAG opcional. Use para guardar, ligar e consultar pesquisas, decisões, vozes de marca e resultados.
---

# Base de conhecimento dos agentes

Fica ao lado de `memoria-viva` e `empresa-dos-agentes`: não substitui nada, só dá um lugar organizado para o que os agentes aprendem. Respostas curtas; ler só o necessário.

## 1. Cofre Obsidian (padrão, grátis, sempre)
O Obsidian (grátis para uso pessoal) lê uma pasta de arquivos .md. Os agentes escrevem nessa pasta; o Marco abre no Obsidian e vê o grafo de ligações.

Pastas do cofre:
- `Pesquisas/` (Dendro) · `Roteiros/` (Axon) · `Calendario/` (Sinapse) · `Anuncios/` (Mielina) · `Sites/` (Córtex)
- `Marcas/` (voz, público, ofertas: MWX, Meu Primeiro App, Lar com Propósito) · `Decisoes/` · `Resultados/`

Formato de toda nota (sintaxe Obsidian, baseada em kepano/obsidian-skills, MIT):
1. Frontmatter: `title`, `tags`, `agente`, `marca`, `data`, `fonte`.
2. Ligar com `[[Nota]]` (nunca link de arquivo) para marca, pesquisa de origem e resultado.
3. Callouts: `> [!tip]` para o que funcionou, `> [!warning]` para o que falhou, `> [!question]` para dúvida.
4. Uma ideia por nota, nome claro, sem duplicar: procurar antes de criar.
5. Nunca guardar senhas, chaves ou dados pessoais de clientes.

Regra de passagem de bastão: todo agente, ao terminar, grava uma nota com o que fez e liga com `[[...]]` na nota do agente anterior. Quem começa lê primeiro a nota da marca em `Marcas/`.

Sem cofre disponível na conversa: gravar as notas em `/mnt/project-files/base-de-conhecimento/` e pedir ao Marco para copiar para o cofre.

## 2. LightRAG (opcional, quando o cofre crescer)
LightRAG (HKUDS, MIT) indexa documentos num grafo de conhecimento e responde perguntas ligando assuntos. Vale quando houver centenas de notas.

- Instalar na máquina do Marco: `pip install "lightrag-hku[api]"` e rodar `lightrag-server`; apontar para a pasta do cofre.
- Grátis só se o modelo e os embeddings forem locais (Ollama). Com API da OpenAI ou outra, passa a ser pago: **não ligar sem o Marco aprovar**.
- Consulta: fazer a pergunta ao LightRAG, conferir as fontes citadas nas notas e só então usar. Resposta sem fonte não entra em copy nem anúncio.
- Enquanto não estiver instalado, usar apenas o cofre (seção 1).

## 3. Quem usa para quê
- Dendro: grava pesquisas com fonte e data; consulta antes de pesquisar de novo.
- Axon e Sinapse: leem `Marcas/` e ganchos que funcionaram antes de escrever.
- Mielina: lê `Resultados/` para decidir o que acelerar e grava CPA/ROAS.
- Córtex: lê briefing da marca e grava decisões do site.
- Visão Geral: confere se as notas ligam entre si e se nada ficou duplicado.
