"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLanguage } from "@/context/LanguageContext";
import {
  faAirbnb,
  faAmazon,
  faApple,
  faDiscord,
  faGithub,
  faGoogle,
  faLinkedin,
  faMeta,
  faMicrosoft,
  faSalesforce,
  faShopify,
  faSlack,
  faSpotify,
} from "@fortawesome/free-brands-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface CompanyLogo {
  name: string;
  icon: IconDefinition;
  color: string;
}

const companyLogos: CompanyLogo[] = [
  { name: "Google", icon: faGoogle, color: "#4285F4" },
  { name: "Apple", icon: faApple, color: "#f5f5f7" },
  { name: "Microsoft", icon: faMicrosoft, color: "#00A4EF" },
  { name: "Amazon", icon: faAmazon, color: "#FF9900" },
  { name: "Meta", icon: faMeta, color: "#0668E1" },
  { name: "Salesforce", icon: faSalesforce, color: "#00A1E0" },
  { name: "Spotify", icon: faSpotify, color: "#1DB954" },
  { name: "Airbnb", icon: faAirbnb, color: "#FF5A5F" },
  { name: "GitHub", icon: faGithub, color: "#f5f5f5" },
  { name: "LinkedIn", icon: faLinkedin, color: "#0A66C2" },
  { name: "Slack", icon: faSlack, color: "#E01E5A" },
  { name: "Discord", icon: faDiscord, color: "#5865F2" },
  { name: "Shopify", icon: faShopify, color: "#95BF47" },
];

export default function CompaniesSection() {
  const { t } = useLanguage();
  const tCompanies = t.companies as Record<string, string>;
  return (
    <section
      className="py-16 sm:py-20 overflow-hidden gradient-bg"
    >
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 80s linear infinite;
          will-change: transform;
          animation-play-state: running !important;
        }
        .marquee-track:hover,
        .marquee-track *:hover,
        .marquee-track *:focus {
          animation-play-state: running !important;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 px-6"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          {tCompanies.title as string}
        </h2>
        <p className="text-zinc-400 max-w-xl mx-auto">
          {tCompanies.subtitle as string}
        </p>
      </motion.div>

      <div
        className="overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
        } as React.CSSProperties}
      >
        <div className="marquee-track">
            {[...companyLogos, ...companyLogos].map((company, i) => (
              <div
                key={i}
                className="flex items-center px-16 py-6"
              >
                <FontAwesomeIcon
                  icon={company.icon}
                  style={{ color: company.color, width: "64px", height: "64px" }}
                />
              </div>
            ))}
          </div>
        </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-10 text-center px-6"
      >
        <p className="text-zinc-500 text-sm">
          +5000 candidati assunti con il nostro curriculum negli ultimi 12 mesi
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-4">
          {[tCompanies.atsBadge, tCompanies.multiLangBadge, tCompanies.seoBadge].map((label) => (
            <div key={label} className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-zinc-400 text-sm">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
