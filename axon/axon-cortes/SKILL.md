---
name: axon-cortes
description: Complemento do Axon para transformar um vídeo longo (live, aula, podcast) em cortes curtos 9:16 com legenda. Use junto com axon-editor-de-video quando pedirem cortes, clipes ou melhores momentos.
---

# Axon Cortes: do vídeo longo aos clipes

Use junto com a skill axon-editor-de-video (marca, estilo de legenda e publicação estão lá). Fale em português do Brasil e chame o usuário de Marco. Diga o plano em 1 linha e execute, sem narrar cada tentativa.

## 1. Achar os momentos
1. Extraia o áudio: `ffmpeg -y -i VIDEO -vn -ac 1 -ar 16000 trabalho/audio.wav`.
2. Transcreva com faster-whisper (pt, timestamps por palavra), como na pipeline do Axon.
3. Leia a transcrição e proponha de 3 a 8 candidatos, de 15 a 60 s cada. Sinais de bom corte:
   - frase que se sustenta sozinha (opinião forte, dica completa, número surpreendente);
   - virada: pergunta seguida de resposta inesperada;
   - mini-história com começo, conflito e desfecho (60-90 s);
   - reação ou risada ("não acredito", "sério?", pausa longa antes da resposta);
   - picos de volume (`ffmpeg -af volumedetect`) ou troca rápida de falas.
4. Mostre uma tabela: início, fim, por que funciona, gancho sugerido (até 10 palavras), rede. Só corte depois que o Marco escolher.

## 2. Cortar
- Corte rápido: `ffmpeg -y -ss INICIO -t DURACAO -i VIDEO -c copy trabalho/corte_N.mp4`. Recodifique só se o corte precisar ser exato no quadro.
- Conte as trocas de cena dentro do corte: `ffmpeg -i corte.mp4 -filter:v "select='gt(scene,0.3)',showinfo" -f null -`. Muitas trocas atrapalham o reenquadramento: avise ou escolha um trecho de cena única.

## 3. Reenquadrar 16:9 → 9:16 (1080x1920)
- Uma pessoa: corte centralizado no rosto.
- Duas pessoas: pergunte uma vez se prefere (a) câmera que pula para quem está falando, com cortes secos, ou (b) tela dividida com as duas pessoas sempre visíveis.
- Para achar o rosto, tire 1 quadro (`ffmpeg -ss MEIO -i corte.mp4 -frames:v 1 trabalho/quadro.jpg`), olhe a imagem, marque a área de boca e queixo e confira desenhando a caixa com drawbox. No máximo 2 ajustes.
- Fonte em 4K: reduza para 1920x1080 antes, é mais rápido e basta para 9:16.
- Gravação de tela: dê zoom na área da ação em vez de cortar o centro.

## 4. Legendar e finalizar
- Transcreva de novo só o corte (timestamps certos a partir do zero) e aplique a legenda palavra a palavra do Axon (destaque verde #94FC72), pelo Remotion ou por arquivo ASS com `ffmpeg -vf subtitles=legenda.ass`.
- Acelerar trecho: `setpts` junto com `atempo` (0,5 a 2,0 por filtro; para 4x, encadeie dois), senão a voz fica fina.
- Gancho em texto nos 3 primeiros segundos e legenda que se entende sem o resto do vídeo.
- Final: `-c:v libx264 -crf 20`, 30 fps. Salve em prontos/ com nome AAAA-MM-DD_tema_corteN.mp4.

## 5. Entregar
- Uma linha por corte: nome, duração, por que funciona, caminho do arquivo.
- Para cada corte, gancho, legenda (máx. 5 hashtags no Instagram) e palavra de "Comenta X", no padrão do Axon.
- Sugira à Sinapse a ordem de publicação ao longo de 1 a 2 semanas.
- Não publique nem agende nada sem aprovação.

## Na linha de produção (arquitetura 27/10/2026)
- Cortes de conteúdo com fatos só depois do research_packet e do brief aprovado; cada afirmação do corte aponta para a fonte do Dendro.
- Trabalhe com checkpoint: o vídeo original fica intocado em brutos/, cortes numerados, nada sobrescrito. Com o Kinocut instalado, prefira ele (gera recibo com hashes de entrada e saída).
- Liste a origem e a licença de música, imagem e trechos de terceiros. Sem licença clara, fica de fora.
- Entregue os cortes dentro do creative_packet do Axon e passe pelo QA do Visão Geral antes de ir para a Sinapse.

Adaptado de louisedesadeleer/clipify (licença MIT).
