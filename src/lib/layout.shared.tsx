import type { BaseLayoutProps, LinkItemType } from "fumadocs-ui/layouts/shared";
import { BrandIcon } from "@/components/brand-icon";
import { appName, gitConfig } from "./shared";

const logo = (
  <span className="inline-flex items-center gap-2" aria-label={appName}>
    <BrandIcon name="quirq" size={24} />
    <span className="whitespace-nowrap text-base font-bold">quirq</span>
  </span>
);

const tabLinks: LinkItemType[] = [
  { text: "Guides", url: "/docs", active: "nested-url" },
  { text: "Research", url: "/research", active: "nested-url" },
];

export const socialLinks: LinkItemType[] = [
  {
    type: "icon",
    label: "GitHub",
    text: "GitHub",
    icon: <span className="icon-[ph--github-logo-fill] size-3.5" />,
    url: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    external: true,
  },
  {
    type: "icon",
    label: "quirq.ai",
    text: "quirq.ai",
    icon: <span className="icon-[ph--globe-fill] size-3.5" />,
    url: "https://www.quirq.ai",
    external: true,
  },
  {
    type: "icon",
    label: "XO docs",
    text: "XO docs",
    icon: <span className="icon-[ph--book-open-fill] size-3.5" />,
    url: "https://docs.xo.builders",
    external: true,
  },
];

export function baseOptions(): BaseLayoutProps {
  return {
    nav: { title: logo },
    links: tabLinks,
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
