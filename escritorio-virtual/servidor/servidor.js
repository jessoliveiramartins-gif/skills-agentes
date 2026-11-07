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
const WORKDIR=path.resolve(process.env.AGENT_WORKDIR||path.join(REPO,'..')); // mesma pasta do chat principal no PC do Marco
const PROJ=path.join(os.homedir(),'.claude','projects');            // memória e conversas anteriores do Claude Code
const PAGE=path.join(__dirname,'..','index.html');
const STATE_FILE=path.join(__dirname,'sessoes.json');
const TOKEN_FILE=path.join(__dirname,'.token');
const TIMEOUT=+process.env.AGENT_TIMEOUT_MS||300000;

let TOKEN;try{TOKEN=fs.readFileSync(TOKEN_FILE,'utf8').trim()}catch(e){}
if(!TOKEN){TOKEN=crypto.randomBytes(18).toString('hex');try{fs.writeFileSync(TOKEN_FILE,TOKEN,{mode:0o600})}catch(e){}}

/* Quem é cada agente. skillDirs = pastas do repo com SKILL.md que ele deve seguir. */
const CS='contexto/skills/';
const AGENTES={
 dendro:{nome:'Dendro',papel:'pesquisa e verificação de fatos (web, concorrentes, tendências, vídeos de referência)',skills:[CS+'dendro-buscador',CS+'dendro-concorrentes',CS+'dendro-olhos']},
 axon:{nome:'Axon',papel:'edição de vídeo, motion graphics, roteiro e copy',skills:[CS+'axon-editor-de-video',CS+'axon-reel',CS+'axon-produtor',CS+'axon-remodelar-link',CS+'axon-imagens',CS+'axon-desempenho',CS+'voz-da-marca']},
 sinapse:{nome:'Sinapse',papel:'social media: calendário, Metricool, métricas e comunidade',skills:[CS+'sinapse-social-media',CS+'voz-da-marca']},
 mielina:{nome:'Mielina',papel:'tráfego pago (Meta, TikTok, Google Ads): orçamento, CPA, ROAS, criativos',skills:[CS+'mielina-trafego-pago']},
 cortex:{nome:'Córtex',papel:'sites e plataformas web (briefing até prévia testada)',skills:[CS+'cortex-criador-de-sites']},
 nexo:{nome:'Nexo',papel:'subagente da Fábrica de Infoprodutos (https://claude.ai/artifact/96xbnr8SoUFHzStgYeft3H): cria infoprodutos com IA da ideia à página de venda, na linha Autorizar, Modelo, Avatar, Referências, Oferta, Sumário (espera aprovação), Amostra (espera aprovação), Conteúdo, Página de venda, Marketing e Revisão',skills:[CS+'voz-da-marca',CS+'empresa-dos-agentes',CS+'base-de-conhecimento',CS+'axon-imagens']},
 fabrik:{nome:'Fábrik',papel:'subagente de produção em série: lotes, séries em partes e vídeos para canais dark',skills:[CS+'fabrica-canais-dark',CS+'axon-produtor']}
};
/* Funcionários novos: arquivos equipe/<id>.json criados pelo Escritório. */
const EQUIPE_DIR=path.join(__dirname,'..','..','equipe');
function lerEquipe(){
  const out={};try{for(const f of fs.readdirSync(EQUIPE_DIR)){if(!f.endsWith('.json'))continue;try{const d=JSON.parse(fs.readFileSync(path.join(EQUIPE_DIR,f),'utf8'));if(d&&d.id)out[d.id]=d}catch(e){}}}catch(e){}
  return out;
}
function def(id,custom){
  if(AGENTES[id])return AGENTES[id];
  const e=lerEquipe()[id]||custom;if(!e||!e.name)return null;
  return{nome:String(e.name).slice(0,40),papel:String(e.role||'funcionário').slice(0,120)+(e.does?' ('+String(e.does).slice(0,600)+')':''),skills:[]};
}
const equipeNomes=()=>Object.values(AGENTES).map(a=>a.nome).concat(Object.values(lerEquipe()).map(e=>e.name)).join(', ');

function lerArq(rel,max){try{return fs.readFileSync(path.join(REPO,rel),'utf8').slice(0,max)}catch(e){return ''}}
function persona(id,custom){
  const a=def(id,custom);
  const ctx=lerArq('contexto/CONTEXTO.md',6000),mem=lerArq('contexto/memoria/MEMORY.md',6500);
  const principal=a.skills.length?lerArq(a.skills[0]+'/SKILL.md',6000):'';
  const outras=a.skills.slice(1).map(x=>'- '+path.join(REPO,x,'SKILL.md')).join('\n');
  return `Você é ${a.nome}, funcionário da equipe do Marco (colegas: ${equipeNomes()}), especialidade: ${a.papel}. Você conversa com o Marco pelo painel "Escritório dos Agentes" e é a RÉPLICA do agente dele no chat do projeto "Visão geral": mesma memória, mesmas skills, mesmas regras. Aja como se ele estivesse falando lá: entenda o pedido e execute de verdade com as ferramentas que você tem (ler e escrever arquivos na pasta do projeto, pesquisar na web), registrando resultados no cofre.
Fale sempre em português, trate o Marco pelo nome, respostas curtas e objetivas, sem emojis. Se algo exigir ação que você não consegue fazer aqui (por exemplo postar, agendar, gastar verba ou rodar programas), diga o plano pronto e o que falta liberar. Nunca diga que fez algo que não fez. Aprovação: nada vai para fora (publicar, agendar, enviar, gastar, apagar) sem o Marco aprovar na conversa.

=== CONTEXTO DA EMPRESA ===
${ctx}

=== MEMÓRIA (índice do projeto Visão geral; abra os arquivos de ${path.join(REPO,'contexto','memoria')} quando precisar do detalhe) ===
${mem}
${principal?`\n=== SUA SKILL PRINCIPAL (${a.skills[0]}) ===\n${principal}\n`:''}${outras?`\nOutras skills suas (leia quando precisar):\n${outras}\n`:''}
Antes de responder sobre histórico, canais, séries, lotes, marcas ou o que já foi feito, leia os arquivos certos: ${path.join(REPO,'cofre')} e ${path.join(REPO,'contexto')} (mapa de artefatos em ${path.join(REPO,'contexto','mapa-de-artefatos.md')}).
Histórico geral: para perguntas sobre o que já foi feito, pesquise também a memória (.md) e as conversas anteriores (.jsonl) em ${PROJ} com Grep; só leia, nunca altere nem apague.
O que não estiver em nenhum desses lugares, diga que não encontrou e peça o dado; nunca invente.`;
}

let sessoes={};try{sessoes=JSON.parse(fs.readFileSync(STATE_FILE,'utf8'))}catch(e){}
const salvar=()=>{try{fs.writeFileSync(STATE_FILE,JSON.stringify(sessoes))}catch(e){}};
const ocupados={};   // id -> {tarefa, inicio}
const filas={};      // uma conversa por agente por vez

function rodarClaude(id,mensagem,contexto,custom,retomar=true){
  return new Promise((resolve,reject)=>{
    const sid=retomar?sessoes[id]:null;
    const args=['-p',mensagem,'--output-format','json','--model',MODEL,'--permission-mode','acceptEdits',
      '--allowedTools','Read','Grep','Glob','Write','Edit','WebSearch','WebFetch',...(process.env.AGENT_BASH==='1'?['Bash']:[]),
      '--append-system-prompt',persona(id,custom)+(contexto?`\n\nContexto atual do painel: ${contexto}`:'')];
    if(sid)args.push('--resume',sid);
    args.push('--add-dir',REPO);if(fs.existsSync(PROJ))args.push('--add-dir',PROJ);
    if(!CLAUDE)return reject(new Error('Claude Code não encontrado neste computador. Rode o arquivo "Instalar Claude Code" ou defina CLAUDE_BIN.'));
    const cmd=/\.(cmd|bat)$/i.test(CLAUDE);
    const p=spawn(CLAUDE,args,{cwd:fs.existsSync(WORKDIR)?WORKDIR:REPO,stdio:['ignore','pipe','pipe'],env:process.env,shell:cmd,windowsHide:true});
    let out='',err='';const to=setTimeout(()=>{p.kill('SIGTERM');reject(new Error('Tempo esgotado (5 min).'))},TIMEOUT);
    p.stdout.on('data',d=>out+=d);p.stderr.on('data',d=>err+=d);
    p.on('error',e=>{clearTimeout(to);reject(new Error('Não consegui iniciar o Claude Code ('+CLAUDE+'): '+e.message))});
    p.on('close',()=>{
      clearTimeout(to);
      // conversa antiga não encontrada (ex.: mudou a pasta de trabalho): começa uma nova e tenta de novo
      if(sid&&/no conversation found|session.*not found/i.test(err+out)){delete sessoes[id];salvar();return resolve(rodarClaude(id,mensagem,contexto,custom,false))}
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
  res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE,OPTIONS');
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
  if(url.pathname==='/equipe'&&req.method==='GET')return json(res,200,{equipe:Object.values(lerEquipe())});
  if(url.pathname==='/equipe'&&req.method==='POST'){
    let body='';req.on('data',d=>{body+=d;if(body.length>2e5)req.destroy()});
    req.on('end',()=>{
      try{const e=JSON.parse(body);const id=String(e.id||'').toLowerCase().replace(/[^a-z0-9-]/g,'').slice(0,30);
        if(!id||!e.name||AGENTES[id])return json(res,400,{error:'id ou nome inválidos'});
        fs.mkdirSync(EQUIPE_DIR,{recursive:true});e.id=id;fs.writeFileSync(path.join(EQUIPE_DIR,id+'.json'),JSON.stringify(e,null,1));json(res,200,{ok:true,id});
      }catch(err){json(res,400,{error:'JSON inválido'})}
    });return;
  }
  if(url.pathname.startsWith('/equipe/')&&req.method==='DELETE'){
    const id=url.pathname.slice(8).replace(/[^a-z0-9-]/g,'');if(AGENTES[id])return json(res,400,{error:'agente fixo'});
    try{fs.unlinkSync(path.join(EQUIPE_DIR,id+'.json'));delete sessoes[id];salvar();json(res,200,{ok:true})}catch(e){json(res,404,{error:'não encontrado'})}return;
  }
  if(req.method==='POST'&&url.pathname==='/chat'){
    let body='';req.on('data',d=>{body+=d;if(body.length>2e5)req.destroy()});
    req.on('end',async()=>{
      let j;try{j=JSON.parse(body)}catch(e){return json(res,400,{error:'JSON inválido'})}
      const id=String(j.agent||'');const msg=String(j.message||'').trim();
      if(!def(id,j.custom)||!msg)return json(res,400,{error:'agente ou mensagem inválidos'});
      const ctx=j.context?`${j.context.role||''}; tarefa atual: ${j.context.task||''}`:'';
      const vez=(filas[id]||Promise.resolve()).catch(()=>{}).then(async()=>{
        ocupados[id]={tarefa:'Pedido do Marco: '+msg.slice(0,80),inicio:Date.now()};
        try{return await rodarClaude(id,msg,ctx,j.custom)}finally{delete ocupados[id]}
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
