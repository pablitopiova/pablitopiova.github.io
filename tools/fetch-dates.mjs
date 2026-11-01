// Uso: node tools/fetch-dates.mjs
// Busca la fecha real de publicación de las contribuciones sin date_real y la guarda
// en data/dates.json ({ id: { date, source } }). Se puede editar a mano; build-data.mjs lo aplica.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const src = JSON.parse(fs.readFileSync(path.join(root, "data/contributions.json"), "utf8")).contributions;
const outFile = path.join(root, "data/dates.json");
const dates = fs.existsSync(outFile) ? JSON.parse(fs.readFileSync(outFile, "utf8")) : {};
const UA = { "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36", "accept-language": "en-US,en;q=0.9" };

const get = async (url, headers = UA) => {
  const r = await fetch(url, { headers, signal: AbortSignal.timeout(20000), redirect: "follow" });
  return r.ok ? r.text() : "";
};
const iso = (s) => (s && /^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(0, 10) : null);
const meta = (html, re) => html.match(re)?.[1];

const resolvers = {
  async youtube(c) {
    const html = await get(c.url_original || "https://" + c.url);
    return iso(meta(html, /itemprop="datePublished"\s+content="([^"]+)"/) || meta(html, /"publishDate":"([^"]+)"/) || meta(html, /"uploadDate":"([^"]+)"/));
  },
  async devto(c) {
    const m = c.url.match(/dev\.to\/([^/]+)\/([^/?#]+)/);
    if (!m) return null;
    const j = await get(`https://dev.to/api/articles/${m[1]}/${m[2]}`, { "user-agent": UA["user-agent"] });
    return j ? iso(JSON.parse(j).published_at) : null;
  },
  async github(c) {
    const m = c.url.match(/github\.com\/([^/]+\/[^/?#]+)/);
    if (!m) return null;
    const j = await get(`https://api.github.com/repos/${m[1]}`, { "user-agent": "dates", accept: "application/vnd.github+json" });
    return j ? iso(JSON.parse(j).created_at) : null;
  },
  async linkedin_article(c) {
    const html = await get(c.url_original || "https://" + c.url);
    return iso(meta(html, /"datePublished"\s*:\s*"([^"]+)"/) || meta(html, /article:published_time"\s+content="([^"]+)"/));
  },
  async meetup(c) {
    const html = await get(c.url_original || "https://" + c.url);
    return iso(meta(html, /"startDate"\s*:\s*"([^"]+)"/));
  },
  async linkedin_event(c) {
    const html = await get(c.url_original || "https://" + c.url);
    return iso(meta(html, /"startDate"\s*:\s*"([^"]+)"/));
  },
};

// Los IDs de LinkedIn (activity/share/ugcPost) codifican el timestamp en los bits altos.
function linkedinIdDate(url) {
  const m = url.match(/(?:activity|share|ugcPost)[-:](\d{18,19})/);
  if (!m) return null;
  return new Date(Number(BigInt(m[1]) >> 22n)).toISOString().slice(0, 10);
}

const todo = src.filter((c) => !c.date_real && c.url && !dates[c.id]);
let found = 0, n = 0;
for (const c of todo) {
  let date = linkedinIdDate(c.url);
  let source = date ? "linkedin_id" : null;
  if (!date && resolvers[c.url_kind]) {
    try { date = await resolvers[c.url_kind](c); source = c.url_kind; } catch {}
  }
  if (date) { dates[c.id] = { date, source }; found++; }
  if (++n % 20 === 0) { console.log(`${n}/${todo.length} (${found} fechas)`); fs.writeFileSync(outFile, JSON.stringify(dates, null, 1)); }
}
fs.writeFileSync(outFile, JSON.stringify(dates, null, 1));
console.log(`Listo: ${found}/${todo.length} fechas nuevas. Total en dates.json: ${Object.keys(dates).length}`);
