// Prueba rápida de og:image en páginas oficiales de eventos
const urls = process.argv.slice(2);
for (const x of urls) {
  try {
    const r = await fetch(x, { headers: { "user-agent": "Mozilla/5.0 (compatible; Twitterbot/1.0)" }, redirect: "follow", signal: AbortSignal.timeout(15000) });
    const h = await r.text();
    const m = h.match(/<meta[^>]+(?:property|name)=["']og:image["'][^>]+content=["']([^"']+)/i) || h.match(/content=["']([^"']+)["'][^>]+property=["']og:image/i);
    console.log(r.status, x, "=>", m?.[1]);
  } catch { console.log("ERR", x); }
}
