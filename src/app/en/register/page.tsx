import Register from "@/app/(it)/register/page";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  lang: "en",
  title: "Create Your Free Account",
  description:
    "Create a free Curriculuxe account: build an ATS-friendly resume, get an instant resume score and start your AI job search.",
  path: "/register",
  keywords: ["Curriculuxe signup", "free resume builder account", "create resume online"],
});

export default function EnglishRegisterPage() {
  return <Register />;
}
