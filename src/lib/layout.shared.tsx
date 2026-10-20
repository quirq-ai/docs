import type { BaseLayoutProps, LinkItemType } from "fumadocs-ui/layouts/shared";
import { BrandIcon } from "@/components/brand-icon";
import { SectionGithubLink } from "@/components/section-github-link";
import { SectionTabs } from "@/components/section-tabs";
import { gitConfig } from "./shared";

const logo = (
  <span className="inline-flex items-center gap-2">
    <BrandIcon name="quirq" size={24} />
    <span className="whitespace-nowrap text-base font-bold">quirq docs</span>
  </span>
);

const otherLinks: LinkItemType[] = [
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

// The GitHub link goes to the repo of the section you are in.
export function socialLinksFor(githubUrl: string): LinkItemType[] {
  return [
    {
      type: "icon",
      label: "GitHub",
      text: "GitHub",
      icon: <span className="icon-[ph--github-logo-fill] size-3.5" />,
      url: githubUrl,
      external: true,
    },
    ...otherLinks,
  ];
}

export const socialLinks = socialLinksFor(
  `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
);

export function baseOptions(): BaseLayoutProps {
  return {
    // qq and xo are separate sections, each with its own sidebar. The tabs sit
    // beside the title, so they stay in the header on a phone too.
    nav: { title: logo, children: <SectionTabs /> },
    links: [
      { type: "custom", secondary: true, children: <SectionGithubLink /> },
    ],
  };
}
