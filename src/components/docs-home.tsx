"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { BrandIcon } from "@/components/brand-icon";
import { CommandBuilder, UseCases } from "@/components/home-extras";
import { HomeTerminal, type TerminalControl } from "@/components/home-terminal";
import { SectionTabs } from "@/components/section-tabs";
import { buttonVariants } from "@/components/ui/button";
import { Video } from "@/components/video";
import { socialLinks } from "@/lib/layout.shared";

const GITHUB_REPO_URL = "https://github.com/quirq-ai/qq";

// One container for every band, so the header, the terminal, the film and the
// use cases share a left edge.
const CONTAINER = "mx-auto w-full max-w-6xl px-4 sm:px-8";

const CTA = "min-h-10 gap-2 rounded-lg px-4";

// The docs home: the terminal first, then a builder for your own commands,
// the qq film, and use cases that play in the terminal.
export function DocsHome() {
  const control = useRef<TerminalControl | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <main className="min-h-screen bg-fd-background text-fd-foreground">
      <header className="border-b border-fd-border">
        <div
          className={`${CONTAINER} flex h-16 items-center justify-between gap-4`}
        >
          <div className="flex min-w-0 items-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 rounded-md font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
            >
              <BrandIcon name="quirq" size={22} />
              <span className="whitespace-nowrap">quirq docs</span>
            </Link>
            <SectionTabs />
          </div>
          <nav aria-label="Primary" className="flex items-center gap-1">
            <Link
              href="/docs/install"
              className={buttonVariants({
                variant: "ghost",
                className: "px-3",
              })}
            >
              Install
            </Link>
            <span className="hidden sm:flex">
              <Link
                href="/docs/commands"
                className={buttonVariants({
                  variant: "ghost",
                  className: "px-3",
                })}
              >
                Commands
              </Link>
            </span>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="qq on GitHub"
              className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
            >
              <BrandIcon name="github" size={18} />
            </a>
          </nav>
        </div>
      </header>

      <section className="pt-10 pb-16 sm:pt-14">
        <div className={CONTAINER}>
          <div className="max-w-2xl">
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              qq and xo, one command at a time
            </h1>
            <p className="mt-3 text-pretty leading-7 text-fd-muted-foreground">
              qq builds, tests and lands code in any repo the same way. xo runs
              your XO Cloud spaces and projects. Pick a command, or type one,
              and the terminal plays back what it printed.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/docs/install"
                className={buttonVariants({
                  variant: "primary",
                  className: CTA,
                })}
              >
                Install qq
              </Link>
              <Link
                href="/docs/xo/install"
                className={buttonVariants({
                  variant: "outline",
                  className: CTA,
                })}
              >
                Install xo
              </Link>
            </div>
          </div>
          <div className="mt-10">
            <HomeTerminal control={control} onBusy={setBusy} />
          </div>
        </div>
      </section>

      <section className="border-t border-fd-border py-16">
        <div className={CONTAINER}>
          <div className="mb-6 max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight">
              Make your own command
            </h2>
            <p className="mt-3 leading-7 text-fd-muted-foreground">
              Pick a task and put in your own names. Copy the commands into your
              shell, or play a recorded run like them.
            </p>
          </div>
          <div className="max-w-4xl">
            <CommandBuilder control={control} busy={busy} />
          </div>
        </div>
      </section>

      <section className="border-t border-fd-border py-16">
        <div className={CONTAINER}>
          <div className="mb-8 max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight">
              What is qq
            </h2>
            <p className="mt-3 leading-7 text-fd-muted-foreground">
              A three-minute film on how qq builds, tests, lands and ships code,
              with sound and captions. qq runs on Linux x86_64 first; xo runs on
              Linux, macOS and Windows.
            </p>
          </div>
          <div className="max-w-4xl">
            <Video
              src="/videos/explainer.mp4"
              poster="/videos/explainer.jpg"
              phoneSrc="/videos/explainer-phone.mp4"
              phonePoster="/videos/explainer.jpg"
              phoneWidth={854}
              phoneHeight={480}
              title="What is qq: the quirq infra field guide"
              width={1280}
              height={720}
            />
          </div>
        </div>
      </section>

      <section className="border-t border-fd-border py-16">
        <div className={CONTAINER}>
          <div className="mb-8 max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight">Use cases</h2>
            <p className="mt-3 leading-7 text-fd-muted-foreground">
              Press Play and the terminal above runs the commands, one after
              another, and shows what each printed.
            </p>
          </div>
          <UseCases control={control} busy={busy} />
        </div>
      </section>

      <footer className="border-t border-fd-border">
        <div
          className={`${CONTAINER} flex flex-col gap-4 py-8 text-sm text-fd-muted-foreground sm:flex-row sm:items-center sm:justify-between`}
        >
          <p>How quirq builds, tests, lands and ships code.</p>
          <nav aria-label="Social links" className="flex items-center gap-1">
            {socialLinks.map((link, idx) => {
              if (!("url" in link) || typeof link.url !== "string") return null;
              const label =
                "text" in link && typeof link.text === "string"
                  ? link.text
                  : "Social link";
              return (
                <a
                  key={link.url || idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={buttonVariants({
                    variant: "ghost",
                    size: "icon-sm",
                    className: "text-fd-muted-foreground",
                  })}
                >
                  {link.icon}
                </a>
              );
            })}
          </nav>
        </div>
      </footer>
    </main>
  );
}
