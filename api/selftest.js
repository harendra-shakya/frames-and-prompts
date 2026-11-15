const makeCall = async (url, method, params, id) => {
  const response = await fetch(url, {
    method: "POST", redirect: "error",
    headers: {"content-type":"application/json","accept":"application/json, text/event-stream","mcp-protocol-version":"2025-11-25"},
    body: JSON.stringify({jsonrpc:"2.0",id,method,params}),
    signal: AbortSignal.timeout(9000)
  });
  const text = await response.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text.slice(0, 1600) }; }
  return { status: response.status, data };
};

export default async function handler(req, res) {
  if (req.method !== "GET") { res.statusCode = 405; res.end(); return; }
  // This endpoint never accepts a user-supplied hostname or tool arguments.
  const host = req.headers.host;
  if (!host || !/^[a-zA-Z0-9.-]+$/.test(host) || (!host.endsWith(".vercel.app") && host !== "localhost")) {
    res.status(400).json({ok:false,error:"Unexpected host"}); return;
  }
  const url = "https://" + host + "/mcp";
  try {
    const init = await makeCall(url, "initialize", {protocolVersion:"2025-11-25",capabilities:{},clientInfo:{name:"frames-prompts-selftest",version:"0.1.0"}}, 1);
    const list = await makeCall(url, "tools/list", {}, 2);
    const sample = await makeCall(url, "tools/call", {name:"search",arguments:{query:"cut-paper",kind:"style",limit:4}}, 3);
    const toolNames = (list.data.result?.tools ?? []).map(x => x.name);
    const returned = sample.data.result?.structuredContent?.results ?? [];
    const ok = init.status === 200 && list.status === 200 && sample.status === 200
      && toolNames.includes("search") && toolNames.includes("inspect_source")
      && returned.some(x => x.id === "style:cut-paper");
    res.status(ok ? 200 : 503).json({ok,initialize_status:init.status,
      tool_list_status:list.status,tool_names:toolNames,
      example_status:sample.status,example_count:returned.length,
      ...(ok ? {} : {debug:{init:init.data,list:list.data,sample:sample.data}})});
  } catch (e) {
    res.status(503).json({ok:false,error:String(e?.message ?? e)});
  }
}
