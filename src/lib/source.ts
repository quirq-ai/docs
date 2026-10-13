import { docs, researchDocs } from "collections/server";
import { loader } from "fumadocs-core/source";
import { createElement } from "react";
import { BrandIcon } from "@/components/brand-icon";
import {
  docsContentRoute,
  docsImageRoute,
  docsRoute,
  researchContentRoute,
} from "./shared";

// Static map of all sidebar icon names → Phosphor CSS classes (Tailwind scans these literals)
const ICON_CLASSES: Record<string, string> = {
  Archive: "icon-[ph--archive-fill]",
  Activity: "icon-[ph--activity-fill]",
  Anchor: "icon-[ph--anchor-fill]",
  Blocks: "icon-[ph--squares-four-fill]",
  Bot: "icon-[mingcute--chat-2-ai-fill]",
  Building2: "icon-[ph--buildings-fill]",
  CircleHelp: "icon-[ph--question-fill]",
  Cpu: "icon-[ph--cpu-fill]",
  Folder: "icon-[ph--folder-fill]",
  FolderOpen: "icon-[ph--folder-open-fill]",
  HardDrive: "icon-[ph--hard-drive-fill]",
  Database: "icon-[ph--database-fill]",
  Network: "icon-[ph--network-fill]",
  Monitor: "icon-[ph--monitor-fill]",
  Manage: "icon-[ph--air-traffic-control-fill]",
  Play: "icon-[ph--play-fill]",
  Rocket: "icon-[ph--rocket-fill]",
  RotateCcw: "icon-[ph--arrow-counter-clockwise-fill]",
  Settings: "icon-[ph--gear-fill]",
  Share2: "icon-[ph--share-network-fill]",
  Terminal: "icon-[ph--terminal-window-fill]",
  UserPlus: "icon-[ph--user-plus-fill]",
  UserCog: "icon-[ph--user-gear-fill]",
  Slack: "icon-[ph--slack-logo-fill]",
  Python: "icon-[lineicons--python]",
  NodeJs: "icon-[lineicons--nodejs]",
  NextJs: "icon-[lineicons--nextjs]",
  Vite: "icon-[lineicons--vite]",
  Docker: "icon-[lineicons--docker]",
  BookOpen: "icon-[ph--book-open-fill]",
  Info: "icon-[ph--info-fill]",
  LayoutTemplate: "icon-[ph--layout-fill]",
  MousePointerClick: "icon-[ph--cursor-click-fill]",
  Plug2: "icon-[ph--plug-fill]",
  Key: "icon-[ph--key-fill]",
  Puzzle: "icon-[ph--puzzle-piece-fill]",
  Workflow: "icon-[ph--flow-arrow-fill]",
  Zap: "icon-[ph--lightning-fill]",
  Telescope: "icon-[mingcute--telescope-fill]",
  Microscope: "icon-[ph--microscope-fill]",
  FlaskConical: "icon-[ph--flask-fill]",
  Coins: "icon-[ph--coins-fill]",
  Scale: "icon-[ph--scales-fill]",
  Ruler: "icon-[ph--ruler-fill]",
  LayoutDashboard: "icon-[ph--chart-bar-fill]",
  ShieldAlert: "icon-[ph--shield-warning-fill]",
  ClipboardCheck: "icon-[ph--clipboard-text-fill]",
  Wrench: "icon-[ph--wrench-fill]",
  UserCircle: "icon-[ph--user-circle-fill]",
  UserFocus: "icon-[ph--user-focus-fill]",
  ShareNetwork: "icon-[ph--share-network-fill]",
  GitFork: "icon-[ph--git-fork-fill]",
  GitPullRequest: "icon-[ph--git-pull-request-fill]",
  Atom: "icon-[ph--atom-fill]",
  Gauge: "icon-[ph--gauge-fill]",
  ChartLineUp: "icon-[ph--chart-line-up-fill]",
  Cloud: "icon-[ph--cloud-fill]",
  Map: "icon-[ph--map-trifold-fill]",
  Download: "icon-[ph--download-simple-fill]",
  Code: "icon-[ph--code-fill]",
  more: "icon-[ph--dots-three-fill]",
};

// Brand icon names → public/icons slug
const BRAND_ICONS: Record<string, string> = {
  ClaudeCode: "claude-code",
  Hermes: "hermes",
  OpenClaw: "openclaw",
  Anthropic: "anthropic",
  OpenAI: "openai",
  Codex: "codex",
  Vercel: "vercel",
  Manus: "manus",
  V0: "v0",
  Cursor: "cursor",
  Devin: "devin",
  Lovable: "lovable",
  Mcp: "mcp",
  N8n: "n8n",
  XoCowork: "xo-cowork",
  GoogleDrive: "google-drive",
  OneDrive: "onedrive",
  Github: "github",
  Venice: "venice",
  Antigravity: "antigravity",
  Quirq: "quirq",
};

function iconifyIconsPlugin() {
  function replaceIcon<T extends { icon?: unknown }>(node: T): T {
    if (typeof node.icon === "string") {
      const brandSlug = BRAND_ICONS[node.icon];
      if (brandSlug) {
        node.icon = createElement(BrandIcon, {
          key: node.icon,
          name: brandSlug,
          size: 16,
        });
        return node;
      }
      const cls = ICON_CLASSES[node.icon];
      node.icon = cls
        ? createElement("span", { key: node.icon, className: cls })
        : undefined;
    }
    return node;
  }
  return {
    name: "fumadocs:icon",
    transformPageTree: {
      file: replaceIcon,
      folder: replaceIcon,
      separator: replaceIcon,
    },
  };
}

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [iconifyIconsPlugin()],
});

export const researchSource = loader({
  baseUrl: "/research",
  source: researchDocs.toFumadocsSource(),
  plugins: [iconifyIconsPlugin()],
});

export function getPageImage(page: (typeof source)["$inferPage"]) {
  const segments = [...page.slugs, "image.png"];

  return {
    segments,
    url: `${docsImageRoute}/${segments.join("/")}`,
  };
}

export function getPageMarkdownUrl(page: { slugs: string[] }) {
  const segments = [...page.slugs, "content.md"];
  return { segments, url: `${docsContentRoute}/${segments.join("/")}` };
}

export function getResearchPageMarkdownUrl(page: { slugs: string[] }) {
  const segments = [...page.slugs, "content.md"];
  return { segments, url: `${researchContentRoute}/${segments.join("/")}` };
}

export function getResearchPageImage(page: { slugs: string[] }) {
  const segments = [...page.slugs, "image.png"];
  return { segments, url: `/og/research/${segments.join("/")}` };
}

export async function getLLMText(page: (typeof source)["$inferPage"]) {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title} (${page.url})

${processed}`;
}
