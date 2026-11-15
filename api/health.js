import { counts, REPOSITORY } from "../mcp/catalog.js";
export default function handler(req, res) {
  if (req.method !== "GET") { res.status(405).json({error:"Method not allowed"}); return; }
  res.status(200).json({ ok:true, server:"frames-and-prompts", version:"0.1.0", counts, repository:REPOSITORY, transport:"Streamable HTTP", mcp_path:"/mcp" });
}
