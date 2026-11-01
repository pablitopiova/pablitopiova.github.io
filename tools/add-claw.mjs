import fs from "node:fs";
import path from "node:path";
const jf = path.resolve(import.meta.dirname, "../data/contributions.json");
const db = JSON.parse(fs.readFileSync(jf, "utf8"));
const id = "m-meet-your-claw";
if (!db.contributions.some((c) => c.id === id)) {
  db.contributions.push({
    id,
    title: "Meet Your Claw: A Harness in Three Lines of C#",
    type: "video",
    portal_type: "Webinar/Livestream",
    area: ".NET",
    pillar_draft: "Microsoft Foundry y modelos",
    role: "Contributor",
    audience: ["Developer"],
    date_loaded: "2026-11-01",
    date_real: "2026-09-03",
    date_source: "manual",
    date_best: "2026-09-03",
    url: "https://www.youtube.com/live/iUs15X1v2w4",
    url_original: "https://www.youtube.com/live/iUs15X1v2w4",
    url_kind: "youtube",
    links: [],
    description_portal: "Microsoft Reactor livestream co-presented with Bruno Capuano (Principal Cloud Advocate, Microsoft), part of the series From Model to Agent: The Agent Framework Harness, Live in C#. We build a C# agent with AsHarnessAgent, a custom tool, web search and to-do list planning, connect it to a Microsoft Foundry chat client and run it in a shared console. 10,201 views on the dotnet YouTube channel (357K subscribers).",
    high_impact_portal: false,
    featured: false,
    visibility: "public",
    source: "manual",
    flags: [],
  });
  fs.writeFileSync(jf, JSON.stringify(db, null, 2));
}
console.log("ok", db.contributions.length);
