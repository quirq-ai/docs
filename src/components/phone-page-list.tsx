"use client";

import { SidebarTrigger } from "fumadocs-ui/layouts/docs/slots/sidebar";
import { usePathname } from "next/navigation";
import { inXo } from "@/lib/sections";

// Below md the sidebar is a drawer: this bar opens it with the section's pages.
export function PhonePageList() {
  const label = inXo(usePathname()) ? "xo pages" : "qq pages";

  return (
    <div className="flex items-center border-b border-fd-border px-4 [grid-area:header] md:hidden">
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
