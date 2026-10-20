"use client";

import { usePathname } from "next/navigation";
import { sectionOf } from "@/lib/sections";

// The header's GitHub icon: the qq repo in the qq section, xo's in xo.
export function SectionGithubLink() {
  const section = sectionOf(usePathname());

  return (
    <a
      href={section.repo}
      target="_blank"
      rel="noopener noreferrer"
      title={`${section.title} on GitHub`}
      className="inline-flex size-9 items-center justify-center rounded-md text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
    >
      <span aria-hidden="true" className="icon-[ph--github-logo-fill] size-5" />
      <span className="sr-only">{section.title} on GitHub</span>
    </a>
  );
}
