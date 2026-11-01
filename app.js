const S = window.SITE;
const $ = (id) => document.getElementById(id);
const TYPES = {
  talk: "Talks", video: "Videos", blog: "Posts", article: "Articles",
  community: "Community", code: "Code", mentoring: "Mentoring", podcast: "Podcast", other: "Other",
};
const SOURCES = { youtube: "YouTube", devto: "dev.to", linkedin_post: "LinkedIn", linkedin_article: "LinkedIn", linkedin_event: "LinkedIn", github: "GitHub", meetup: "Meetup", microsoft: "Microsoft" };
const state = { type: "all", year: "all", pillar: "all", q: "" };
const el = (tag, props = {}, ...kids) => {
  const n = Object.assign(document.createElement(tag), props);
  n.append(...kids.filter(Boolean));
  return n;
};

const items = [...S.items].sort((a, b) => b.date.localeCompare(a.date));
const yearOf = (i) => i.date.slice(0, 4);
const fmt = (i) => i.dateApprox ? "Date to be confirmed" : new Date(i.date + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

$("name").textContent = S.name;
$("bio").textContent = S.bio;
$("year").textContent = new Date().getFullYear();
const LABELS = { linkedin: "LinkedIn", github: "GitHub", mvp: "Microsoft MVP", docker: "Docker Captains" };

const years = [...new Set(items.map(yearOf))];
const pillars = [...new Set(items.map((i) => i.pillar).filter((p) => p && p !== "Unassigned"))].sort();
const count = (...t) => items.filter((i) => t.includes(i.type)).length;

function chips() {
  const present = Object.entries(TYPES).filter(([k]) => count(k) > 0);
  $("typeFilters").replaceChildren(...[["all", "All"], ...present].map(([k, v]) => {
    const b = el("button", { className: "chip", textContent: v, type: "button" });
    b.setAttribute("aria-pressed", String(k === state.type));
    b.onclick = () => { state.type = k; chips(); render(); };
    return b;
  }));
}
$("yearFilter").append(el("option", { value: "all", textContent: "All years" }), ...years.map((y) => el("option", { value: y, textContent: y })));
$("pillarFilter").append(el("option", { value: "all", textContent: "All topics" }), ...pillars.map((p) => el("option", { value: p, textContent: p })));
$("yearFilter").onchange = (e) => { state.year = e.target.value; render(); };
$("pillarFilter").onchange = (e) => { state.pillar = e.target.value; render(); };
$("search").oninput = (e) => { state.q = e.target.value.toLowerCase(); render(); };

function openDetail(i) {
  const d = $("detail");
  $("dImg").hidden = !i.thumb;
  if (i.thumb) $("dImg").src = i.thumb;
  $("dNote").hidden = !i.thumbGenerated;
  $("dTitle").textContent = i.title;
  $("dMeta").textContent = [TYPES[i.type], i.role, SOURCES[i.source], fmt(i)].filter(Boolean).join(" · ");
  $("dDesc").textContent = i.description || "No description available.";
  $("dTags").replaceChildren(...[i.pillar, i.area].filter((t, k, a) => t && t !== "Unassigned" && a.indexOf(t) === k).map((t) => el("span", { className: "tag", textContent: t })));
  const link = $("dLink");
  link.hidden = !i.url;
  link.href = i.url || "#";
  d.showModal();
}
$("detail").addEventListener("click", (e) => { if (e.target === e.currentTarget || e.target.closest("[data-close]")) e.currentTarget.close(); });

function card(i, cls = "item", tag = "li") {
  const title = el("h3", { textContent: i.title });
  const meta = [i.role, SOURCES[i.source], fmt(i)].filter(Boolean).join(" · ");
  const img = i.thumb && el("img", { src: i.thumb, alt: "", loading: "lazy", onerror() { this.remove(); } });
  const thumb = img && el("div", { className: "thumb" }, img);
  const body = el("div", { className: "body" }, el("span", { className: "kind", textContent: TYPES[i.type] || "" }), title, el("div", { className: "meta", textContent: meta }),
    i.description && el("p", { className: "desc", textContent: i.description }),
    i.pillar && i.pillar !== "Unassigned" && el("span", { className: "tag", textContent: i.pillar }));
  const li = el(tag, { className: cls, tabIndex: 0 }, thumb, body);
  li.setAttribute("role", "button");
  li.setAttribute("aria-label", "View details: " + i.title);
  li.onclick = () => openDetail(i);
  li.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openDetail(i); } };
  return li;
}

function render() {
  const list = items.filter((i) =>
    (state.type === "all" || i.type === state.type) &&
    (state.year === "all" || yearOf(i) === state.year) &&
    (state.pillar === "all" || i.pillar === state.pillar) &&
    (!state.q || [i.title, i.description, i.area, i.pillar].join(" ").toLowerCase().includes(state.q)));
  $("empty").hidden = list.length > 0;
  $("count").textContent = `${list.length} results`;
  const out = [];
  let last;
  for (const i of list) {
    if (yearOf(i) !== last) { last = yearOf(i); out.push(el("li", { className: "year", textContent: last })); }
    out.push(card(i));
  }
  $("timeline").replaceChildren(...out);
}

Object.entries(S.links).filter(([, u]) => u).forEach(([k, u]) =>
  $("footLinks").append(el("a", { href: u, target: "_blank", rel: "noopener", textContent: LABELS[k] || k })));

chips();
render();

$("ctaLinkedIn").href = S.links.linkedin;
const ICONS = {
  build: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/></svg>',
  teach: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M10 8.5l5 2.5-5 2.5zM8 20h8M12 16v4"/></svg>',
  lead: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M15.5 14.3c3 0 5.5 2 5.5 5.2"/></svg>',
};
const goFilter = (o) => { Object.assign(state, { type: "all", pillar: "all" }, o); $("pillarFilter").value = state.pillar; chips(); render(); $("contributions").scrollIntoView(); };
const recent = (fn, n = 3) => items.filter((i) => !i.dateApprox && fn(i)).slice(0, n);
[
  { ico: "build", title: "Build", text: "AI agents with Microsoft Foundry, Azure and .NET, from prototype to production.",
    stat: `${items.filter((i) => i.pillar === "Microsoft Foundry & models").length} contributions`, filter: { pillar: "Microsoft Foundry & models" },
    list: recent((i) => i.pillar === "Microsoft Foundry & models" && ["code", "blog", "article", "video", "talk"].includes(i.type)) },
  { ico: "teach", title: "Teach", text: "Talks, livestreams and videos for developers, including Microsoft Reactor.",
    stat: `${count("talk")} talks · ${count("video")} videos`, filter: { type: "talk" },
    list: recent((i) => i.type === "talk" || i.type === "video") },
  { ico: "lead", title: "Lead communities", text: "Organizer of .NET Baires and Global AI Sarasota.",
    stat: `${count("community")} community events`, filter: { type: "community" },
    list: recent((i) => i.type === "community") },
].forEach((p) => {
  const ico = el("span", { className: "ico" });
  ico.innerHTML = ICONS[p.ico];
  const ul = el("ul", { className: "recent" }, ...p.list.map((i) => {
    const b = el("button", { type: "button", className: "recent-item", onclick: () => openDetail(i) }, el("span", { textContent: i.title }), el("small", { textContent: fmt(i) }));
    return el("li", {}, b);
  }));
  const all = el("button", { type: "button", className: "more", textContent: "See all →", onclick: () => goFilter(p.filter) });
  $("pillars").append(el("article", { className: "pillar" }, ico, el("h3", { textContent: p.title }), el("p", { textContent: p.text }),
    el("div", { className: "stat-line", textContent: p.stat }), el("div", { className: "recent-h", textContent: "Latest" }), ul, all));
});