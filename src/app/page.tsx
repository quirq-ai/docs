import type { Metadata } from "next";
import { QuirqHome } from "@/components/quirq-home";

export const metadata: Metadata = {
  title: "quirq docs",
  description:
    "Documentation for qq, the tool quirq uses to build, test and land code, and for quirq, a proposed unit for the work agents deliver.",
  alternates: {
    canonical: "https://docs.quirq.dev/",
  },
  openGraph: {
    title: "quirq docs",
    description:
      "Documentation for qq, the tool quirq uses to build, test and land code, and for quirq, a proposed unit for the work agents deliver.",
    url: "https://docs.quirq.dev/",
    type: "website",
  },
};

export default function RootPage() {
  return <QuirqHome />;
}
