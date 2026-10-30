# Catálogo: skills que agregam aos 4 agentes

Atualizado em 26/10/2026. Pesquisa do Dendro no GitHub público. Só entram skills grátis, com licença aberta e sem scripts suspeitos.

## 1. O que já está salvo na conta do Marco

| Skill | Agente | Situação |
|---|---|---|
| dendro-buscador | Dendro | Salva (versão antiga). Versão nova com método profundo e checagem de fatos aguarda o cartão |
| axon-editor-de-video | Axon | Salva (versão antiga). Versão nova com copy anti-IA e criativo de anúncio aguarda o cartão |
| axon-desempenho | Axon | Salva |
| modo-economia | Todos | Salva |
| mielina-trafego-pago | Mielina | **Só proposta.** Salvar pelo cartão |
| sinapse-social-media | Sinapse | **Só proposta.** Salvar pelo cartão |
| axon-cortes | Axon | **Só proposta.** Salvar pelo cartão |
| dendro-concorrentes | Dendro | Salva |
| voz-da-marca | Axon, Sinapse | Salva |
| ciclos-dos-agentes | Todos | Recusada pelo Marco (fica só no repositório, como referência) |

A versão mais nova de cada uma está nas pastas deste repositório.

## 2. Skills de fora, por agente

### Dendro (pesquisa)
| Skill | Repositório | Licença | O que agrega | Como aplicar |
|---|---|---|---|---|
| deep-research | alirezarezvani/claude-skills | MIT | Triangulação em 3 fontes, advogado do diabo | Já adaptado no dendro-buscador novo |
| customer-research | coreyhaines31/marketingskills | MIT | Garimpar a voz do cliente em comentários, avaliações e fóruns | Adaptado no dendro-concorrentes |
| ads-competitor | AgriciDaniel/claude-ads | MIT | Espionar anúncios na Biblioteca da Meta e do Google sem copiar | Adaptado no dendro-concorrentes |
| transcribe | tvr-ux/claude-transcribe-skill | MIT | Transcrever Reels, TikTok e YouTube de concorrentes (yt-dlp + whisper) | Adaptado no dendro-concorrentes, com faster-whisper |
| yt-transcript | moretothat/yt-transcript | MIT | Transcrição limpa + resumo de vídeo do YouTube | Alternativa, não precisa salvar |

### Axon (vídeo e copy)
| Skill | Repositório | Licença | O que agrega | Como aplicar |
|---|---|---|---|---|
| remotion-best-practices, remotion-captions | remotion-dev/skills | Licença Remotion (grátis p/ pessoa física) | Regras oficiais do Remotion e legendas | Instalar direto: `npx skills add remotion-dev/skills` |
| clipify | louisedesadeleer/clipify | MIT | Achar momentos, cortar, 9:16, legenda | Já adaptado no axon-cortes |
| copywriting (No AI tells) | coreyhaines31/marketingskills | MIT | Copy sem cara de IA | Já no axon-editor-de-video novo |
| video | coreyhaines31/marketingskills | MIT | Panorama de IA de vídeo (Veo, Kling, HeyGen, Hyperframes) | Consulta; Hyperframes já citado no Axon |
| llm-video-maker | GoldLegendW80/llm-video-maker | MIT | Vídeo de um prompt com HyperFrames | Testar só se o Remotion ficar pesado |

### Sinapse (social media)
| Skill | Repositório | Licença | O que agrega | Como aplicar |
|---|---|---|---|---|
| social | coreyhaines31/marketingskills | MIT | Ganchos, reaproveitamento, anti-IA | Já no sinapse-social-media |
| content-strategy | coreyhaines31/marketingskills | MIT | Escolher pautas por busca e demanda | Ideia para uma próxima versão |
| marketing-loops | coreyhaines31/marketingskills | MIT | Rotinas semanais com checagem e parada | Adaptado no ciclos-dos-agentes |
| influencer-marketing | coreyhaines31/marketingskills | MIT | Parcerias com criadores e afiliados | Útil quando o TikTok Shop crescer |

### Mielina (tráfego pago)
| Skill | Repositório | Licença | O que agrega | Como aplicar |
|---|---|---|---|---|
| ads, ad-creative | coreyhaines31/marketingskills | MIT | Playbook Meta 2026, iteração de criativos | Já no mielina-trafego-pago |
| offers | coreyhaines31/marketingskills | MIT | Montar a oferta (bônus, garantia, urgência) | Base para um agente de página de vendas |
| claude-ads | AgriciDaniel/claude-ads | MIT | Auditoria de contas de anúncio | Usar quando houver conta rodando com dados |
| meta-ads-strategy | adkit/ads-skills | Restritiva | | **Não usar**: proíbe incorporar |

### Repositório affaan-m/ECC (avaliado em 26/10/2026)
Kit grande (71 agentes, 311 skills, hooks) feito para programadores no Claude Code. Não vale instalar inteiro nos projetos de marketing. Aproveitado: brand-voice e content-engine (MIT), viraram a skill voz-da-marca. Úteis se um dia for programar: market-research, frontend-slides, security-review.

## 3. Ideia de agente novo
**Página de vendas e oferta** (ex.: nome "Córtex", a parte do cérebro que decide): juntaria offers, page-cro e copywriting (todos MIT) para o infoproduto low ticket.

## 4. Como salvar e aplicar
1. Clique em **Salvar** nos cartões de proposta da conversa. Só assim a skill passa a funcionar em todos os projetos.
2. Este repositório guarda a cópia oficial de cada skill. Quando uma skill mudar, atualize a pasta aqui.
3. As skills de fora com licença MIT foram traduzidas e adaptadas, com crédito no fim de cada arquivo. Não copiamos nenhuma inteira.
4. Instalar direto só a do Remotion, porque é oficial e muda junto com a ferramenta.

## 5. Rodada 5 (30/10/2026): find-skills por agente
Veredito completo no PR. Resumo:

| Agente | Skill | Repositório | Licença | Veredito |
|---|---|---|---|---|
| Córtex | frontend-design | anthropics/skills | Apache-2.0 (LICENSE.txt da skill) | Adaptar: direção de design não genérica |
| Córtex | page-cro, seo-audit | coreyhaines31/marketingskills | MIT | Adaptar: conversão e SEO de página |
| Córtex | web-design-guidelines | vercel-labs/agent-skills | Sem LICENSE localizada; busca regras por URL em tempo de execução | Só citar, não copiar |
| Sinapse | content-strategy | coreyhaines31/marketingskills | MIT | Adaptar: pautas por demanda (já era ideia) |
| Mielina | nada novo | | | Já coberta (ads, ad-creative, offers) |
| Dendro | nada novo | | | Já coberta; achados eram skills de código |
| Axon | cut-as-code | WhiteTowerAI/cut-as-code | MIT | Só referência: roda serviço local (Editor Hub); Axon Estúdio e skills atuais ficam intactos |
