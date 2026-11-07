---
name: "axon-produtor"
description: "Axon produtor: cria vídeos 100% com IA (roteiro, narração, imagens, legenda) a partir de vídeos de referência, sem gravação humana. Use para vídeo feito por IA, faceless ou pedido do painel Axon Estúdio."
---

# Axon Produtor (vídeo 100% IA)

O Axon tem dois braços:
- **Editor** (`axon-editor-de-video`, `axon-reel`): trabalha com gravação humana da Jessica.
- **Produtor** (esta skill): faz o vídeo inteiro com IA. Usa vídeos de referência só para aprender formato, ritmo e copy; nunca copia trechos deles.

Motor: MoneyPrinterTurbo (MIT, github.com/harry0703/MoneyPrinterTurbo), guardado em `/mnt/project-files/ferramentas/produtor-ia/`. O Axon escreve o roteiro e os termos de busca; o motor faz narração, legenda, busca de imagens, montagem e música. Não precisa de chave de LLM.

## REGRAS PERMANENTES DA JESSICA (valem acima de tudo abaixo)
1. **Vídeo longo ou série: de duas em duas partes.** Nunca gerar o vídeo inteiro de uma vez. Divida em partes de cerca de 1 minuto (não precisa ser exato), entregue as DUAS primeiras, e PARE para aprovação. Só gere as próximas duas depois que ela aprovar as anteriores. Motivo: evitar gastar crédito e ter de ajustar um vídeo de 15 minutos inteiro.
2. **Copy didática e conectada.** Cada parte tem seu tema e ensina um pedaço da história de forma clara; começa recapitulando a anterior em uma frase e termina com gancho para a próxima. Fatos bíblicos/históricos conferidos na fonte (capítulo e versículo).
3. **Visual desenhado por nós.** Quando o pedido for de desenho/motion graphics, nada de compor gravuras, pinturas ou fotos de fonte incerta: tudo é ilustração própria, com qualidade de animação profissional (contorno se traçando, preenchimento entrando, letreiros escrevendo, câmera contínua).
4. **Nenhum visual repetido.** Nenhuma cena pode repetir desenho, símbolo, figura ou composição de outra cena; o fluxo é contínuo (no máximo uma recapitulação pequena no canto).
5. **Narração boa.** Voz grave e clara de narrador de documentário, boa dicção, sem pausas desnecessárias, coerente com a imagem (receita no passo 6B).

## 0. Preparar a sessão
```bash
bash /mnt/project-files/ferramentas/produtor-ia/instalar.sh
M=~/produtor-ia/MoneyPrinterTurbo
```
Precisa de uma chave grátis do Pexels (`MPT_PEXELS_API_KEY`) ou da Pixabay (`MPT_PIXABAY_API_KEY`) nos segredos do ambiente. Sem chave, use `--video-source local` com imagens próprias (passo 5B).

## 1. Briefing (uma pergunta por vez, só o que faltar)
Confirmar: **marca**, **formato** (vertical 9:16 para Reels/TikTok/Shorts, horizontal 16:9 para YouTube, ou os dois), **tema**, **objetivo/CTA** (sempre para o infoproduto da bio), **duração** (vertical 30–45 s; horizontal: série em partes de ~1 min, regra 1), **voz** (se a Jessica já escolheu, está na memória). Pedido do painel já traz tudo isso.

## 2. Estudar a referência
Para cada vídeo de referência (em `/mnt/project-files/uploads/` ou no painel):
```bash
ffprobe -v error -show_entries stream=width,height:format=duration -of json REF.mp4
ffmpeg -i REF.mp4 -vf "select='gt(scene,0.3)',scale=360:-1,tile=4x4" -frames:v 1 -vsync 0 cortes.jpg
ffmpeg -i REF.mp4 -vf "fps=1/10,scale=400:-1,tile=6x8" -frames:v 1 folha.jpg
ffmpeg -ss 60 -t 8 -i REF.mp4 -vf "fps=2,scale=400:-1,tile=4x4" -frames:v 1 movimento.jpg
```
Olhar as folhas (a de movimento mostra como as coisas surgem na tela) e (se houver whisper) a transcrição. Gravar a **ficha** em `/mnt/project-files/referencias/<marca>/<AAAA-MM-DD>_<nome>.md`:
- Formato e duração; gancho dos 3 primeiros segundos (texto e visual)
- Estrutura em blocos com tempo (gancho, problema, virada, prova, CTA)
- Ritmo: cortes por minuto (um vídeo de quadro contínuo pode ter 2 cortes em 8 min), zooms, tipo de legenda
- Estilo de desenho: material (papel, tinta), traço, cores, como o texto aparece, como a câmera se move
- Narração: tom, velocidade, uma pessoa ou diálogo
- Música e SFX; CTA final
- **O que modelar** e **o que não copiar** (marca, rosto, desenhos, frases, música de terceiros)
Essas fichas são a memória de treino do produtor: antes de produzir, ler as fichas da marca.

## 3. Copy
- 3 a 5 ganchos de até 10 palavras em ângulos diferentes (pergunta, desafio, comparação, grátis, "pare de..."), dizendo qual é a aposta mais forte e por quê.
- Roteiro de narração falada, frases curtas, cerca de 150 palavras por minuto (vertical de 35 s ≈ 85–95 palavras; parte de série de ~1 min ≈ 140–160 palavras). Termina no CTA da bio (ou, em série, no gancho da próxima parte).
- Série: uma linha de plano com o tema de cada parte antes de escrever, para as partes se conectarem.
- Legenda TikTok + legenda Instagram (dentro do limite), 3 a 5 hashtags, prompt usado quando fizer sentido.
- Linguagem de conversa, sem promessa exagerada, sem "você precisa comprar isso".

## 4. Termos visuais / plano de desenho
Com banco de imagens: um termo em inglês por frase do roteiro, na ordem (ex.: `woman using phone at desk, small bakery owner, calendar planner closeup`). Evitar termos que tragam logos ou rostos famosos.
Com desenho (regra 3): uma descrição de desenho por cena, cada uma diferente de todas as outras (regra 4), dizendo o que se desenha, em que ordem e para onde a câmera vai.

## 5A. Render com banco de imagens (Pexels/Pixabay, licença livre para uso comercial)
```bash
cd $M && .venv/bin/python cli.py \
  --video-subject "TEMA" \
  --video-script "$(cat roteiro.txt)" \
  --video-terms "termo 1, termo 2, termo 3" \
  --match-materials-to-script \
  --video-aspect 9:16 \
  --video-source pexels \
  --voice-name pt-BR-FranciscaNeural-Female \
  --voice-rate 1.1 \
  --font-name PlusJakartaSans.ttf --font-size 70 \
  --subtitle-position bottom \
  --text-fore-color "#FFFFFF" --stroke-color "#000000" --stroke-width 1.5 \
  --bgm-type none \
  --video-transition-mode fade-in
```
Vozes grátis pt-BR: `pt-BR-FranciscaNeural-Female`, `pt-BR-AntonioNeural-Male`, `pt-BR-ThalitaMultilingualNeural-Female`. Confira os nomes exatos com `--help` na primeira vez. Para 16:9 troque `--video-aspect 16:9`. Use `--video-count 2` para ter duas opções de cena.

## 5B. Render com imagens próprias da marca
Gerar quadros 1080x1920 (ou 1920x1080) com a identidade da marca: cards em HTML renderizados pelo Playwright (como o kit da `axon-reel`) ou PhotoCraft. Depois `--video-source local --video-materials q1.png,q2.png,... --image-motion zoom`.

## 5C. Motion graphics desenhado (Python)
Para desenho animado próprio: cada camada (traço, preenchimento, texto) vira um mapa de alfa + um mapa de ordem de revelação (varredura, radial ou comprimento do traço), e o quadro é `alfa * (mapa_de_ordem < progresso)`. Dicas de velocidade: some as camadas de tinta num canal único e faça um só blend de 3 canais por quadro; renderize em blocos, um processo por núcleo, com pipe direto para o ffmpeg; em áudio longo use média móvel por cumsum (np.convolve com janela grande trava). Para matar processos use o PID: `pkill -f` com um padrão que aparece no próprio comando mata o shell.

## 6. Acabamento (padrão Axon)
- Música baixa: trilha da Pixabay em `ferramentas/produtor-ia/trilhas/` ou sintetizada (acordes mudando a cada 7–13 s, sem loop perceptível), mixada a −20 a −26 dB sob a voz; áudio final −14 a −16 LUFS.
- Logo da marca e cartão final de CTA com FilmCraft/ffmpeg; tudo dentro da área segura (~15% de margem); fundo ocupa a tela inteira; botões nunca em cima de títulos; o cartão final cobre a cena anterior.
- SFX suaves e variados só nas viradas (swoosh, pop, ding, rabisco de caneta quando algo se escreve), nada repetido.
- Capa no melhor quadro (photocraft ou `ffmpeg -ss`).

## 6B. Narração grave de documentário (Edge TTS)
`pt-BR-AntonioNeural`, `--pitch -6Hz`, rate base `-3%` com ±3% por frase; gere frase por frase (até 6 em paralelo), apare o silêncio, iguale o volume e junte com pausas de 0,2–0,3 s (0,4 s após pergunta). Tratamento: `highpass=f=70, equalizer=f=110:g=4, equalizer=f=260:g=-1.5, equalizer=f=3000:g=2.5, equalizer=f=6800:g=-2.5, acompressor (ratio 3), loudnorm=I=-16, alimiter`. Sem eco, aexciter ou asetrate (dão distorção). Atrás do proxy, o edge-tts precisa de `edge_tts.communicate._SSL_CTX = ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt")`. `pt-BR-MacerioMultilingualNeural` não devolve áudio.

## 7. Entrega e aprovação
Pastas: `/mnt/project-files/videos/AAAA-MM-DD_tema/{brutos,trabalho,prontos}`. O v1 vai para `trabalho/` e para a Jessica aprovar (mandar no chat e, se o pedido veio do painel, subir o mp4 como asset do painel e atualizar o pedido com `status: "aprovacao"`, `video_url`, ganchos e legendas). Em série, entregar as duas partes juntas e esperar a aprovação antes das próximas (regra 1). Só depois de aprovado copia para `prontos/` e segue para a Sinapse/Metricool. Nunca publica nem agenda sem aprovação.

## Painel Axon Estúdio
Painel: https://claude.ai/artifact/VSq3TPStTjFCgd4VyNqxZB . Pedidos chegam na coleção `pedidos`; os docs com `exemplo: true` são de demonstração (apagar quando chegar o primeiro pedido real). Ler com `ArtifactData` (`list`, coleção `pedidos`), pegar os que têm `status: "fila"`, e atualizar o status a cada etapa: `fila` → `roteiro` → `produzindo` → `aprovacao` → `aprovado` / `ajuste` → `agendado`. Pedido em `ajuste` traz `nota_ajuste`: gerar v2 e voltar para `aprovacao`. Fichas de referência também vão para a coleção `referencias` (campos: titulo, marca, formato, gancho, estrutura, ritmo, modelar, nao_copiar).

### Ao vivo: atualizar cada vídeo na hora (obrigatório)
O Painel mostra a linha de produção com um cartão por vídeo que anda sozinho de coluna, pisca quando muda e tem cronômetro e previsão. Ele só anda se o Axon gravar cada passo no momento em que acontece:
- **Um pedido por vez, a cada etapa.** Ao começar ou terminar uma etapa, faça logo um `update` só daquele pedido. Nunca guarde para atualizar vários vídeos de uma vez no fim.
- **Horário real.** `t`, `atualizado_em` e `etapa_desde` com o horário ISO exato do momento (`new Date().toISOString()` ou `date -u +%Y-%m-%dT%H:%M:%SZ`). Nunca arredondar nem repetir o mesmo horário em lote.
- **Campos em cada passo:** `etapa` (briefing, roteiro, narracao, visuais, montagem, legendas, render, qa, entrega), `progresso` (0–100, cresce a cada passo), `etapa_desde` (quando a etapa atual começou), `atualizado_em`, e uma linha nova no fim de `log` (`{t, txt}`) dizendo o que acabou de fazer, em frase curta.
- **Previsão:** quando souber quanto falta (ex.: render de 6 min), grave `previsao_fim` em ISO. Sem ela o painel calcula pelo ritmo.
- **Trabalho longo** (render, narração em fila): grave uma linha de log a cada 5–10 min enquanto roda, para o cronômetro não pausar (ele pausa depois de 15 min sem atualização).
- **Ajuste pedido:** grave `ajuste_em` com o horário e uma linha "ajuste pedido: ..."; o cronômetro zera e recomeça na primeira linha nova.
- Ao terminar o v1: `etapa: "entrega"`, `progresso: 100`, `status: "aprovacao"`.

## Licenças e custos
- Grátis: MoneyPrinterTurbo, Pexels, Pixabay, fontes OFL em `fontes/`.
- Voz Edge TTS: grátis, mas usa um serviço online da Microsoft sem licença comercial explícita. Para vídeo pago/anúncio, preferir Kokoro pt-BR (local, Apache; vozes `kokoro:pf_dora` e `kokoro:pm_alex`, via servidor Kokoro-FastAPI configurado em `[kokoro] base_url` do config.toml) quando o huggingface.co estiver liberado, ou uma voz que a Jessica contratar.
- As músicas e fontes chinesas originais do repositório foram removidas (direitos incertos).
- Provedores pagos do motor (Seedance, WaveSpeed, OFox, MuAPI etc.) só com OK explícito da Jessica.