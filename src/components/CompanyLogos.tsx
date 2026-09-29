interface Props {
  name: string;
  height?: number;
}

interface LogoConfig {
  src: string;
  /** CSS filter applied to the logo (e.g. invert black logos for dark backgrounds) */
  filter?: string;
}

/**
 * Loghi ufficiali dei brand, scaricati come file SVG originali
 * (Wikimedia Commons per i loghi multicolore, Simple Icons per i monocolore)
 * e serviti localmente da /public/logos.
 */
const LOGOS: Record<string, LogoConfig> = {
  Google: { src: "/logos/google.svg" },
  Apple: { src: "/logos/apple.svg", filter: "brightness(0) invert(1)" },
  Microsoft: { src: "/logos/microsoft.svg" },
  Amazon: { src: "/logos/amazon.svg" },
  Meta: { src: "/logos/meta.svg" },
  Salesforce: { src: "/logos/salesforce.svg" },
  Spotify: { src: "/logos/spotify.svg" },
  Airbnb: { src: "/logos/airbnb.svg" },
  GitHub: { src: "/logos/github.svg" },
  LinkedIn: { src: "/logos/linkedin.svg" },
  Slack: { src: "/logos/slack.svg" },
  Discord: { src: "/logos/discord.svg" },
  Shopify: { src: "/logos/shopify.svg" },
};

export default function CompanyLogo({ name, height = 52 }: Props) {
  const logo = LOGOS[name];
  if (!logo) return null;

  return (
    <img
      src={logo.src}
      alt={`${name} logo`}
      loading="lazy"
      className="opacity-80 hover:opacity-100 transition-opacity"
      style={{
        height,
        width: "auto",
        maxWidth: 160,
        objectFit: "contain",
        filter: logo.filter,
      }}
    />
  );
}
