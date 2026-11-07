# Escritório dos Agentes

Página única e autônoma (`index.html`, sem dependências, sem custo) com um escritório isométrico onde os 5 agentes gerais (Dendro, Axon, Sinapse, Mielina, Córtex) e os 2 subagentes (Nexo, Fábrik) trabalham em computadores animados. Clique em um personagem (ou na lista) para ver função, status, tarefa atual e conversar.

- Abrir: dê dois cliques em `index.html`.
- Controles: arrastar para mover, roda do mouse ou pinça para ampliar, Esc fecha o chat.
- Conversas ficam no `localStorage` do navegador.
- Respostas simuladas por padrão. Para ligar a um backend: botão "Conectar" (ou edite `AgentAPI.send`). O backend recebe `POST {agent, message, history, context}` e responde `{reply}`.
- Para mudar funções, tarefas, aparência ou salas, edite o array `AGENTS` e o objeto `ROOMS` no início do script.
- Nexo e Fábrik: funções definidas por suposição (conexão entre agentes e produção em série); ajuste no `AGENTS`.

## Conversar de verdade (servidor local, grátis no seu plano)

1. Instale o Claude Code e entre na sua conta (comando `claude`).
2. Na pasta do repositório: `node escritorio-virtual/servidor/servidor.js`
3. Abra o endereço mostrado (http://127.0.0.1:8787). Já abre conectado.

Cada agente roda como uma sessão do Claude Code (modelo `sonnet`, mude com `AGENT_MODEL`), com a persona e as skills do repositório, acesso ao cofre (`cofre/`), leitura, escrita na pasta do projeto e busca na web. Não há Bash. Nada é publicado ou enviado para fora sem você aprovar na conversa. O servidor escuta só em 127.0.0.1 e exige um token aleatório. Para usar a página publicada, informe endereço e token em "Conectar".
Variáveis: `PORT`, `AGENT_MODEL`, `AGENT_REPO`, `CLAUDE_BIN`.
