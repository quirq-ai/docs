"use client";

import { usePathname } from "next/navigation";
import { BrandIcon } from "@/components/brand-icon";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { sectionOf } from "@/lib/sections";

// The header's GitHub icon: the qq repo in the qq section, xo's in xo. Drawn
// as fumadocs draws `githubUrl` (a ghost icon button with the GitHub mark, 20px
// in a 32px button), so only the address changes.
export function SectionGithubLink() {
  const section = sectionOf(usePathname());

  return (
    <a
      href={section.repo}
      target="_blank"
      rel="noopener noreferrer"
      title={`${section.title} on GitHub`}
      className={cn(buttonVariants({ color: "ghost", size: "icon" }))}
    >
      <BrandIcon name="github" size={20} />
      <span className="sr-only">{section.title} on GitHub</span>
    </a>
  );
}
