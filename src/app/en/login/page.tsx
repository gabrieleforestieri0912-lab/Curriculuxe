import Login from "@/app/(it)/login/page";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  lang: "en",
  title: "Log In",
  description:
    "Log in to Curriculuxe to keep building, optimizing and tracking your resume with AI.",
  path: "/login",
  keywords: ["Curriculuxe login", "log in to resume builder"],
  noindex: true,
});

export default function EnglishLoginPage() {
  return <Login />;
}
