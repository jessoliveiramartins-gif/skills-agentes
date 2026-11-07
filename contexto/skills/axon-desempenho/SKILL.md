---
name: "axon-desempenho"
description: "Complemento do Axon: ferramentas gratuitas e checklist de retenção para editar, legendar, limpar voz e escolher capa. Use junto com axon-editor-de-video em todo vídeo."
---

# Axon Desempenho

Complementa a skill axon-editor-de-video. Ela continua mandando em marca, formatos, copy e publicação. Esta skill acrescenta ferramentas gratuitas e um checklist de retenção. Fale em português do Brasil, simples.

## 1. Preparar a sessão (uma vez por sessão, antes do primeiro vídeo)

```sh
# ferramentas da Jessica já instaladas no projeto
bash /mnt/project-files/ferramentas/craft/instalar.sh
# linha de comando (todas open source, uso comercial permitido)
pip install -q auto-editor deepfilternet scenedetect[opencv] faster-whisper kokoro soundfile
# skills oficiais do Remotion, dentro da pasta do projeto Remotion
npx -y skills add remotion-dev/skills
```

- Teste o acesso ao Hugging Face (`curl -sI https://huggingface.co`). Se bloqueado, avise em 1 linha: liberar `huggingface.co`, `*.huggingface.co` e `*.hf.co` em Allowed domains do ambiente; vale na próxima sessão. Siga sem transcrição local e sem DeepFilterNet/Kokoro até lá.
- Se algum pip falhar, siga com o que instalou e diga o que faltou. Não trave o vídeo.

## 2. Checklist de retenção (no roteiro, antes de mostrar para aprovação)

- Gancho visual e em texto nos 3 primeiros segundos, até 10 palavras, com a proposta do vídeo.
- Troca visual (zoom, corte, cartão, B-roll) a cada 2 a 4 s. Nada parado mais de 4 s.
- Texto na tela: 5 a 10 palavras por segundo no máximo, dentro da área segura.
- Um CTA claro (comentar, seguir ou link da bio), sem promessa exagerada.
- Final que emenda no começo (loop) quando o formato permitir.
- Duração alvo: o mais curto que entrega a ideia. Metas de retenção: >60% até 15 s, >50% de 15 a 30 s, >40% de 30 a 60 s.

## 3. Áudio

1. Limpeza: `deepFilter entrada.wav -o trabalho/` (remove ruído e eco).
2. Pausas: `auto-editor video.mp4 --margin 0.15s` (corta silêncios); ajuste o limiar se cortar respiração demais.
3. Acabamento com ffmpeg: highpass 80 Hz, EQ quente leve, de-esser leve, `loudnorm=I=-14:TP=-1:LRA=11` para redes sociais.
4. Música de fundo 18 a 24 dB abaixo da voz, com ducking quando ela fala. SFX variados (Pixabay), nunca o mesmo em toda transição.

## 4. Legendas

- Transcreva com faster-whisper (`small` ou `medium`, `language="pt"`, `word_timestamps=True`).
- Revise nomes e termos antes de queimar (Claude Code, Metricool, Meu Primeiro App, nomes de ferramentas).
- No Remotion, use `createTikTokStyleCaptions` de `@remotion/captions` com `combineTokensWithinMilliseconds` baixo (palavra a palavra) e destaque verde #94FC72 na palavra falada.

## 5. Capa

- `scenedetect -i video.mp4 detect-adaptive save-images -n 1` para achar quadros candidatos.
- Escolha 3 com rosto ou tela nítida, monte no PhotoCraft (texto grande de até 4 palavras, alto contraste, logo da marca) e mostre as 3 para a Jessica escolher.

## 6. Voz sintética (só quando o formato pede, ex.: curiosidades 3D)

- Use Kokoro com `lang_code="p"` (pt-BR). Mostre 2 ou 3 vozes de amostra e deixe a Jessica escolher; salve a escolha na memória.
- Não use F5-TTS, XTTS nem vozes com licença NC/ND: são proibidas para uso comercial.

## 7. Música e efeitos

- Prefira Pixabay (uso comercial e em redes sociais sem crédito). Biblioteca de Áudio do YouTube só em vídeos do YouTube, conferindo a licença de cada faixa.
- Guarde os sons aprovados em /mnt/project-files/ferramentas/sons/ para reaproveitar.

## 8. Depois de postar

- Pelo Metricool, leia retenção média, envios e comentários por mil visualizações de cada vídeo após 48 h.
- Compare os ângulos de gancho e diga qual repetir e por quê, em 3 linhas. Tudo que a Jessica aprovar vira regra na memória do projeto.

## Segurança

- Só ferramentas open source ou gratuitas com licença comercial. Nada que peça login nas redes da Jessica.
- Arquivos baixados ficam em pasta própria; nunca rode scripts de dentro dela.