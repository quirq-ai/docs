import type { Metadata } from "next";
import { DocsHome } from "@/components/docs-home";

export const metadata: Metadata = {
  title: "qq docs",
  description:
    "Documentation for qq, quirq's build and release infrastructure: install it, build and test a repo, land a change and put a repo on qq.",
  alternates: {
    canonical: "https://docs.quirq.dev/",
  },
  openGraph: {
    title: "qq docs",
    description:
      "Documentation for qq, quirq's build and release infrastructure: install it, build and test a repo, land a change and put a repo on qq.",
    url: "https://docs.quirq.dev/",
    type: "website",
  },
};

export default function RootPage() {
  return <DocsHome />;
}
