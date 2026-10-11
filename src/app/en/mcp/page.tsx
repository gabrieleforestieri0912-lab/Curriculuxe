import Link from "next/link";
import ResourceShell from "@/components/ResourceShell";
import { breadcrumbSchema, buildMetadata, jsonLd, siteUrl } from "@/lib/seo";

export const metadata = buildMetadata({
  lang: "en",
  title: "Connect AI - MCP Server for ChatGPT and Claude",
  description:
    "Connect Curriculuxe to ChatGPT or Claude through MCP (Streamable HTTP). Free read access, write access on paid plans with explicit approval before every change.",
  path: "/mcp",
  keywords: [
    "MCP server",
    "Model Context Protocol",
    "ChatGPT connector",
    "Claude integration",
    "career agent MCP",
  ],
});

export default function EnglishMcpPage() {
  const endpoint = `${siteUrl}/api/mcp`;

  return (
    <ResourceShell>
      <div className="max-w-4xl mx-auto">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd(
              breadcrumbSchema("en", "/mcp", [
                { name: "Home", path: "/" },
                { name: "Connect AI", path: "/mcp" },
              ])
            ),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Curriculuxe MCP Server",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Web",
              url: endpoint,
              description:
                "Model Context Protocol server that exposes the Curriculuxe career agent to ChatGPT and Claude.",
              offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
            }),
          }}
        />

        <h1 className="text-3xl font-bold text-white">Connect AI - MCP</h1>
        <p className="text-zinc-400 mt-2">
          Your career agent inside the AI you already use. Endpoint:{" "}
          <code className="px-2 py-1 rounded bg-white/10 text-fuchsia-300">{endpoint}</code>
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-white font-bold">3 steps to connect</h2>
          <ol className="list-decimal list-inside text-zinc-300 mt-3 space-y-2">
            <li>
              Copy the MCP address: <code className="text-fuchsia-300">{endpoint}</code>
            </li>
            <li>Sign in from your browser and approve the requested permissions.</li>
            <li>
              Ask in plain language: &quot;Find the 3 best roles for my profile and explain the
              fit&quot;.
            </li>
          </ol>
          <div className="grid sm:grid-cols-2 gap-3 mt-6 text-sm">
            <div className="rounded-xl border border-white/10 p-4">
              <div className="font-bold text-white">ChatGPT</div>
              <p className="text-zinc-500 mt-1">
                Settings &rarr; Connectors &rarr; Add MCP Server (Streamable HTTP) &rarr; paste the
                URL &rarr; authorize.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 p-4">
              <div className="font-bold text-white">Claude</div>
              <p className="text-zinc-500 mt-1">
                Settings &rarr; Integrations &rarr; Add MCP Server &rarr; paste the URL &rarr;
                authorize.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-zinc-400">
              <tr>
                <th className="text-left p-3">Tool</th>
                <th className="p-3">Free</th>
                <th className="p-3">Paid plans</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              <tr>
                <td className="p-3">search_jobs</td>
                <td className="p-3 text-center">read</td>
                <td className="p-3 text-center">yes</td>
              </tr>
              <tr>
                <td className="p-3">view_career_context (redacted)</td>
                <td className="p-3 text-center">yes</td>
                <td className="p-3 text-center">yes</td>
              </tr>
              <tr>
                <td className="p-3">check_plan_usage</td>
                <td className="p-3 text-center">yes</td>
                <td className="p-3 text-center">yes</td>
              </tr>
              <tr>
                <td className="p-3">match_jobs_personalized / tailor / cover letter</td>
                <td className="p-3 text-center text-zinc-600">upgrade</td>
                <td className="p-3 text-center text-emerald-300">write</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
          <h3 className="text-white font-bold">Trust &amp; Safety</h3>
          <ul className="list-disc list-inside text-sm text-zinc-300 mt-2 space-y-1">
            <li>No direct database or SQL access, only named workflows.</li>
            <li>No surprise writes: every change is previewed and needs explicit approval.</li>
            <li>It never submits applications on your behalf.</li>
            <li>
              One-click disconnect from{" "}
              <Link href="/dashboard/settings" className="text-fuchsia-400">
                Settings
              </Link>
              , with an activity log.
            </li>
          </ul>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 gap-3">
          {[
            "Find the 3 best roles for my profile and explain the fit with evidence",
            "Score my latest resume and tell me the 2 highest-impact gaps",
            "Tailor my resume for this job posting and show the diff before saving",
    "Update my pipeline: move Frontend Senior to Interview with a follow-up in 7 days",
          ].map((p) => (
            <div
              key={p}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-300"
            >
              &quot;{p}&quot;
            </div>
          ))}
        </div>
      </div>
    </ResourceShell>
  );
}
