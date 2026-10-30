// Publica posts aprovados e vencidos. Chamada pelo pg_cron a cada 5 min.
// Secrets: TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET (SUPABASE_URL e SERVICE_ROLE_KEY já existem).
import { createClient } from "npm:@supabase/supabase-js@2";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const GRAPH = "https://graph.instagram.com/v21.0";
const TIKTOK = "https://open.tiktokapis.com";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function instagram(acc: any, post: any) {
  const p = new URLSearchParams({ media_type: "REELS", video_url: post.media_url, caption: post.caption, access_token: acc.access_token });
  const c = await (await fetch(`${GRAPH}/${acc.account_id}/media`, { method: "POST", body: p })).json();
  if (!c.id) throw new Error("Instagram container: " + JSON.stringify(c));
  for (let i = 0; i < 20; i++) { // até ~100 s
    await sleep(5000);
    const s = await (await fetch(`${GRAPH}/${c.id}?fields=status_code&access_token=${acc.access_token}`)).json();
    if (s.status_code === "FINISHED") break;
    if (s.status_code === "ERROR" || s.status_code === "EXPIRED") throw new Error("Instagram processamento: " + JSON.stringify(s));
    if (i === 19) throw new Error("Instagram: processamento demorou demais");
  }
  const pub = await (await fetch(`${GRAPH}/${acc.account_id}/media_publish`, {
    method: "POST", body: new URLSearchParams({ creation_id: c.id, access_token: acc.access_token }) })).json();
  if (!pub.id) throw new Error("Instagram publish: " + JSON.stringify(pub));
  return { status: "publicado", result: pub };
}

// TikTok: envia o vídeo para o RASCUNHO (caixa de entrada do app). Publicação direta exige auditoria do app.
async function tiktok(acc: any, post: any) {
  const video = new Uint8Array(await (await fetch(post.media_url)).arrayBuffer());
  const size = video.byteLength;
  if (size > 64 * 1024 * 1024) throw new Error("TikTok: vídeo acima de 64 MB (precisa de envio em partes)");
  const init = await (await fetch(`${TIKTOK}/v2/post/publish/inbox/video/init/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${acc.access_token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ source_info: { source: "FILE_UPLOAD", video_size: size, chunk_size: size, total_chunk_count: 1 } }),
  })).json();
  if (!init.data?.upload_url) throw new Error("TikTok init: " + JSON.stringify(init));
  const up = await fetch(init.data.upload_url, {
    method: "PUT",
    headers: { "Content-Type": "video/mp4", "Content-Length": String(size), "Content-Range": `bytes 0-${size - 1}/${size}` },
    body: video,
  });
  if (!up.ok) throw new Error("TikTok upload: " + up.status + " " + (await up.text()));
  return { status: "rascunho_enviado", result: { publish_id: init.data.publish_id } };
}

async function publicarFila() {
  const { data: posts } = await db.from("scheduled_posts").select("*")
    .eq("status", "aprovado").lte("scheduled_at", new Date().toISOString()).order("scheduled_at").limit(3);
  const out: any[] = [];
  for (const post of posts ?? []) {
    // trava anti-duplicidade: só segue quem conseguir mudar de aprovado para publicando
    const { data: lock } = await db.from("scheduled_posts").update({ status: "publicando", attempts: post.attempts + 1 })
      .eq("id", post.id).eq("status", "aprovado").select("id");
    if (!lock?.length) continue;
    try {
      const { data: acc } = await db.from("social_accounts").select("*").eq("brand", post.brand).eq("network", post.network).single();
      if (!acc) throw new Error(`Conta ${post.network} da marca ${post.brand} não cadastrada`);
      const r = post.network === "instagram" ? await instagram(acc, post) : await tiktok(acc, post);
      await db.from("scheduled_posts").update({ status: r.status, result: r.result, error: null }).eq("id", post.id);
      out.push({ id: post.id, ok: true });
    } catch (e) {
      // volta para a fila até 3 tentativas; depois marca erro
      await db.from("scheduled_posts").update({ status: post.attempts + 1 >= 3 ? "erro" : "aprovado", error: String(e) }).eq("id", post.id);
      out.push({ id: post.id, ok: false, error: String(e) });
    }
  }
  return out;
}

async function renovarTokens() {
  const { data: accs } = await db.from("social_accounts").select("*");
  const out: any[] = [];
  for (const a of accs ?? []) {
    try {
      if (a.token_expires_at && new Date(a.token_expires_at).getTime() - Date.now() > 10 * 86400e3) continue;
      if (a.network === "instagram") {
        const r = await (await fetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${a.access_token}`)).json();
        if (!r.access_token) throw new Error(JSON.stringify(r));
        await db.from("social_accounts").update({ access_token: r.access_token, token_expires_at: new Date(Date.now() + r.expires_in * 1000).toISOString() }).eq("id", a.id);
      } else {
        const r = await (await fetch(`${TIKTOK}/v2/oauth/token/`, {
          method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ client_key: Deno.env.get("TIKTOK_CLIENT_KEY")!, client_secret: Deno.env.get("TIKTOK_CLIENT_SECRET")!, grant_type: "refresh_token", refresh_token: a.refresh_token }) })).json();
        if (!r.access_token) throw new Error(JSON.stringify(r));
        await db.from("social_accounts").update({ access_token: r.access_token, refresh_token: r.refresh_token, token_expires_at: new Date(Date.now() + r.expires_in * 1000).toISOString() }).eq("id", a.id);
      }
      out.push({ id: a.id, renovado: true });
    } catch (e) { out.push({ id: a.id, error: String(e) }); }
  }
  return out;
}

Deno.serve(async (req) => {
  const acao = new URL(req.url).searchParams.get("acao");
  const r = acao === "renovar" ? await renovarTokens() : await publicarFila();
  return new Response(JSON.stringify(r), { headers: { "Content-Type": "application/json" } });
});
