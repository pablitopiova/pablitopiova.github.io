// Uso: node tools/import-month.mjs <archivo.csv>
// Agrega al data/contributions.json las filas del CSV mensual que no estén SALTEADA.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const file = process.argv[2];
if (!file) throw new Error("Falta el CSV");

function parseCsv(t) {
  const rows = []; let row = [], f = "", q = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) { if (c === '"') { if (t[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ",") { row.push(f); f = ""; }
    else if (c === "\n") { row.push(f.replace(/\r$/, "")); rows.push(row); row = []; f = ""; }
    else f += c;
  }
  if (f || row.length) { row.push(f); rows.push(row); }
  const [h, ...r] = rows;
  return r.filter((x) => x.length > 1).map((x) => Object.fromEntries(h.map((k, i) => [k, x[i] ?? ""])));
}

const TYPE = { "Blog (serie)": "blog", Article: "article", "Open Source/Project/Sample code/Tools": "code", "User Group Owner": "community" };
const PILLAR = { "Microsoft Foundry": "Microsoft Foundry y modelos", ".NET": ".NET y herramientas de desarrollo" };
const kind = (u) => /youtube\.com|youtu\.be/.test(u) ? "youtube" : /github\.com/.test(u) ? "github" : /linkedin\.com\/pulse/.test(u) ? "linkedin_article" : /linkedin\.com/.test(u) ? "linkedin_post" : /meetup\.com/.test(u) ? "meetup" : "other";

const jf = path.join(root, "data/contributions.json");
const db = JSON.parse(fs.readFileSync(jf, "utf8"));
const rows = parseCsv(fs.readFileSync(file, "utf8")).filter((r) => r.estado !== "SALTEADA");
let added = 0;
for (const r of rows) {
  const id = "m-" + r.id.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  if (db.contributions.some((c) => c.id === id)) continue;
  const date = r.fecha.slice(0, 10);
  const end = r.fecha.includes(" a ") ? r.fecha.split(" a ")[1].trim() : null;
  const isSite = r.estado === "SOLO_SITIO";
  db.contributions.push({
    id,
    title: r.titulo,
    type: isSite ? "blog" : TYPE[r.tipo_portal] || "other",
    portal_type: r.tipo_portal || "LinkedIn post",
    area: r.primary || ".NET",
    pillar_draft: isSite ? "Comunidad y liderazgo" : PILLAR[r.primary] || "Sin asignar",
    role: r.tipo_portal === "User Group Owner" ? "Organizer" : "Author",
    audience: ["Developer"],
    date_loaded: "2026-11-01",
    date_real: date,
    date_end: end,
    date_source: "monthly_csv",
    date_best: date,
    url: r.url,
    url_original: r.url,
    url_kind: kind(r.url),
    links: [],
    description_portal: r.descripcion_publica || "",
    high_impact_portal: false,
    featured: false,
    visibility: "public",
    source: "monthly_csv_" + path.basename(file),
    flags: [],
  });
  added++;
}
fs.writeFileSync(jf, JSON.stringify(db, null, 2));
console.log(`Agregadas ${added} de ${rows.length}`);
