import type * as React from "react";
import { cn } from "@/lib/cn";

// shadcn's Input (new-york v4), in the docs' fumadocs colors.
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-9 w-full min-w-0 rounded-md border border-fd-border bg-fd-background px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] placeholder:text-fd-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:ring-2 focus-visible:ring-fd-ring",
        "aria-invalid:border-fd-error aria-invalid:ring-fd-error/20",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
