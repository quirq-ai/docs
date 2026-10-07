"use client";

import { useEffect, useState } from "react";
import { useAISearchContext } from "@/components/ai/search";
import { cn } from "@/lib/cn";

const SIGN_UP_URL = "https://app.xo.builders/sign-up?ref=docs.quirq.dev";
/** Hide the bar near the page end so the docs footer / social links stay reachable. */
const HIDE_NEAR_BOTTOM_PX = 160;
/** Matches bar content + vertical padding; reserved so content can scroll clear of the bar. */
const BAR_HEIGHT_PX = 60;

/**
 * Fixed bottom bar: Ask AI + Start Free. Client-only (scroll / AI context).
 * Always available after mount; hides near the document bottom so the site
 * footer and social links are not covered. Reserves bottom padding while shown.
 */
export function StartFreeBar() {
  const [awayFromFooter, setAwayFromFooter] = useState(true);
  const { open, setOpen } = useAISearchContext();

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const nearBottom =
        window.scrollY + window.innerHeight >=
        doc.scrollHeight - HIDE_NEAR_BOTTOM_PX;
      setAwayFromFooter(!nearBottom);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Slide away near the footer; hide entirely when the AI panel is open.
  // Padding stays reserved whenever the AI panel is closed so show/hide near
  // the footer does not change scrollHeight (avoids flicker).
  const showBar = awayFromFooter && !open;
  useEffect(() => {
    const root = document.documentElement;
    if (!open) {
      root.style.setProperty("--docs-bottom-bar-height", `${BAR_HEIGHT_PX}px`);
      root.style.paddingBottom = `${BAR_HEIGHT_PX}px`;
    } else {
      root.style.removeProperty("--docs-bottom-bar-height");
      root.style.paddingBottom = "";
    }
    return () => {
      root.style.removeProperty("--docs-bottom-bar-height");
      root.style.paddingBottom = "";
    };
  }, [open]);

  return (
    <section
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-fd-border bg-fd-background/95 px-4 py-2.5 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur-md transition-transform duration-300 dark:shadow-[0_-4px_24px_rgba(0,0,0,0.35)]",
        showBar ? "translate-y-0" : "pointer-events-none translate-y-full",
      )}
      aria-label="Quick actions"
      aria-hidden={!showBar}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-fd-border bg-fd-background px-3 py-1.5 text-sm font-semibold text-fd-foreground transition-colors hover:bg-fd-muted"
          tabIndex={showBar ? 0 : -1}
        >
          <span
            className="icon-[ph--chat-circle] size-4"
            aria-hidden="true"
          />
          Ask AI
        </button>
        <a
          href={SIGN_UP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-lg bg-fd-primary px-4 py-1.5 text-sm font-semibold text-fd-primary-foreground transition-opacity hover:opacity-90"
          tabIndex={showBar ? 0 : -1}
        >
          Start Free
        </a>
      </div>
    </section>
  );
}
