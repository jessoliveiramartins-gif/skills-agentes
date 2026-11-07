# Escritório dos Agentes

Página única e autônoma (`index.html`, sem dependências, sem custo) com um escritório isométrico onde os 5 agentes gerais (Dendro, Axon, Sinapse, Mielina, Córtex) e os 2 subagentes (Nexo, Fábrik) trabalham em computadores animados. Clique em um personagem (ou na lista) para ver função, status, tarefa atual e conversar.

- Abrir: dê dois cliques em `index.html`.
- Controles: arrastar para mover, roda do mouse ou pinça para ampliar, Esc fecha o chat.
- Conversas ficam no `localStorage` do navegador.
- Respostas simuladas por padrão. Para ligar a um backend: botão "Conectar" (ou edite `AgentAPI.send`). O backend recebe `POST {agent, message, history, context}` e responde `{reply}`.
- Para mudar funções, tarefas, aparência ou salas, edite o array `AGENTS` e o objeto `ROOMS` no início do script.
- Nexo e Fábrik: funções definidas por suposição (conexão entre agentes e produção em série); ajuste no `AGENTS`.
