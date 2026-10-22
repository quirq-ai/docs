"use client";

import { useEffect, useRef, useState } from "react";
import { buttonVariants } from "@/components/ui/button";

// Copies text to the clipboard and says so for two seconds. Where the
// clipboard is refused (an insecure page, an old browser), it says that
// instead of pretending.
export function CopyButton({
  text,
  label = "Copy",
  className = "",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("failed");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={buttonVariants({
        variant: "outline",
        size: "sm",
        className: `min-h-11 shrink-0 gap-1.5 sm:min-h-8 ${className}`,
      })}
    >
      <span
        aria-hidden
        className={`size-3.5 ${state === "copied" ? "icon-[ph--check]" : "icon-[ph--copy]"}`}
      />
      <span aria-live="polite">
        {state === "copied"
          ? "Copied"
          : state === "failed"
            ? "Copy failed"
            : label}
      </span>
    </button>
  );
}
