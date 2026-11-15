import catalog from "../resources.json" with { type: "json" };
import creative from "./creative-index.json" with { type: "json" };

export const REPOSITORY = "https://github.com/harendra-shakya/frames-and-prompts";
const normalize = (s) => String(s ?? "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const slug = (s) => normalize(s).replace(/\s+/g, "-");

const resources = catalog.resources.map((r) => ({
  id: "resource:" + slug(r.name), kind: "resource", title: r.name,
  category: r.category, type: r.type, url: r.url,
  description: r.what_you_get, use_for: r.when_to_visit,
  access: r.access, last_reviewed: catalog.last_reviewed,
  source: "Curated external reference; not a locally stored prompt example"
}));
const styles = creative.styles.map((s) => ({
  ...s, id: "style:" + s.id, kind: "style", title: s.name,
  category: "Visual style grammar", description: s.visual_language,
  url: REPOSITORY + "/blob/main/mcp/creative-index.json"
}));
const prompts = creative.prompts.map((p) => ({
  ...p, id: "prompt:" + p.id, kind: "prompt", category: "Original prompt starter",
  description: p.template, url: REPOSITORY + "/blob/main/mcp/creative-index.json"
}));
export const records = [...resources, ...styles, ...prompts];
export const counts = Object.freeze({ resources: resources.length, styles: styles.length, prompts: prompts.length });

function score(record, terms, phrase) {
  if (!terms.length) return 1;
  const name = normalize(record.title);
  const category = normalize(record.category);
  const desc = normalize([record.description, record.use_for, record.type, record.tags?.join(" "), record.medium, record.visual_language].join(" "));
  let n = name.includes(phrase) ? 25 : 0;
  for (const term of terms) {
    if (name.includes(term)) n += 9;
    if (category.includes(term)) n += 4;
    if (desc.includes(term)) n += 2;
  }
  return n;
}
export function searchIndex({ query = "", kind, category, limit = 10 } = {}) {
  const phrase = normalize(query);
  const terms = phrase.split(" ").filter(Boolean);
  const cap = Math.min(Math.max(Number(limit) || 10, 1), 30);
  const result = records.filter((r) =>
    (!kind || r.kind === kind) &&
    (!category || normalize(r.category).includes(normalize(category))) &&
    (terms.length === 0 || score(r, terms, phrase) > 0)
  ).map((r) => ({ r, rank: score(r, terms, phrase) }))
    .sort((a, b) => b.rank - a.rank || a.r.title.localeCompare(b.r.title))
    .slice(0, cap);
  return result.map(({r}) => ({
    id:r.id, kind:r.kind, title:r.title, url:r.url, category:r.category,
    description:r.description?.slice(0, 420), medium:r.medium, type:r.type, use_for:r.use_for
  }));
}
export function getRecord(id) {
  return records.find((r) => r.id === id) ?? null;
}
export function listCategories() {
  const countsByCategory = new Map();
  for (const r of resources) countsByCategory.set(r.category, (countsByCategory.get(r.category) ?? 0) + 1);
  return [...countsByCategory].map(([name,count])=>({name,count}));
}
export function getResources() {
  return resources;
}
