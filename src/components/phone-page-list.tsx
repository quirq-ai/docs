"use client";

import { SidebarTrigger } from "fumadocs-ui/layouts/docs/slots/sidebar";
import { usePathname } from "next/navigation";
import { inXo } from "@/lib/sections";

// Below md the sidebar is a drawer: this bar opens it with the section's pages.
// Like fumadocs' own docs header it stays under the site header as you scroll
// (the site header is h-14, hence the banner height), and it sets the header
// height so the "On this page" bar stacks below it.
export function PhonePageList() {
  const label = inXo(usePathname()) ? "xo pages" : "qq pages";

  return (
    <div className="sticky top-(--fd-docs-row-1) z-30 flex h-(--fd-header-height) items-center border-b border-fd-border bg-fd-background/80 px-4 backdrop-blur-sm [grid-area:header] md:hidden max-md:layout:[--fd-banner-height:--spacing(14)] max-md:layout:[--fd-header-height:--spacing(11)]">
      <SidebarTrigger
        type="button"
        aria-label={label}
        className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-fd-muted-foreground transition-colors hover:text-fd-foreground"
      >
        <span aria-hidden="true" className="icon-[ph--list] size-4" />
        {label}
      </SidebarTrigger>
    </div>
  );
}
