import type { ReactNode } from "react";

// The opening paragraph of a page, set off by a rule in the primary color.
export function Lead({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose my-5 border-l-2 border-fd-primary pl-4 text-base leading-relaxed text-fd-foreground">
      {children}
    </div>
  );
}
