import fs from "node:fs";
import path from "node:path";

const file = path.resolve(import.meta.dirname, "../data/contributions.json");
const db = JSON.parse(fs.readFileSync(file, "utf8"));
const id = "m-nov-ignite-ai-business-article";

if (db.contributions.some((item) => item.id === id)) {
  console.log("Article already present");
  process.exit(0);
}

db.contributions.push({
  id,
  title: "Microsoft Is Going All In on AI: What Ignite 2026 Means for Every Business Leader",
  type: "article",
  portal_type: "Article",
  area: "Microsoft Foundry",
  pillar_draft: "Microsoft Foundry y modelos",
  role: "Author",
  audience: ["Technical Decision Maker", "Developer"],
  date_loaded: "2026-11-21",
  date_real: "2026-11-18",
  date_source: "linkedin_datePublished",
  date_best: "2026-11-18",
  url: "https://www.linkedin.com/pulse/microsoft-going-all-ai-what-ignite-2026-means-every-business-piovano-oyame",
  url_original: "https://www.linkedin.com/pulse/microsoft-going-all-ai-what-ignite-2026-means-every-business-piovano-oyame",
  url_kind: "linkedin_article",
  links: [],
  description_portal: "A business-focused analysis of Microsoft Ignite 2026: Microsoft's AI stack, new MAI models, Foundry model routing and training, continuous improvement, Microsoft IQ, and practical questions for leadership teams planning their AI strategy.",
  high_impact_portal: false,
  featured: false,
  visibility: "public",
  source: "manual_2026-11",
  flags: [],
});

fs.writeFileSync(file, JSON.stringify(db, null, 2));
console.log("Added Microsoft Ignite article");
