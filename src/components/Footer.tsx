"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { navHref } from "@/lib/seo";
import { resources } from "@/content/resources";

export default function Footer() {
  const { t, lang } = useLanguage();
  const tFooter = t.footer as Record<string, string>;

  // Le etichette delle risorse arrivano da src/content/resources: sono le
  // stesse del menu e delle tab, quindi non possono divergere.
  const sections = [
    {
      title: tFooter.product as string,
      links: [
        { label: tFooter.features as string, href: "/#features" },
        { label: tFooter.pricing as string, href: "/pricing" },
        { label: tFooter.aiAnalyzer as string, href: "/analyze" },
        { label: tFooter.templateCV as string, href: "/templates" },
        { label: "Resume Score", href: "/resume-score" },
        { label: "Career Market", href: "/career-market" },
        { label: "Connect AI (MCP)", href: "/mcp" },
      ],
    },
    {
      title: tFooter.resources as string,
      links: resources.map((resource) => ({ label: resource.navLabel, href: resource.href })),
    },
    {
      title: tFooter.legal as string,
      links: [
        { label: tFooter.privacy as string, href: "/privacy" },
        { label: tFooter.terms as string, href: "/terms" },
        { label: tFooter.cookie as string, href: "/privacy#cookie" },
        { label: tFooter.leaveFeedback as string, href: "/dashboard/feedback" },
      ],
    },
  ];

  return (
    <footer
      className="py-16 px-6 border-t border-white/10 relative overflow-hidden bg-black"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="col-span-2 md:col-span-1"
          >
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/curriculuxe.png"
                alt="Logo Curriculuxe"
                width={34}
                height={34}
                className="rounded-xl shrink-0"
              />
              <span className="text-xl font-bold text-white tracking-wide">Curriculuxe</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
              {tFooter.description as string}
            </p>
          </motion.div>

          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i + 1) * 0.1 }}
            >
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, j) => (
                  <motion.li
                    key={j}
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={navHref(lang, link.href)}
                      className="text-zinc-400 hover:text-fuchsia-400 text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-zinc-600 text-sm">
            &copy; {new Date().getFullYear()} Curriculuxe. {tFooter.rights as string}
          </p>
          <div className="flex items-center gap-4">
            {/* Solo link verificabili: il repository GitHub e la pagina contatti.
                Non pubblichiamo profili social che non controlliamo. */}
            <motion.a
              href="https://github.com/gabrieleforestieri0912-lab"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Repository GitHub di Curriculuxe"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </motion.a>
            <Link
              href={navHref(lang, "/contatti")}
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Contatti
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
