import fs from "node:fs";
import path from "node:path";
const jf = path.resolve(import.meta.dirname, "../data/contributions.json");
const db = JSON.parse(fs.readFileSync(jf, "utf8"));
const F = "Microsoft Foundry y modelos", D = ".NET y herramientas de desarrollo", C = "Comunidad y liderazgo";
const kind = (u) => /youtube\.com|youtu\.be/.test(u) ? "youtube" : /github\.com/.test(u) ? "github" : /linkedin\.com\/pulse/.test(u) ? "linkedin_article" : /linkedin\.com/.test(u) ? "linkedin_post" : /meetup\.com/.test(u) ? "meetup" : "other";
const li = (n) => `https://www.linkedin.com/feed/update/urn:li:activity:${n}/`;

const rows = [
  { id: "oct-reactor-net-foundry-1", date: "2026-10-15", type: "video", portal: "Webinar/Livestream", area: ".NET", pillar: F, role: "Contributor",
    title: "Live demos with .NET and Microsoft Foundry: .NET + Foundry, Better Together, Episode 1 (Microsoft Reactor)",
    url: "https://developer.microsoft.com/en-us/reactor/events/27630/",
    desc: "Microsoft Reactor livestream with Bruno Capuano (Microsoft), episode 1 of the .NET + Foundry, Better Together series: decision models in C#, a Microsoft Foundry overview, demos and orchestration with Agent Framework. 6,664 views on the .NET YouTube channel." },
  { id: "oct-docker-summit-article", date: "2026-10-04", type: "article", portal: "Article", area: "Developer Tools", pillar: D, role: "Author",
    title: "From Models to Agents: Notes from My First Docker Captain Summit",
    url: "https://www.linkedin.com/pulse/from-models-agents-notes-my-first-docker-captain-summit-pablo-piovano-rupze/",
    desc: "LinkedIn article on Docker Model Runner, MCP Gateway, Docker Sandboxes, production criteria for agents, and the Docker + Microsoft AI path. The companion post reached 2,316 impressions and 60 reactions." },
  { id: "oct-github-universe", date: "2026-10-28", type: "blog", portal: "Blog", area: "Developer Tools", pillar: D, role: "Author",
    title: "GitHub Universe: the unit of work is no longer the prompt",
    url: li("7521292678353944576"),
    desc: "Takeaways from GitHub Universe: agent sessions, Copilot Fusion and the Copilot harness in Microsoft Foundry. 1,388 impressions." },
  { id: "oct-foundry-series", date: "2026-10-27", type: "blog", portal: "Blog", area: "Microsoft Foundry", pillar: F, role: "Author",
    title: "Technical Content Series on Microsoft Foundry and AI Models, October 2026",
    url: li("7516857481319596032"),
    desc: "Four LinkedIn posts on Microsoft Foundry and AI models, including Microsoft MAI-Base-2 pre-training and GPT-6.1 Terra reaching general availability in Foundry. 1,799 organic impressions." },
  { id: "oct-oz-agent-memory", date: "2026-10-16", type: "blog", portal: "Blog", area: ".NET", pillar: D, role: "Author",
    title: "OZ AI Center of Excellence session with José Luis Latorre: Agent Memory for .NET",
    url: li("7516952248438902785"),
    desc: "Session with José Luis Latorre on persistent memory for AI agents in .NET. 1,144 impressions and 26 reactions." },
  { id: "oct-global-ai-sarasota-launch", date: "2026-10-20", type: "community", portal: "Blog", area: "Community", pillar: C, role: "Organizer",
    title: "Launching Global AI Sarasota",
    url: li("7518160172423393282"),
    desc: "Announcement of the Global AI Sarasota chapter, launched with Nicolas Nakasone. 925 impressions and 35 reactions." },
  { id: "oct-three-memories", date: "2026-10-09", type: "code", portal: "Open Source/Project/Sample code/Tools", area: ".NET", pillar: F, role: "Author",
    title: "three-memories-one-question: file, vector and graph memory for AI agents",
    url: "https://github.com/ppiova/three-memories-one-question",
    desc: "One history, three kinds of agent memory (file, vector, graph) answering the same questions. Runs with a single Docker command and no API keys. Companion to the Agent Memory for .NET session." },
  { id: "oct-foundry-field-notes", date: "2026-10-15", type: "code", portal: "Open Source/Project/Sample code/Tools", area: ".NET", pillar: F, role: "Author",
    title: "foundry-field-notes-labs: hands-on Microsoft Foundry labs in .NET",
    url: "https://github.com/ppiova/foundry-field-notes-labs",
    desc: "Hands-on Microsoft Foundry labs in .NET with reproducible offline paths, validated model outputs and human review. Supports the .NET + Foundry series." },
  { id: "oct-nb-secrets", date: "2026-10-15", type: "community", portal: "User Group Owner", area: ".NET", pillar: C, role: "Organizer",
    title: ".NET Baires: Cómo gestionar tus secretos en forma decentralizada con .NET",
    url: "https://www.meetup.com/net-baires/events/316962153/",
    desc: "Online session with Facundo La Rocca on managing secrets in a decentralized way with .NET, organized by .NET Baires." },
  { id: "oct-youtube-net-foundry-1", date: "2026-10-15", type: "video", portal: "Webinar/Livestream", area: ".NET", pillar: F, role: "Contributor",
    title: ".NET + Foundry, Better Together, Episode 1: livestream on the .NET YouTube channel",
    url: "https://www.youtube.com/live/mHrs-JHdPaY",
    desc: "Episode 1 of the .NET + Foundry, Better Together series, streamed live on the official .NET YouTube channel with Bruno Capuano (Microsoft): decision models, a Microsoft Foundry overview, the Hello Decisions demo, an Aspire app and orchestration with Agent Framework. 6,664 views." },
  { id: "oct-nb-agent-memory", date: "2026-10-22", type: "community", portal: "User Group Owner", area: ".NET", pillar: C, role: "Organizer",
    title: ".NET Baires: Agent Memory for .NET, persistent memory for AI agents",
    url: "https://www.meetup.com/net-baires/events/317052271/",
    desc: "Online session with José Luis Latorre, live on YouTube: 18 RSVPs and about 30 people live, with 343 views of the recording." },
];

let added = 0;
for (const r of rows) {
  const id = "m-" + r.id;
  if (db.contributions.some((c) => c.id === id)) continue;
  db.contributions.push({
    id, title: r.title, type: r.type, portal_type: r.portal, area: r.area, pillar_draft: r.pillar, role: r.role,
    audience: ["Developer"], date_loaded: "2026-11-01", date_real: r.date, date_end: null, date_source: "monthly_csv", date_best: r.date,
    url: r.url, url_original: r.url, url_kind: kind(r.url), links: [], description_portal: r.desc,
    high_impact_portal: false, featured: false, visibility: "public", source: "manual_2026-10", flags: [],
  });
  added++;
}
fs.writeFileSync(jf, JSON.stringify(db, null, 2));
console.log("added", added);
