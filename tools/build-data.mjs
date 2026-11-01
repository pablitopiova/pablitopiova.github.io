// Uso: node tools/build-data.mjs   (requiere Node 18+)
// Lee data/contributions.json + data/profile.json y genera data.js con miniaturas.
// Miniaturas: YouTube y GitHub directas; resto via og:image (se descarga a assets/thumbs).
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const src = JSON.parse(fs.readFileSync(path.join(root, "data/contributions.json"), "utf8")).contributions;
const profile = JSON.parse(fs.readFileSync(path.join(root, "data/profile.json"), "utf8"));
const thumbDir = path.join(root, "assets/thumbs");
fs.mkdirSync(thumbDir, { recursive: true });

const HIDE_TYPES = new Set(profile.hideTypes || []);
const UA = "Mozilla/5.0 (compatible; Twitterbot/1.0)";
// Imágenes genéricas descartadas: placeholder "Posted on LinkedIn" y favicons
const BAD_SIZES = new Set([34857, 32988]);
const PILLARS = {
  ".NET y herramientas de desarrollo": ".NET & developer tools",
  "Microsoft Foundry y modelos": "Microsoft Foundry & models",
  "Comunidad y liderazgo": "Community & leadership",
  "Power Platform e integracion": "Power Platform & integration",
  "IA en Azure": "AI on Azure",
  "Sin asignar": "Unassigned",
};

const ytId = (u) => u.match(/[?&]v=([\w-]{11})/)?.[1] || u.match(/youtu\.be\/([\w-]{11})/)?.[1];

async function ogImage(url, id) {
  const existing = fs.readdirSync(thumbDir).find((f) => f.startsWith(id + "."));
  if (existing) return "assets/thumbs/" + existing;
  try {
    const res = await fetch(url, { headers: { "user-agent": UA }, signal: AbortSignal.timeout(15000), redirect: "follow" });
    if (!res.ok) return "";
    const html = await res.text();
    const m = html.match(/<meta[^>]+(?:property|name)=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']og:image["']/i);
    if (!m) return "";
    const imgUrl = m[1].replace(/&amp;/g, "&");
    const img = await fetch(imgUrl, { signal: AbortSignal.timeout(15000) });
    if (!img.ok) return "";
    const type = img.headers.get("content-type") || "";
    const ext = type.includes("png") ? "png" : type.includes("webp") ? "webp" : "jpg";
    fs.writeFileSync(path.join(thumbDir, `${id}.${ext}`), Buffer.from(await img.arrayBuffer()));
    return `assets/thumbs/${id}.${ext}`;
  } catch {
    return "";
  }
}

async function thumbFor(c) {
  if (!c.url) return "";
  switch (c.url_kind) {
    case "youtube": { const v = ytId(c.url); return v ? `https://i.ytimg.com/vi/${v}/hqdefault.jpg` : ""; }
    case "github": { const m = c.url.match(/github\.com\/([^/]+\/[^/?#]+)/); return m ? `https://opengraph.githubassets.com/1/${m[1]}` : ""; }
    case "linkedin_profile": return "";
    default: return ogImage(c.url.startsWith("http") ? c.url : "https://" + c.url, c.id);
  }
}

const datesFile = path.join(root, "data/dates.json");
const found = fs.existsSync(datesFile) ? JSON.parse(fs.readFileSync(datesFile, "utf8")) : {};
const portalFile = path.join(root, "data/portal-dates.json");
const portal = fs.existsSync(portalFile) ? JSON.parse(fs.readFileSync(portalFile, "utf8")) : [];
const portalByTitle = new Map();
for (const p of portal) (portalByTitle.get(p.title.trim()) || portalByTitle.set(p.title.trim(), []).get(p.title.trim())).push(p.date);

for (const c of src) {
  let real = c.date_real || found[c.id]?.date;
  if (!real) {
    const cands = portalByTitle.get(c.title.trim());
    if (cands) real = cands.sort((a, b) => Math.abs(new Date(a) - new Date(c.date_loaded)) - Math.abs(new Date(b) - new Date(c.date_loaded)))[0];
  }
  if (real) { c.date_real = real; c.date_best = real; }
}

const visible = src.filter((c) => c.visibility === "public" && !HIDE_TYPES.has(c.type) && !/GDPR Delete/i.test(c.title));
const items = [];
const seen = new Map();
let i = 0;
for (const c of visible) {
  const uid = seen.has(c.id) ? `${c.id}-${seen.get(c.id) + 1}` : c.id;
  seen.set(c.id, (seen.get(c.id) || 0) + 1);
  let thumb = (profile.thumbOverrides || {})[uid] || (await thumbFor(c));
  if (thumb.startsWith("assets/thumbs/") && BAD_SIZES.has(fs.statSync(path.join(root, thumb)).size)) thumb = "";
  let generated = false;
  let rule;
  if (!thumb) {
    rule = (profile.thumbRules || []).find((r) => (!r.match || new RegExp(r.match, "i").test(c.title)) && (!r.type || new RegExp(`^(${r.type})$`).test(c.type)));
    if (rule) { thumb = rule.image; generated = true; }
  }
  rule ||= (profile.thumbRules || []).find((r) => r.description && r.match && new RegExp(r.match, "i").test(c.title));
  items.push({
    id: uid,
    type: c.type,
    date: c.date_best,
    dateApprox: !c.date_real,
    title: c.title,
    area: c.area,
    pillar: PILLARS[c.pillar_draft] || c.pillar_draft,
    role: c.role || "",
    description: (profile.descOverrides || {})[uid] || c.description_portal || rule?.description || "",
    thumbGenerated: generated,
    url: c.url_kind === "linkedin_profile" ? "" : c.url || "",
    source: c.url_kind,
    thumb,
    featured: !!c.featured || (profile.featured || []).includes(c.id),
  });
  if (++i % 25 === 0) console.log(`${i}/${visible.length}`);
}

const out = { ...profile, items };
delete out.hideTypes; delete out.thumbOverrides; delete out.featured; delete out.thumbRules; delete out.descOverrides;
fs.writeFileSync(path.join(root, "data.js"), "// Generado por tools/build-data.mjs. No editar a mano.\nwindow.SITE = " + JSON.stringify(out, null, 1) + ";\n");
console.log(`OK: ${items.length} items, ${items.filter((x) => x.thumb).length} con miniatura`);
