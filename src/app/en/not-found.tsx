import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  lang: "en",
  title: "Page not found (404)",
  description: "The page you are looking for does not exist. Go back to the Curriculuxe home page.",
  path: "/en/404",
  noindex: true,
});

export default function EnglishNotFound() {
  return (
    <main className="min-h-screen bg-[#07070d] text-white flex flex-col items-center justify-center px-6 text-center">
      <p className="text-fuchsia-400 font-bold tracking-widest text-sm">404</p>
      <h1 className="text-4xl font-bold mt-3 mb-4">Page not found</h1>
      <p className="text-zinc-400 max-w-md mb-8">
        This page does not exist anymore. Try the home page or the free guides to build a resume
        that passes ATS filters.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/en"
          className="btn-primary px-6 py-3 rounded-full font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Back to home
        </Link>
        <Link
          href="/resume-score"
          className="px-6 py-3 rounded-full font-semibold text-sm border border-white/10 bg-white/5 hover:bg-white/10"
        >
          Free ATS checker
        </Link>
      </div>
    </main>
  );
}
