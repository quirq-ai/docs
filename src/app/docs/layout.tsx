import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { LinkItemType } from "fumadocs-ui/layouts/shared";
import { AISearch, AISearchPanel } from "@/components/ai/search";
import { SectionDocsLayout } from "@/components/section-docs-layout";
import { StartFreeBar } from "@/components/start-free-bar";
import { baseOptions, socialLinks } from "@/lib/layout.shared";
import { splitTree } from "@/lib/sections";
import { source } from "@/lib/source";

export default function Layout({ children }: { children: React.ReactNode }) {
  const sidebarLinks: LinkItemType[] = socialLinks.map((l) => ({
    ...l,
    on: "menu" as const,
  }));

  return (
    <HomeLayout {...baseOptions()}>
      <SectionDocsLayout
        trees={splitTree(source.getPageTree())}
        nav={{ enabled: false }}
        searchToggle={{ enabled: false }}
        themeSwitch={{ enabled: false }}
        links={sidebarLinks}
      >
        <AISearch>
          <AISearchPanel />
          {/* Ask AI lives in StartFreeBar (fixed bottom) after scroll */}
          <StartFreeBar />
        </AISearch>

        {children}
      </SectionDocsLayout>
    </HomeLayout>
  );
}
