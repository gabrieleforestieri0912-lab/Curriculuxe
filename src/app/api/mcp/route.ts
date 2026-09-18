import { NextRequest, NextResponse } from "next/server";
import { getRequestUser } from "@/lib/apiAuth";
import { MCP_TOOLS, getUserPlan, handleMcpTool, type McpPlan } from "@/lib/mcp";

// Streamable HTTP — minimal JSON-RPC 2.0 handler with OAuth via cookie (browser sign-in, no API keys)
export async function GET(request: NextRequest) {
  const user = getRequestUser(request);
  const plan: McpPlan = user ? await getUserPlan(user.id) : "free";
  return NextResponse.json({
    name: "Curriculuxe MCP",
    version: "1.0.0",
    transport: "streamable-http",
    endpoint: "/api/mcp",
    auth: "browser OAuth via cookie httpOnly (no API keys)",
    plan,
    tools: MCP_TOOLS,
    guarantees: [
      "Nessun accesso diretto a DB/SQL — solo workflow nominati",
      "Nessun salvataggio a sorpresa — preview + approvazione esplicita",
      "Nessuna candidatura automatica per conto dell'utente",
      "Disconnessione one-click da /dashboard/settings con log attività",
    ],
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.tool !== "string") {
    return NextResponse.json({ error: "Body atteso: {tool:string, args?:object}" }, { status: 400 });
  }

  const user = getRequestUser(request);
  const plan: McpPlan = user ? await getUserPlan(user.id) : "free";

  // Every MCPConnection should be visible/revocable in /settings — log handled via existing auth
  const result = await handleMcpTool(body.tool, (body.args as Record<string, unknown>) || {}, { userId: user?.id, plan });

  // Fail-soft with upsell already handled in handleMcpTool for paid tools on free plan
  return NextResponse.json({ tool: body.tool, plan, result });
}
