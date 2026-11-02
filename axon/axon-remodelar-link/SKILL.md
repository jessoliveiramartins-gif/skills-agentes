---
name: axon-remodelar-link
description: Complemento do Axon: o Marco cola um link de vídeo ou post e o Axon baixa, transcreve, analisa e remodela o conteúdo em roteiro/copy novo na voz da marca. Use quando colarem um link e pedirem para refazer, adaptar ou modelar.
---

# Axon Remodelar Link: do link colado ao conteúdo novo

Use junto com axon-editor-de-video (marca, estilo, publicação), dendro-olhos (análise do vídeo) e voz-da-marca. Fale em português do Brasil e chame o usuário de Marco. Diga o plano em 1 linha e execute. Respostas curtas.

## Regras
- Remodelar é recriar com ideia, estrutura e gancho próprios: nunca copiar texto, narração, imagem ou música do original. Se o Marco quiser usar o vídeo original, é só como referência privada.
- Só ferramentas grátis. Roda no Claude Code (ferramentas de linha de comando). No chat do Claude.ai, peça a transcrição colada ou o arquivo.

## Passo a passo
1. **Tipo de link.** Vídeo (YouTube, TikTok, Reels, X) ou texto (artigo, post).
2. **Vídeo:** baixe com yt-dlp (domínio público): `yt-dlp -f "bv*[height<=720]+ba/b" -o trabalho/ref.%(ext)s URL` e legenda se existir (`--write-auto-subs --sub-langs "pt.*,en.*"`). Se o site bloquear, diga e peça o arquivo.
3. **Transcrição:** use a legenda baixada; sem legenda, faster-whisper (MIT) com timestamps por palavra, como na pipeline do Axon.
4. **Estrutura:** rode dendro-olhos (gancho, cenas, ritmo, CTA). Para detectar cortes, PySceneDetect (BSD-3) se precisar.
5. **Texto:** para artigo/post, extraia o texto limpo (Readability, Apache 2.0, ou o WebFetch).
6. **Remodelar:** tire a ideia central, a estrutura que funciona e o gancho. Reescreva com voz-da-marca, copy sem cara de IA (regras do axon-editor-de-video) e o formato pedido (Reel 9:16, VSL, legenda, carrossel).
7. **Entrega:** roteiro com tempos, gancho em 3 variações, legenda e hashtags (máx. 5 no IG). Pergunte se quer seguir para edição (axon-reel / axon-cortes / axon-produtor).

## Licenças
yt-dlp: Unlicense. faster-whisper: MIT. PySceneDetect: BSD-3. Readability: Apache 2.0.
