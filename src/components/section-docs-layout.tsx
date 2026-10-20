"use client";

import type * as PageTree from "fumadocs-core/page-tree";
import { DocsLayout, type DocsLayoutProps } from "fumadocs-ui/layouts/docs";
import { usePathname } from "next/navigation";
import { inXo } from "@/lib/sections";

// The docs layout with the sidebar of the section the page is in: qq or xo.
export function SectionDocsLayout({
  trees,
  ...props
}: Omit<DocsLayoutProps, "tree"> & {
  trees: { qq: PageTree.Root; xo: PageTree.Root };
}) {
  const pathname = usePathname();
  return <DocsLayout {...props} tree={inXo(pathname) ? trees.xo : trees.qq} />;
}
