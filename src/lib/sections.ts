import type * as PageTree from "fumadocs-core/page-tree";

// The site's two sections. qq's pages sit at /docs/*, xo's at /docs/xo/*.
export const xoRoute = "/docs/xo";

export const sections = [
  {
    id: "qq",
    title: "qq",
    url: "/docs",
    repo: "https://github.com/quirq-ai/qq",
  },
  {
    id: "xo",
    title: "xo",
    url: xoRoute,
    repo: "https://github.com/quirq-ai/xo",
  },
] as const;

export function inXo(pathname: string): boolean {
  return pathname === xoRoute || pathname.startsWith(`${xoRoute}/`);
}

export function sectionOf(pathname: string) {
  return sections[inXo(pathname) ? 1 : 0];
}

// content/docs/xo/ (meta.json lists its index as a page, so the folder has no
// `index` of its own).
function isXoFolder(node: PageTree.Node): node is PageTree.Folder {
  return node.type === "folder" && node.$id === "xo";
}

// Split the page tree so each section's sidebar lists only its own pages.
export function splitTree(tree: PageTree.Root): {
  qq: PageTree.Root;
  xo: PageTree.Root;
} {
  const folder = tree.children.find(isXoFolder);
  return {
    qq: { ...tree, children: tree.children.filter((n) => !isXoFolder(n)) },
    xo: {
      ...tree,
      name: "xo",
      children: folder
        ? [...(folder.index ? [folder.index] : []), ...folder.children]
        : [],
    },
  };
}
