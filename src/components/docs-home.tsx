"use client";

import Link from "next/link";
import { BrandIcon } from "@/components/brand-icon";
import { HomeTerminal } from "@/components/home-terminal";
import { SectionTabs } from "@/components/section-tabs";
import { Video } from "@/components/video";
import { socialLinks } from "@/lib/layout.shared";

const GITHUB_REPO_URL = "https://github.com/quirq-ai/qq";

// The docs home: the terminal first, then how to install, the qq film and the
// guides.
export function DocsHome() {
  return (
    <main className="min-h-screen bg-fd-background text-fd-foreground">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <div className="flex items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 text-sm font-semibold tracking-tight"
          >
            <BrandIcon name="quirq" size={24} />
            <span className="whitespace-nowrap text-base font-bold">
              quirq docs
            </span>
          </Link>
          <SectionTabs />
        </div>
        <nav aria-label="Primary" className="flex items-center gap-4 text-sm">
          <Link
            href="/docs/install"
            className="hidden whitespace-nowrap py-3 font-medium sm:inline-block text-fd-foreground transition-colors hover:text-fd-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-primary"
          >
            Install
          </Link>
          <Link
            href="/docs/commands"
            className="hidden whitespace-nowrap text-fd-muted-foreground transition-colors hover:text-fd-foreground sm:inline-block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-primary"
          >
            Commands
          </Link>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 whitespace-nowrap text-fd-muted-foreground transition-colors hover:text-fd-foreground sm:inline-flex"
          >
            <BrandIcon name="github" size={16} />
            GitHub
          </a>
          <Link
            href="/docs/first-build"
            className="rounded-lg bg-fd-primary px-4 py-2 font-medium text-fd-primary-foreground whitespace-nowrap transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-primary"
          >
            Get started
          </Link>
        </nav>
      </header>

      <section className="relative isolate overflow-hidden border-t border-fd-border px-4 pt-8 pb-16 sm:px-8 sm:pt-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(22,110,29,0.12),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_50%_-10%,rgba(21,110,29,0.22),transparent_60%)]"
        />
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-background/80 px-3 py-1 text-xs font-medium text-fd-muted-foreground">
              <span className="icon-[ph--terminal-window-fill] size-3.5 text-fd-primary" />
              Try the commands before you install
            </p>
            <h1 className="mt-4 text-balance text-[2.15rem] leading-[1.05] font-bold tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              See what each command does.
            </h1>
            <p className="mt-4 max-w-2xl text-pretty text-[0.95rem] leading-7 text-fd-muted-foreground sm:text-lg">
              qq builds, tests and lands code in any repo the same way. xo runs
              your XO Cloud spaces and projects. Tap a command, or type one, and
              the terminal plays back what it printed.
            </p>
          </div>
          <div className="mt-6 sm:mt-8">
            <HomeTerminal />
          </div>
        </div>
      </section>

      <section className="border-t border-fd-border bg-fd-muted/40 px-4 py-16 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fd-muted-foreground">
              Ready for the real thing
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Install it and run the same commands.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-fd-muted-foreground sm:text-base">
              qq runs on Linux x86_64 first. xo runs on Linux, macOS and
              Windows. Or watch the three-minute film on what qq is, with sound
              and captions.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/docs/install"
                className="inline-flex min-h-11 items-center rounded-lg bg-fd-primary px-5 text-sm font-semibold text-fd-primary-foreground transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-primary"
              >
                <span className="icon-[ph--download-simple-bold] mr-2 size-4" />
                Install qq
              </Link>
              <Link
                href="/docs/xo/install"
                className="inline-flex min-h-11 items-center rounded-lg border border-fd-border bg-fd-background px-5 text-sm font-semibold transition-colors hover:bg-fd-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-primary"
              >
                Install xo
              </Link>
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center rounded-lg border border-fd-border bg-fd-background px-5 text-sm font-semibold transition-colors hover:bg-fd-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-primary"
              >
                <BrandIcon name="github" size={16} className="mr-2" />
                GitHub
              </a>
            </div>
          </div>
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
      </section>

      <section className="border-t border-fd-border px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fd-muted-foreground">
            Guides
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {GUIDES.map((g) => (
              <Link
                key={g.href}
                href={g.href}
                className="group rounded-xl border border-fd-border bg-fd-card p-5 transition-colors hover:bg-fd-accent/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-primary"
              >
                <span className="mb-3 flex size-8 items-center justify-center rounded-lg border border-fd-border bg-fd-muted text-fd-primary">
                  <span className={`${g.icon} size-4`} />
                </span>
                <span className="font-semibold">{g.title}</span>
                <span className="mt-1.5 block text-sm text-fd-muted-foreground">
                  {g.text}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-fd-border bg-fd-muted/30 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 text-sm text-fd-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>qq docs: how quirq builds, tests, lands and ships code.</p>
          <nav aria-label="Social links" className="flex items-center gap-2">
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
                  className="rounded-md p-2 text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground"
                  aria-label={label}
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

const GUIDES = [
  {
    href: "/docs/try-first-build",
    icon: "icon-[ph--terminal-window-fill]",
    title: "Try it: your first build",
    text: "Five steps beside a terminal.",
  },
  {
    href: "/docs/first-build",
    icon: "icon-[ph--play-fill]",
    title: "Your first build",
    text: "Build, test and run a real app.",
  },
  {
    href: "/docs/send-a-change",
    icon: "icon-[ph--git-pull-request-fill]",
    title: "Send a change",
    text: "From your branch to main.",
  },
  {
    href: "/docs/add-a-repo",
    icon: "icon-[ph--folder-plus-fill]",
    title: "Put a repo on qq",
    text: "One file, infra/repo.toml.",
  },
  {
    href: "/docs/infrastructure",
    icon: "icon-[ph--map-trifold-fill]",
    title: "How it fits together",
    text: "The repos behind qq.",
  },
  {
    href: "/docs/xo",
    icon: "icon-[ph--cloud-fill]",
    title: "xo",
    text: "Log in, spaces, projects and sharing.",
  },
];
