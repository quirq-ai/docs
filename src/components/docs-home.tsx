"use client";

import Link from "next/link";
import { BrandIcon } from "@/components/brand-icon";
import { HomeTerminal } from "@/components/home-terminal";
import { SectionTabs } from "@/components/section-tabs";
import { buttonVariants } from "@/components/ui/button";
import { Video } from "@/components/video";
import { socialLinks } from "@/lib/layout.shared";

const GITHUB_REPO_URL = "https://github.com/quirq-ai/qq";

// One container for every band, so the header, the terminal, the film and the
// guides share a left edge.
const CONTAINER = "mx-auto w-full max-w-6xl px-4 sm:px-8";

const CTA = "min-h-10 gap-2 rounded-lg px-4";

// The docs home: the terminal first, then the qq film, then the guides.
export function DocsHome() {
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
            <div className="hidden items-center gap-1 sm:flex">
              <Link
                href="/docs/install"
                className={buttonVariants({
                  variant: "ghost",
                  className: "px-3",
                })}
              >
                Install
              </Link>
              <Link
                href="/docs/commands"
                className={buttonVariants({
                  variant: "ghost",
                  className: "px-3",
                })}
              >
                Commands
              </Link>
            </div>
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
            <HomeTerminal />
          </div>
        </div>
      </section>

      <section className="border-t border-fd-border py-16">
        <div
          className={`${CONTAINER} grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center`}
        >
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              What is qq
            </h2>
            <p className="mt-3 max-w-md leading-7 text-fd-muted-foreground">
              A three-minute film on how qq builds, tests, lands and ships code,
              with sound and captions. qq runs on Linux x86_64 first; xo runs on
              Linux, macOS and Windows.
            </p>
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

      <section className="border-t border-fd-border py-16">
        <div className={CONTAINER}>
          <h2 className="text-2xl font-semibold tracking-tight">Guides</h2>
          <div className="mt-8 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {GUIDES.map((group) => (
              <div key={group.title}>
                <h3 className="font-mono text-sm text-fd-muted-foreground">
                  {group.title}
                </h3>
                <ul className="mt-3 divide-y divide-fd-border border-y border-fd-border">
                  {group.items.map((g) => (
                    <li key={g.href}>
                      <Link
                        href={g.href}
                        className="group flex items-center gap-4 py-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium">{g.title}</span>
                          <span className="mt-0.5 block text-sm text-fd-muted-foreground">
                            {g.text}
                          </span>
                        </span>
                        <span
                          aria-hidden="true"
                          className="text-fd-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-fd-foreground"
                        >
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
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

const GUIDES = [
  {
    title: "qq",
    items: [
      {
        href: "/docs/try-first-build",
        title: "Try it: your first build",
        text: "Five steps beside a terminal.",
      },
      {
        href: "/docs/first-build",
        title: "Your first build",
        text: "Build, test and run a real app.",
      },
      {
        href: "/docs/send-a-change",
        title: "Send a change",
        text: "From your branch to main.",
      },
      {
        href: "/docs/add-a-repo",
        title: "Put a repo on qq",
        text: "One file, infra/repo.toml.",
      },
      {
        href: "/docs/infrastructure",
        title: "How it fits together",
        text: "The repos behind qq.",
      },
    ],
  },
  {
    title: "xo",
    items: [
      {
        href: "/docs/xo",
        title: "What is xo",
        text: "The command line for XO Cloud.",
      },
      {
        href: "/docs/xo/login",
        title: "Log in",
        text: "In your browser, or with an API key.",
      },
      {
        href: "/docs/xo/spaces",
        title: "Create a space",
        text: "Preview it with --dry-run, then create it.",
      },
      {
        href: "/docs/xo/projects",
        title: "Projects in a space",
        text: "Add your repos and connect them to a space.",
      },
      {
        href: "/docs/xo/share",
        title: "Share",
        text: "Invite another XO user to a copy.",
      },
    ],
  },
];
