import fs from "node:fs";
import path from "node:path";

const file = path.resolve(import.meta.dirname, "../data/contributions.json");
const db = JSON.parse(fs.readFileSync(file, "utf8"));
const id = "m-nov-agent-memory-article";
if (!db.contributions.some((c) => c.id === id)) {
  db.contributions.push({
    id,
    title: "Your agent doesn't forget with an error. It forgets with a tidy answer.",
    type: "article",
    portal_type: "Article",
    area: ".NET",
    pillar_draft: ".NET y herramientas de desarrollo",
    role: "Author",
    audience: ["Developer"],
    date_loaded: "2026-11-05",
    date_real: "2026-11-03",
    date_source: "linkedin_datePublished",
    date_best: "2026-11-03",
    url: "https://www.linkedin.com/pulse/your-agent-doesnt-forget-error-forgets-tidy-answer-pablo-piovano-ihwwe",
    url_original: "https://lnkd.in/p/eTG4Drz7",
    url_kind: "linkedin_article",
    links: [],
    description_portal: "A reproducible experiment comparing file, vector and graph memory for AI agents using AgentMemory for .NET, Neo4j and Docker. All three stored relevant facts but failed to connect them when planning a go-live. The article explores silent retrieval failures, inspecting stored facts and testing what actually reaches the prompt. Runs locally with one Docker Compose command and no API keys.",
    high_impact_portal: false,
    featured: false,
    visibility: "public",
    source: "manual_2026-11",
    flags: [],
  });
  fs.writeFileSync(file, JSON.stringify(db, null, 2));
  console.log("Added article");
} else {
  console.log("Article already present");
}
