"use client";

import type * as PageTree from "fumadocs-core/page-tree";
import { DocsLayout, type DocsLayoutProps } from "fumadocs-ui/layouts/docs";
import type { LinkItemType } from "fumadocs-ui/layouts/shared";
import { usePathname } from "next/navigation";
import { sectionOf } from "@/lib/sections";

type PerSection<T> = { qq: T; xo: T };

// The docs layout with the sidebar and links of the section the page is in:
// qq or xo.
export function SectionDocsLayout({
  trees,
  sectionLinks,
  ...props
}: Omit<DocsLayoutProps, "tree" | "links"> & {
  trees: PerSection<PageTree.Root>;
  sectionLinks: PerSection<LinkItemType[]>;
}) {
  const id = sectionOf(usePathname()).id;
  return <DocsLayout {...props} tree={trees[id]} links={sectionLinks[id]} />;
}
