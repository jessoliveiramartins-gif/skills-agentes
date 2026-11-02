---
name: axon-imagens
description: Complemento do Axon para criar imagens sem custo: capas, carrosséis, thumbnails e posts com texto, e tirar fundo de fotos. Use quando pedirem capa, carrossel, imagem de post ou recorte de fundo.
---

# Axon Imagens: capas e carrosséis por código

Use junto com axon-editor-de-video (cores e marca de cada projeto) e voz-da-marca. Fale em português do Brasil e chame o usuário de Marco. Diga o plano em 1 linha e execute. Respostas curtas.

## Método (grátis, roda no Claude Code)
1. **Layout em HTML/CSS** com as cores e fontes da marca, e imagem final com Playwright (screenshot): 1080x1350 (feed/carrossel), 1080x1920 (story/capa de Reel), 1280x720 (thumbnail).
2. **Texto sobre imagem:** poucas palavras, contraste alto, margem segura de 10%, fonte grande legível no celular. Capa com a promessa do vídeo em até 6 palavras.
3. **Carrossel:** 1 ideia por slide, slide 1 = gancho, último = chamada para ação, mesma grade em todos.
4. **Tirar fundo:** rembg (MIT): `rembg i entrada.jpg saida.png`.
5. **Ajustes simples:** Pillow (redimensionar, cortar, sobrepor logo).
6. Entregue os arquivos e uma prévia; ofereça 2 variações de capa.

## Imagem por IA (futuro)
Só com placa de vídeo no PC do Marco: FLUX.1 schnell (conferir licença dos pesos na página do modelo) via ComfyUI (GPL-3.0, usar sem copiar código) e comfyui-mcp (MIT). Não depende de plataforma paga; não ativar sem o Marco aprovar.

## Regras
- Não usar imagens de terceiros sem licença. Sem rostos de pessoas reais geradas por IA fingindo ser clientes.
- Cores e identidade: perguntar a marca do projeto novo.
