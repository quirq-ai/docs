import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { LinkItemType } from "fumadocs-ui/layouts/shared";
import { AISearch, AISearchPanel } from "@/components/ai/search";
import { PhonePageList } from "@/components/phone-page-list";
import { SectionDocsLayout } from "@/components/section-docs-layout";
import { StartFreeBar } from "@/components/start-free-bar";
import { baseOptions, socialLinksFor } from "@/lib/layout.shared";
import { sections, splitTree } from "@/lib/sections";
import { source } from "@/lib/source";

export default function Layout({ children }: { children: React.ReactNode }) {
  const sidebarLinks = (repo: string): LinkItemType[] =>
    socialLinksFor(repo).map((l) => ({ ...l, on: "menu" as const }));

  return (
    <HomeLayout {...baseOptions()}>
      <SectionDocsLayout
        trees={splitTree(source.getPageTree())}
        nav={{ component: <PhonePageList /> }}
        searchToggle={{ enabled: false }}
        themeSwitch={{ enabled: false }}
        sectionLinks={{
          qq: sidebarLinks(sections[0].repo),
          xo: sidebarLinks(sections[1].repo),
        }}
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
