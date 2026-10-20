"use client";

import Link from "fumadocs-core/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { inXo, sections } from "@/lib/sections";

// The header's qq and xo tabs: one per section, the current one underlined.
export function SectionTabs() {
  const pathname = usePathname();
  const xo = inXo(pathname);

  return (
    <nav
      aria-label="Docs sections"
      className="flex items-center gap-1 ps-2 sm:ps-4"
    >
      {sections.map((s) => {
        const active = s.id === "xo" ? xo : !xo;
        return (
          <Link
            key={s.id}
            href={s.url}
            aria-current={active ? "true" : undefined}
            className={cn(
              "inline-flex min-h-11 items-center border-b-2 px-2 text-sm font-medium transition-colors sm:px-3",
              active
                ? "border-fd-primary text-fd-foreground"
                : "border-transparent text-fd-muted-foreground hover:text-fd-foreground",
            )}
          >
            {s.title}
          </Link>
        );
      })}
    </nav>
  );
}
