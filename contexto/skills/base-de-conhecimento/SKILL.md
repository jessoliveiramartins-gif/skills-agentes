---
name: "base-de-conhecimento"
description: "Memória compartilhada dos agentes com cofre Obsidian e LightRAG opcional. Use para guardar, ligar e consultar pesquisas, decisões, vozes de marca e resultados."
---

# Base de conhecimento dos agentes

Fica ao lado de `memoria-viva` e `empresa-dos-agentes`: não substitui nada. Respostas curtas; ler só o necessário.

## 1. Cofre Obsidian (padrão, grátis)
O Obsidian lê uma pasta de arquivos .md. Os agentes escrevem nela; o Marco abre no Obsidian e vê o grafo.

Pastas: Pesquisas (Dendro), Roteiros (Axon), Calendario (Sinapse), Anuncios (Mielina), Sites (Córtex), Marcas, Decisoes, Resultados. Cofre inicial no repo skills-agentes, pasta `cofre/`.

Formato de toda nota (sintaxe de kepano/obsidian-skills, MIT):
1. Frontmatter: title, tags, agente, marca, data, fonte.
2. Ligar com [[Nota]] para marca, pesquisa de origem e resultado.
3. Callouts: > [!tip] funcionou, > [!warning] falhou, > [!question] dúvida.
4. Uma ideia por nota; procurar antes de criar, sem duplicar.
5. Nunca guardar senhas, chaves ou dados pessoais de clientes.

Passagem de bastão: ao terminar, o agente grava uma nota do que fez e liga na nota do agente anterior. Quem começa lê primeiro a nota da marca em Marcas/.

Sem cofre na conversa: gravar em /mnt/project-files/base-de-conhecimento/ e avisar o Marco para copiar ao cofre.

## 2. LightRAG (opcional, quando passar de centenas de notas)
LightRAG (HKUDS, MIT) indexa as notas em grafo e responde ligando assuntos.
- Instalar na máquina do Marco: pip install "lightrag-hku[api]" e rodar lightrag-server apontando para o cofre.
- Grátis só com modelo e embeddings locais (Ollama). Com API paga, não ligar sem o Marco aprovar.
- Conferir as fontes citadas; resposta sem fonte não entra em copy nem anúncio.

## 3. Quem usa para quê
- Dendro: grava pesquisas com fonte e data; consulta antes de pesquisar de novo.
- Axon e Sinapse: leem Marcas/ e ganchos que funcionaram.
- Mielina: lê Resultados/ e grava CPA/ROAS.
- Córtex: lê o briefing da marca e grava decisões do site.
- Visão Geral: confere ligações e duplicatas.