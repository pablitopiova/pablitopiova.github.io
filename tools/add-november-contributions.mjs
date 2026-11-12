import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const dataFile = path.join(root, "data/contributions.json");
const profileFile = path.join(root, "data/profile.json");
const data = JSON.parse(fs.readFileSync(dataFile, "utf8"));
const profile = JSON.parse(fs.readFileSync(profileFile, "utf8"));

const entries = [
  {
    id: "m-nov-ignite-2026",
    title: "See you at Microsoft Ignite 2026!",
    type: "blog",
    portal_type: "LinkedIn post",
    area: "Microsoft Foundry",
    pillar_draft: "Comunidad y liderazgo",
    role: "Contributor",
    date: "2026-11-11",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7526315886752866305/",
    description_portal: "I announced my participation at Microsoft Ignite 2026 in San Francisco: joining the Table Talk “Level Up Your AI Skills | Lessons from Microsoft MVPs” and proctoring four hands-on labs for “Build an AI-ready data foundation with Microsoft OneLake” across November 17–19.",
  },
  {
    id: "m-nov-global-ai-kickoff",
    title: "Global AI Sarasota: community is how I've always found my people",
    type: "blog",
    portal_type: "LinkedIn post",
    area: "Community",
    pillar_draft: "Comunidad y liderazgo",
    role: "Organizer",
    date: "2026-11-07",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7524685254813495296/",
    description_portal: "I shared the launch of Global AI Sarasota and invited the community to its free online kickoff on November 13, part of Global AI On Tour.",
  },
];

let added = 0;
for (const entry of entries) {
  const id = entry.id;
  if (data.contributions.some((item) => item.id === id)) continue;
  const { date, ...item } = entry;
  data.contributions.push({
    ...item,
    audience: ["Developer"],
    date_loaded: "2026-11-12",
    date_real: date,
    date_source: "linkedin_datePublished",
    date_best: date,
    url_original: entry.url,
    url_kind: "linkedin_post",
    links: [],
    high_impact_portal: false,
    featured: false,
    visibility: "public",
    source: "manual_2026-11",
    flags: [],
  });
  added++;
}

profile.thumbOverrides ||= {};
profile.thumbOverrides["m-nov-global-ai-kickoff"] = "assets/brand/globalai-sarasota.png";
fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
fs.writeFileSync(profileFile, JSON.stringify(profile, null, 2));
console.log(`Added ${added} November LinkedIn posts`);
