import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import "./global.css";
import { Raleway } from "next/font/google";
import { GoogleAnalyticsProvider } from "@/components/google-analytics";
import { PostHogPageView, PostHogProvider } from "@/components/posthog";
import { appName, siteUrl } from "@/lib/shared";

const raleway = Raleway({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
  description:
    "Documentation for qq, the tool quirq uses to build, test and land code, and for quirq, a proposed unit for the work agents deliver.",
  openGraph: {
    siteName: appName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={raleway.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>
          <GoogleAnalyticsProvider />
          <PostHogProvider>
            <PostHogPageView />
            {children}
          </PostHogProvider>
        </RootProvider>
      </body>
    </html>
  );
}
