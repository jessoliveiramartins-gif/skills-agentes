#!/usr/bin/env node
/* Servidor local do Escritório dos Agentes.
   Liga a página ao Claude Code instalado no seu computador (usa o seu plano, sem API paga).
   Uso:  node servidor/servidor.js            (depois abra o endereço mostrado)
   Sem dependências. Escuta só em 127.0.0.1 e exige um token aleatório. */
'use strict';
const http=require('http'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const {spawn}=require('child_process');

const PORT=+process.env.PORT||8787;
const os=require('os');
/* Acha o Claude Code sozinho: variável CLAUDE_BIN, PATH e pastas comuns (Windows, Mac, Linux). */
function acharClaude(){
  if(process.env.CLAUDE_BIN)return process.env.CLAUDE_BIN;
  const win=process.platform==='win32',home=os.homedir(),ex=win?['.exe','.cmd','']:[''];
  const cands=[];
  (process.env.PATH||'').split(path.delimiter).filter(Boolean).forEach(d=>ex.forEach(e=>cands.push(path.join(d,'claude'+e))));
  const add=(...a)=>cands.push(path.join(...a));
  if(win){
    const ap=process.env.APPDATA||path.join(home,'AppData','Roaming'),la=process.env.LOCALAPPDATA||path.join(home,'AppData','Local');
    add(home,'.local','bin','claude.exe');add(home,'.claude','local','claude.exe');add(ap,'npm','claude.cmd');
    add(la,'Programs','claude','claude.exe');add(la,'AnthropicClaude','claude.exe');
    for(const base of [path.join(ap,'Claude','claude-code'),path.join(la,'Claude','claude-code'),path.join(ap,'Claude','claude-code-vm')]){
      try{for(const v of fs.readdirSync(base).sort().reverse())cands.push(path.join(base,v,'claude.exe'))}catch(e){}}
  }else{add(home,'.local','bin','claude');add(home,'.claude','local','claude');cands.push('/usr/local/bin/claude','/opt/homebrew/bin/claude')}
  for(const c of cands){try{if(fs.statSync(c).isFile())return c}catch(e){}}
  return null;
}
const CLAUDE=acharClaude();
const MODEL=process.env.AGENT_MODEL||'sonnet';               // economia: sonnet por padrão
const REPO=path.resolve(process.env.AGENT_REPO||path.join(__dirname,'..','..')); // pasta de trabalho dos agentes (skills + cofre)
const PAGE=path.join(__dirname,'..','index.html');
const STATE_FILE=path.join(__dirname,'sessoes.json');
const TOKEN_FILE=path.join(__dirname,'.token');
const TIMEOUT=+process.env.AGENT_TIMEOUT_MS||300000;

let TOKEN;try{TOKEN=fs.readFileSync(TOKEN_FILE,'utf8').trim()}catch(e){}
if(!TOKEN){TOKEN=crypto.randomBytes(18).toString('hex');try{fs.writeFileSync(TOKEN_FILE,TOKEN,{mode:0o600})}catch(e){}}

/* Quem é cada agente. skillDirs = pastas do repo com SKILL.md que ele deve seguir. */
const AGENTES={
 dendro:{nome:'Dendro',papel:'pesquisa e verificação de fatos (web, concorrentes, tendências, vídeos de referência)',skills:['dendro']},
 axon:{nome:'Axon',papel:'edição de vídeo, motion graphics, roteiro e copy',skills:['axon/axon-editor-de-video','axon/axon-cortes','axon/axon-remodelar-link','axon/axon-imagens','axon/axon-desempenho','voz-da-marca']},
 sinapse:{nome:'Sinapse',papel:'social media: calendário, Metricool, métricas e comunidade',skills:['sinapse','voz-da-marca']},
 mielina:{nome:'Mielina',papel:'tráfego pago (Meta, TikTok, Google Ads): orçamento, CPA, ROAS, criativos',skills:['mielina']},
 cortex:{nome:'Córtex',papel:'sites e plataformas web (briefing até prévia testada)',skills:[]},
 nexo:{nome:'Nexo',papel:'subagente de conexão: passa o bastão entre agentes, mantém o cofre (memória comum) e roteia pedidos',skills:['ciclos-dos-agentes','base-de-conhecimento']},
 fabrik:{nome:'Fábrik',papel:'subagente de produção em série: lotes, séries em partes e vídeos para canais dark',skills:['axon/axon-editor-de-video']}
};
const EQUIPE=Object.values(AGENTES).map(a=>a.nome).join(', ');

function lerSkill(dir){
  try{const t=fs.readFileSync(path.join(REPO,dir,'SKILL.md'),'utf8');return `\n\n### Skill: ${dir}\n${t.slice(0,5000)}`}catch(e){return ''}
}
function persona(id){
  const a=AGENTES[id];
  return `Você é ${a.nome}, agente de ${a.papel}, da equipe do Marco (equipe: ${EQUIPE}). Você está conversando com o Marco pelo painel "Escritório dos Agentes".
Regras: fale sempre em português, trate o Marco pelo nome, respostas curtas e objetivas (no máximo alguns parágrafos curtos), sem emojis.
Você trabalha dentro da pasta do projeto, onde estão as skills e o cofre de conhecimento (pasta cofre/) com marcas, pesquisas, decisões e resultados: consulte o necessário antes de responder e registre no cofre o que for decidido ou entregue.
Use apenas ferramentas gratuitas. Nunca publique, poste, agende, gaste verba nem envie nada para fora sem o Marco aprovar explicitamente na conversa. Se o pedido for da especialidade de outro agente, diga qual e prepare o contexto do pedido para ele.
Ao terminar uma tarefa, diga em uma frase o que foi feito e onde ficou o resultado.`+a.skills.map(lerSkill).join('');
}

let sessoes={};try{sessoes=JSON.parse(fs.readFileSync(STATE_FILE,'utf8'))}catch(e){}
const salvar=()=>{try{fs.writeFileSync(STATE_FILE,JSON.stringify(sessoes))}catch(e){}};
const ocupados={};   // id -> {tarefa, inicio}
const filas={};      // uma conversa por agente por vez

function rodarClaude(id,mensagem,contexto){
  return new Promise((resolve,reject)=>{
    const sid=sessoes[id];
    const args=['-p',mensagem,'--output-format','json','--model',MODEL,'--permission-mode','acceptEdits',
      '--allowedTools','Read','Grep','Glob','Write','Edit','WebSearch','WebFetch',
      '--append-system-prompt',persona(id)+(contexto?`\n\nContexto atual do painel: ${contexto}`:'')];
    if(sid)args.push('--resume',sid);
    if(!CLAUDE)return reject(new Error('Claude Code não encontrado neste computador. Rode o arquivo "Instalar Claude Code" ou defina CLAUDE_BIN.'));
    const cmd=/\.(cmd|bat)$/i.test(CLAUDE);
    const p=spawn(CLAUDE,args,{cwd:REPO,stdio:['ignore','pipe','pipe'],env:process.env,shell:cmd,windowsHide:true});
    let out='',err='';const to=setTimeout(()=>{p.kill('SIGTERM');reject(new Error('Tempo esgotado (5 min).'))},TIMEOUT);
    p.stdout.on('data',d=>out+=d);p.stderr.on('data',d=>err+=d);
    p.on('error',e=>{clearTimeout(to);reject(new Error('Não consegui iniciar o Claude Code ('+CLAUDE+'): '+e.message))});
    p.on('close',()=>{
      clearTimeout(to);
      if(!out.trim()&&/login|auth|credential|sign in/i.test(err))return reject(new Error('O Claude Code ainda não está com login. Abra o PowerShell, digite claude e entre na sua conta.'));
      try{const j=JSON.parse(out);if(j.session_id){sessoes[id]=j.session_id;salvar()}
        if(j.is_error){const r=String(j.result||'Erro no Claude Code');return reject(new Error(/login|auth|credential|sign in/i.test(r)?'O Claude Code ainda não está com login. Abra o PowerShell, digite claude e entre na sua conta. ('+r.slice(0,120)+')':r))}
        resolve(String(j.result||'').trim()||'(sem resposta)');
      }catch(e){reject(new Error((err||out||'Resposta inválida do Claude Code').toString().slice(0,300)))}
    });
  });
}

function cors(req,res){
  res.setHeader('Access-Control-Allow-Origin',req.headers.origin||'*');
  res.setHeader('Vary','Origin');
  res.setHeader('Access-Control-Allow-Headers','content-type,x-token');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Private-Network','true');
}
const json=(res,code,obj)=>{res.writeHead(code,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(obj))};
const okToken=req=>{const t=String(req.headers['x-token']||'');return t.length===TOKEN.length&&crypto.timingSafeEqual(Buffer.from(t),Buffer.from(TOKEN))};

http.createServer((req,res)=>{
  cors(req,res);
  if(req.method==='OPTIONS'){res.writeHead(204);return res.end()}
  const url=new URL(req.url,'http://x');
  if(req.method==='GET'&&(url.pathname==='/'||url.pathname==='/index.html')){
    try{
      const html=fs.readFileSync(PAGE,'utf8').replace('/*SERVER*/null',JSON.stringify({url:`http://127.0.0.1:${PORT}`,token:TOKEN}));
      res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});return res.end(html);
    }catch(e){return json(res,500,{error:'index.html não encontrado'})}
  }
  if(!okToken(req))return json(res,401,{error:'token inválido'});
  if(req.method==='GET'&&url.pathname==='/diag')return json(res,200,{claude:CLAUDE,modelo:MODEL,pasta:REPO,plataforma:process.platform});
  if(req.method==='GET'&&url.pathname==='/state'){
    const o={};for(const k in ocupados)o[k]={tarefa:ocupados[k].tarefa,desde:ocupados[k].inicio};
    return json(res,200,{ocupados:o,modelo:MODEL,pasta:REPO});
  }
  if(req.method==='POST'&&url.pathname==='/chat'){
    let body='';req.on('data',d=>{body+=d;if(body.length>2e5)req.destroy()});
    req.on('end',async()=>{
      let j;try{j=JSON.parse(body)}catch(e){return json(res,400,{error:'JSON inválido'})}
      const id=String(j.agent||'');const msg=String(j.message||'').trim();
      if(!AGENTES[id]||!msg)return json(res,400,{error:'agente ou mensagem inválidos'});
      const ctx=j.context?`${j.context.role||''}; tarefa atual: ${j.context.task||''}`:'';
      const vez=(filas[id]||Promise.resolve()).catch(()=>{}).then(async()=>{
        ocupados[id]={tarefa:'Pedido do Marco: '+msg.slice(0,80),inicio:Date.now()};
        try{return await rodarClaude(id,msg,ctx)}finally{delete ocupados[id]}
      });
      filas[id]=vez;
      try{json(res,200,{reply:await vez})}catch(e){json(res,502,{error:e.message})}
    });
    return;
  }
  json(res,404,{error:'não encontrado'});
}).listen(PORT,'127.0.0.1',()=>{
  console.log(`\nEscritório dos Agentes ligado.\n  Abra: http://127.0.0.1:${PORT}\n  Claude Code: ${CLAUDE||'NAO ENCONTRADO'}\n  Pasta de trabalho dos agentes: ${REPO}\n  Modelo: ${MODEL}\n  Token (para usar a página publicada): ${TOKEN}\n`);
});
