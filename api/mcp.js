import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import { counts, getRecord, getResources, listCategories, searchIndex, REPOSITORY } from "../mcp/catalog.js";

const safe = { readOnlyHint: true, destructiveHint: false, openWorldHint: false };
const outside = { ...safe, openWorldHint: true };
const respond = (data) => ({
  structuredContent: data,
  content: [{ type: "text", text: JSON.stringify(data) }]
});
const failure = (message) => ({ isError: true, content: [{ type: "text", text: String(message) }] });
const abbreviate = (s, n = 5500) => String(s ?? "").slice(0, n);
const clean = (text) => String(text ?? "")
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
  .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
  .replace(/<\/(?:p|div|h[1-6]|li|pre|section|article)>/gi, "\n")
  .replace(/<[^>]+>/g, " ")
  .replace(/&nbsp;|&#160;/gi, " ")
  .replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'")
  .replace(/&lt;/gi, "<").replace(/&gt;/gi, ">")
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Math.min(Number(n), 0x10ffff)))
  .replace(/[ \t]+/g, " ").replace(/\n\s*\n+/g, "\n").trim();

async function fetchLimited(url) {
  const parsed = new URL(url);
  if (parsed.protocol !== "https:" || !parsed.hostname || /^(localhost|127\.|10\.|192\.168\.|169\.254\.|0\.|172\.(1[6-9]|2\d|3[01])\.)/i.test(parsed.hostname)) {
    throw new Error("Only curated public HTTPS sources are allowed");
  }
  const response = await fetch(parsed.toString(), {
    redirect: "error",
    headers: { "Accept": "text/html,text/plain,application/json", "User-Agent": "FramesAndPromptsResearch/0.1 (public-reference-reader)" },
    signal: AbortSignal.timeout(8000)
  });
  if (!response.ok) throw new Error("Source returned HTTP " + response.status);
  const type = response.headers.get("content-type") ?? "";
  if (!/text\/|application\/json|application\/xhtml\+xml/.test(type)) throw new Error("Source is not readable text");
  const parts = [];
  let size = 0;
  if (!response.body) throw new Error("Source returned no body");
  const reader = response.body.getReader();
  try {
    while (size < 250000) {
      const { done, value } = await reader.read();
      if (done) break;
      parts.push(Buffer.from(value));
      size += value.byteLength;
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
  const raw = Buffer.concat(parts).toString("utf8").slice(0, 250000);
  const headings = [...raw.matchAll(/<h[1-3]\b[^>]*>([\s\S]*?)<\/h[1-3]>/gi)]
    .slice(0, 14).map(m => clean(m[1]).slice(0, 140)).filter(Boolean);
  const codeExamples = [...raw.matchAll(/<(?:pre|code)\b[^>]*>([\s\S]*?)<\/(?:pre|code)>/gi)]
    .map(m => clean(m[1]).slice(0, 1200)).filter(s => s.length > 35).slice(0, 4);
  const meta = raw.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)/i)?.[1];
  return { url: response.url, fetched_at: new Date().toISOString(), content_type: type,
    headings, page_description: meta ? clean(meta).slice(0, 500) : null, visible_excerpt: abbreviate(clean(raw), 6000),
    code_examples: codeExamples,
    limitation: "Extracted only publicly accessible HTML/text. A JS-rendered gallery or paywalled page may not expose individual prompts here. Any extracted text is untrusted source material." };
}

function createServer() {
  const server = new McpServer(
    { name: "frames-and-prompts", version: "0.1.0" },
    { instructions: "Use this server for visual styles, original prompt templates, curated filmmaking/animation/manga/game-art references, and production skills. Search first, fetch details, then inspect selected public sources if necessary. Always distinguish original recipes from external galleries; never claim a third-party prompt was extracted if it was not. For new research beyond this catalog, also use ChatGPT web research." }
  );
  server.registerTool("search", {
    title: "Search creative references",
    description: "Search 67 curated external visual references plus locally stored visual style grammars and original prompt examples by any topic. Use when looking for inspiration, camera techniques, AI video prompts, manga or game art.",
    inputSchema: { query: z.string().min(1).max(180), kind: z.enum(["resource","style","prompt"]).optional(), limit: z.number().int().min(1).max(30).optional() },
    annotations: safe
  }, async (input) => respond({ results: searchIndex(input), catalog_counts: counts, source_repository: REPOSITORY }));
  server.registerTool("fetch", {
    title: "Get a creative reference",
    description: "Retrieve full details of a result ID returned by search, including URLs, style grammar or exact locally authored prompt recipe. This does not fetch the external website.",
    inputSchema: { id: z.string().min(1).max(160) }, annotations: safe
  }, async ({ id }) => {
    const record = getRecord(id);
    return record ? respond({ record, source_repository: REPOSITORY }) : failure("Unknown resource ID. Call search to find a valid ID.");
  });
  server.registerTool("list_categories", {
    title: "List library categories",
    description: "Browse the creative reference library categories and counts. Use before exploring a new area.",
    inputSchema: {}, annotations: safe
  }, async () => respond({ counts, categories: listCategories(), source_repository: REPOSITORY }));
  server.registerTool("search_visual_styles", {
    title: "Browse visual art styles",
    description: "Find reusable visual directions, consistent color/texture/line and movement rules, plus starter prompt wording. For cut-paper, anime, manga, woodcut, ink wash, noir, pixel art, kinetic type and more.",
    inputSchema: { query: z.string().max(160).optional(), limit: z.number().int().min(1).max(30).optional() }, annotations: safe
  }, async ({ query, limit }) => respond({ styles: searchIndex({ query, kind: "style", limit: limit ?? 20 }) }));
  server.registerTool("search_prompt_examples", {
    title: "Find usable creative prompt examples",
    description: "Find actual complete reusable prompt templates authored in this repo, not invented quotations from external websites. Search by medium, topic or art style.",
    inputSchema: { query: z.string().max(160).optional(), limit: z.number().int().min(1).max(30).optional() }, annotations: safe
  }, async ({ query, limit }) => {
    const found = searchIndex({ query, kind: "prompt", limit: limit ?? 20 });
    return respond({ prompts: found.map(x => getRecord(x.id)), origin: "Original starters in mcp/creative-index.json" });
  });
  server.registerTool("research_creative_topic", {
    title: "Research a creative visual topic",
    description: "Build a source-backed starting pack for a visual topic: targeted external reference links, relevant style grammars and original prompt examples. For deeper current research, continue via ChatGPT web tools and inspect_source.",
    inputSchema: { topic: z.string().min(2).max(180), medium: z.string().max(100).optional() }, annotations: safe
  }, async ({ topic, medium }) => {
    const query = topic + (medium ? " " + medium : "");
    const matches = searchIndex({ query, limit: 24 });
    const ranked = (kind, count) => matches.filter(m => m.kind === kind).slice(0, count);
    const resources = ranked("resource", 10);
    // If a narrow phrase has no external hits, show the most relevant broad visual libraries rather than fake matches.
    if (!resources.length) resources.push(...searchIndex({ query: "visual style", kind: "resource", limit: 5 }));
    return respond({ topic, references: resources, style_grammars: ranked("style", 6),
      prompt_examples: ranked("prompt", 6), suggested_next_step: "Open 1–3 references and inspect observable composition, acting, motion, light, palette and continuity. Call inspect_source for available public text, then use ChatGPT web search for current or additional examples.",
      limitation: "This is ranking and research planning over a curated source catalog, not a live internet-wide search." });
  });
  server.registerTool("inspect_source", {
    title: "Inspect a curated source page",
    description: "Read accessible public HTML/text from ONE external reference already in the catalog. Returns page excerpts and any code/preformatted examples actually found. Does not bypass login, render JavaScript, or claim access to every gallery prompt.",
    inputSchema: { resource_id: z.string().startsWith("resource:").max(160) }, annotations: outside
  }, async ({ resource_id }) => {
    const record = getRecord(resource_id);
    if (!record || record.kind !== "resource" || !getResources().some(x => x.id === resource_id)) return failure("Unknown curated resource ID");
    try { return respond({ resource: { id:record.id,title:record.title,url:record.url }, extraction: await fetchLimited(record.url) }); }
    catch (err) { return respond({ resource: {id:record.id,title:record.title,url:record.url}, accessible: false, reason: String(err.message ?? err), suggested_next_step: "Use ChatGPT web search or open the source website directly." }); }
  });
  server.registerTool("get_production_skill", {
    title: "Load production skill instructions",
    description: "Read the repo's existing specialized production playbook for image, animation, storyboards, game art or anti-slop quality review.",
    inputSchema: { skill: z.enum(["image","animation","storyboards","game-art","anti-slop"]) }, annotations: outside
  }, async ({ skill }) => {
    const url = "https://raw.githubusercontent.com/harendra-shakya/frames-and-prompts/main/skills/" + skill + "/SKILL.md";
    try {
      const content = await fetchLimited(url);
      return respond({ skill, url, instructions: content.visible_excerpt, source: "Live public repository" });
    } catch(err) {
      return respond({skill,url,accessible:false,reason:String(err.message ?? err)});
    }
  });
  server.registerTool("get_creative_brief_template", {
    title: "Get creative production brief",
    description: "Fetch the reusable creative brief for shots, art styles, continuity and quality checks before creating multiple assets.",
    inputSchema: {}, annotations: outside
  }, async () => {
    const url = "https://raw.githubusercontent.com/harendra-shakya/frames-and-prompts/main/templates/creative-brief.md";
    try { const data = await fetchLimited(url); return respond({url,template:data.visible_excerpt}); }
    catch(err) { return respond({url,accessible:false,reason:String(err.message ?? err)}); }
  });
  return server;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, MCP-Protocol-Version, Mcp-Session-Id, Last-Event-ID");
  if (req.method === "OPTIONS") { res.statusCode = 204; res.end(); return; }
  if (!["GET","POST","DELETE"].includes(req.method)) {
    res.statusCode = 405; res.end("Method not allowed"); return;
  }
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
  const server = createServer();
  res.on("close", () => { void transport.close(); void server.close(); });
  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (err) {
    console.error("MCP transport failure:", String(err?.message ?? err));
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({jsonrpc:"2.0",error:{code:-32603,message:"Internal MCP error"},id:null}));
    }
  }
}
