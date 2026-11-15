# Frames & Prompts — ChatGPT MCP server

Read-only Streamable HTTP MCP built on the existing [67-resource catalog](../resources.json) and five [production skills](../AGENTS.md). Includes 14 original style grammars and 10 original prompt recipes in [creative-index.json](creative-index.json).

## Tools

- `search` / `fetch`: standard searchable reference and full-entry retrieval tools
- `list_categories`: all reference categories and resource counts
- `search_visual_styles`: reusable visual grammar and style constraints
- `search_prompt_examples`: complete original starter prompts (not third-party claims)
- `research_creative_topic`: source-backed starter pack for a topic
- `inspect_source`: limited public-text extraction from exactly one allowlisted catalog URL; blocked or JS-heavy websites may provide little text
- `get_production_skill`: fetch existing image/animation/storyboards/game-art/anti-slop instructions
- `get_creative_brief_template`: fetch the existing creative-brief template

## Deploy and connect

Deploy the repository as a **Vercel Node.js project** with root directory at repository root. The MCP endpoint is `https://YOUR-PROJECT.vercel.app/mcp`; health at `/api/health`. Node 22+, npm package dependencies from `package.json`. Run `npm test` in CI and test with MCP Inspector. There are no required API keys, database, embeddings, subscriptions, or runtime model calls. All tools are read-only; the endpoint exposes only public repo materials and public source pages.

In ChatGPT on web, open **Plugins → + → Add custom MCP server**, enter the HTTPS /mcp URL, select **No authentication**, create the plugin, then install it. Ask: `@Frames & Prompts find cut-paper visual styles and real prompt examples, then research animation references.` Account/workspace eligibility applies.

## Scope and limitations

The 67 external entries are **links to public catalogs, guides and libraries**, not 67 complete mirrored galleries. `inspect_source` retrieves only accessible HTML/text, not fully rendered JS pages, authenticated content, videos, or full external libraries. For internet-wide/current discovery, combine these MCP results with ChatGPT web search. Never represent source summaries as proof that full prompts were extracted. Original templates live in `creative-index.json` and can be expanded with reviewed examples over time.

## Security

Public read-only data requires no OAuth. External source reads are constrained to exact curated resources, HTTPS, no redirects, 8-second timeout, and a 250 kB response cap. Extracted content is untrusted source data. For private repositories or user-specific data, add OAuth and per-request authorization before exposing tools.
