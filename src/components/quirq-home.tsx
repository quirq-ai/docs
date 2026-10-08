"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BrandIcon } from "@/components/brand-icon";
import { SystemSequence } from "@/components/system-sequence";
import { socialLinks } from "@/lib/layout.shared";

const SIGN_UP_URL = "https://app.xo.builders/sign-up?ref=docs.quirq.dev";
const GITHUB_REPO_URL = "https://github.com/quirq-ai/xo-space";

export function QuirqHome() {
  const [copied, setCopied] = useState(false);
  const curlCmd = "curl -fsSL https://quirq.ai/install | sh";

  const copyCommand = () => {
    navigator.clipboard.writeText(curlCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-fd-background text-fd-foreground">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 text-sm font-semibold tracking-tight"
        >
          <BrandIcon name="quirq" size={24} />
          <span className="whitespace-nowrap text-base font-bold">
            XO Space
          </span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-4 text-sm">
          <Link
            href="/docs/start"
            className="whitespace-nowrap py-3 font-medium text-fd-foreground transition-colors hover:text-fd-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-primary"
          >
            Start here
          </Link>
          <Link
            href="/docs"
            className="hidden whitespace-nowrap text-fd-muted-foreground transition-colors hover:text-fd-foreground sm:inline-block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-primary"
          >
            Docs
          </Link>
          <Link
            href="/docs/space/space-walk"
            className="hidden whitespace-nowrap text-fd-muted-foreground transition-colors hover:text-fd-foreground sm:inline-block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-primary"
          >
            Space UI
          </Link>
          <Link
            href="/docs/quirq"
            className="hidden whitespace-nowrap text-fd-muted-foreground transition-colors hover:text-fd-foreground sm:inline-block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-primary"
          >
            quirq
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
          <a
            href={SIGN_UP_URL}
            className="rounded-lg bg-fd-primary px-4 py-2 font-medium text-fd-primary-foreground transition-opacity sm:whitespace-nowrap hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-primary"
          >
            Launch Cloud
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden border-y border-fd-border bg-fd-muted/30 px-5 py-20 sm:px-8 sm:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-20%,rgba(22,110,29,0.15),transparent_65%)] dark:bg-[radial-gradient(ellipse_at_50%_-20%,rgba(21,110,29,0.25),transparent_65%)]"
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-background/80 px-3.5 py-1 text-xs font-medium text-fd-foreground shadow-sm">
            <span className="size-2 rounded-full bg-green-500 animate-pulse" />
            <span>One-Click Agentic Environments</span>
            <span className="text-fd-muted-foreground">•</span>
            <span className="text-fd-muted-foreground">
              Measure Output, Not Just Tokens
            </span>
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-[-0.05em] sm:text-6xl lg:text-7xl">
            Build, observe, and measure agentic work.
          </h1>

          <Link
            href="/docs/start"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl border border-fd-border bg-fd-background px-5 py-2 text-balance text-sm font-semibold text-fd-foreground shadow-sm transition-colors hover:bg-fd-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-primary"
          >
            New to XO Space? Start here: the main links on one page
            <span className="icon-[ph--arrow-right-bold] size-3.5" />
          </Link>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-fd-muted-foreground sm:text-lg">
            Every agent needs a <strong>Runtime</strong> (the machine), an{" "}
            <strong>Environment</strong> (XO Space), an <strong>Agent</strong>{" "}
            (unopinionated harness), and an <strong>Output</strong> (quirq). XO
            decouples the environment from the machine—bringing live
            observability and verified work measurement to your team.
          </p>

          {/* Terminal Install Snippet */}
          <div className="mx-auto mt-8 max-w-xl">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-fd-border bg-fd-card/90 p-3 shadow-md backdrop-blur-sm sm:px-4 sm:py-3.5">
              <div className="flex items-center gap-2 overflow-x-auto font-mono text-xs text-fd-foreground sm:text-sm">
                <span className="text-fd-primary font-bold">$</span>
                <code className="text-fd-foreground">{curlCmd}</code>
              </div>
              <button
                type="button"
                onClick={copyCommand}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-fd-border bg-fd-muted px-3 py-1.5 text-xs font-medium text-fd-foreground transition-colors hover:bg-fd-accent"
                aria-label="Copy install command"
              >
                {copied ? (
                  <>
                    <span className="icon-[ph--check-bold] size-3.5 text-fd-primary" />
                    <span className="text-fd-primary font-semibold">
                      Copied
                    </span>
                  </>
                ) : (
                  <>
                    <span className="icon-[ph--copy-bold] size-3.5 text-fd-muted-foreground" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <p className="mt-2 text-xs text-fd-muted-foreground">
              Runs locally on <code>localhost:5002</code> · Auto-detects Claude
              Code, OpenClaw, Hermes, Antigravity, Cursor
            </p>
          </div>

          {/* Actions */}
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/docs/space/install-space"
              className="rounded-lg bg-fd-primary px-6 py-3 text-sm font-semibold text-fd-primary-foreground transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-primary"
            >
              <span className="icon-[ph--monitor-fill] mr-2 inline-block size-4 align-[-0.125em]" />
              Start Local Space
            </Link>
            <a
              href={SIGN_UP_URL}
              className="rounded-lg border border-fd-border bg-fd-background/80 px-6 py-3 text-sm font-semibold transition-colors hover:bg-fd-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-primary"
            >
              <span className="icon-[ph--rocket-fill] mr-2 inline-block size-4 align-[-0.125em] text-fd-primary" />
              1-Click Managed Cloud
            </a>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg border border-fd-border bg-fd-background/80 px-5 py-3 text-sm font-semibold transition-colors hover:bg-fd-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-primary"
            >
              <BrandIcon name="github" size={16} className="mr-2" />
              GitHub Repo
            </a>
          </div>
        </div>
      </section>

      {/* 5-Stage Sequence Visual */}
      <SystemSequence />

      {/* Two Deployment Targets (Decoupled Architecture) */}
      <section className="border-y border-fd-border bg-fd-muted px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fd-muted-foreground">
              Decoupled Architecture
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              One Environment. Any Machine.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-fd-muted-foreground sm:text-base">
              Because <strong>Environment (XO Space)</strong> is decoupled from
              the machine runtime, your project memory, live trace logs, and
              agent sessions travel anywhere without vendor lock-in.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {/* Local Card */}
            <div className="group relative isolate min-h-[30rem] overflow-hidden rounded-2xl border border-fd-border bg-[#05080c] p-7 text-white sm:p-10">
              <Image
                src="/images/system-local.png"
                alt="A local Space running on a personal machine"
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-contain object-right-bottom p-3 opacity-85 transition-transform duration-700 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
              />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(5,8,12,0.98)_0%,rgba(5,8,12,0.82)_35%,rgba(5,8,12,0.15)_75%,rgba(5,8,12,0.02)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#05080c] via-[#05080c]/40 to-transparent" />
              <div className="relative flex h-full max-w-sm flex-col items-start">
                <span className="flex size-9 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-fd-primary">
                  <span className="icon-[ph--monitor-fill] size-5" />
                </span>
                <div className="mt-auto">
                  <p className="text-xs font-semibold uppercase tracking-wider text-fd-primary">
                    Self-Hosted (Local OSS)
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
                    Your Laptop or Mac Studio.
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/70">
                    Run Space directly on your machine. Auto-discovers local
                    agent CLIs and stores all trace telemetry in{" "}
                    <code>~/.quirq/</code>.
                  </p>
                  <Link
                    href="/docs/space/install-space"
                    className="mt-6 inline-flex items-center rounded-lg bg-fd-primary px-5 py-2.5 text-sm font-semibold text-fd-primary-foreground transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-primary"
                  >
                    Install Local Space
                    <span className="icon-[ph--arrow-right-bold] ml-2 size-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Cloud Card */}
            <div className="group relative isolate min-h-[30rem] overflow-hidden rounded-2xl border border-fd-border bg-[#05080c] p-7 text-white sm:p-10">
              <Image
                src="/images/system-cloud.png"
                alt="A Space running across connected cloud infrastructure"
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-contain object-right-bottom p-3 opacity-85 transition-transform duration-700 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
              />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(5,8,12,0.98)_0%,rgba(5,8,12,0.82)_35%,rgba(5,8,12,0.15)_75%,rgba(5,8,12,0.02)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#05080c] via-[#05080c]/40 to-transparent" />
              <div className="relative flex h-full max-w-sm flex-col items-start">
                <span className="flex size-9 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-fd-primary">
                  <span className="icon-[ph--rocket-fill] size-5" />
                </span>
                <div className="mt-auto">
                  <p className="text-xs font-semibold uppercase tracking-wider text-fd-primary">
                    Managed Cloud Sandbox
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
                    1-Click XO Cloud Sandboxes.
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/70">
                    Run the identical Space engine on isolated Linux VMs with
                    browser VS Code IDE (code-server), team sharing, and
                    persistent endpoints.
                  </p>
                  <a
                    href={SIGN_UP_URL}
                    className="mt-6 inline-flex items-center rounded-lg bg-fd-primary px-5 py-2.5 text-sm font-semibold text-fd-primary-foreground transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-primary"
                  >
                    Start with XO Cloud
                    <span className="icon-[ph--arrow-right-bold] ml-2 size-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Suraj's 4 Layers Definition */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fd-muted-foreground">
              Core Architecture
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
              Environment is the Space. quirqs measure the Output.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-fd-muted-foreground">
              AI labs push endless model token consumption. XO provides the
              decoupled execution plane and output meter to verify real work.
            </p>
          </div>
          <dl className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-fd-foreground">
                1. Runtime (The Machine)
              </dt>
              <dd className="mt-2 text-sm leading-6 text-fd-muted-foreground">
                Where code physically runs: your laptop, on-prem hardware, or an
                XO cloud VM.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-fd-foreground">
                2. Environment (XO Space)
              </dt>
              <dd className="mt-2 text-sm leading-6 text-fd-muted-foreground">
                The <code>cowork-api</code> control plane that holds memory,
                session traces, and file watcher events.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-fd-foreground">
                3. Agent (Unopinionated)
              </dt>
              <dd className="mt-2 text-sm leading-6 text-fd-muted-foreground">
                Any coding agent harness: Claude Code, OpenClaw, Hermes,
                Antigravity, or Cursor.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-fd-foreground">
                4. Output & quirq (The Output Meter)
              </dt>
              <dd className="mt-2 text-sm leading-6 text-fd-muted-foreground">
                Minting verified units of delivered work ($V \cdot B$) scored
                against machine-checkable definitions of done.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Explore Grid */}
      <section className="border-t border-fd-border px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fd-muted-foreground">
            Developer Documentation
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/docs/space/install-space"
              className="rounded-xl border border-fd-border bg-fd-card p-5 transition-colors hover:bg-fd-accent/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-primary"
            >
              <span className="mb-3 flex size-8 items-center justify-center rounded-lg border border-fd-border bg-fd-muted text-fd-primary">
                <span className="icon-[ph--monitor-fill] size-4" />
              </span>
              <span className="font-semibold">Install Space</span>
              <span className="mt-2 block text-sm text-fd-muted-foreground">
                Single curl command setup.
              </span>
            </Link>
            <Link
              href="/docs/space/space-walk"
              className="rounded-xl border border-fd-border bg-fd-card p-5 transition-colors hover:bg-fd-accent/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-primary"
            >
              <span className="mb-3 flex size-8 items-center justify-center rounded-lg border border-fd-border bg-fd-muted text-fd-primary">
                <span className="icon-[ph--map-trifold-fill] size-4" />
              </span>
              <span className="font-semibold">Space UI</span>
              <span className="mt-2 block text-sm text-fd-muted-foreground">
                UI guide for localhost:5002.
              </span>
            </Link>
            <Link
              href="/docs/quirq"
              className="rounded-xl border border-fd-border bg-fd-card p-5 transition-colors hover:bg-fd-accent/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-primary"
            >
              <span className="mb-3 flex size-8 items-center justify-center rounded-lg border border-fd-border bg-fd-muted text-fd-primary">
                <span className="icon-[ph--gauge-fill] size-4" />
              </span>
              <span className="font-semibold">Measure Work (quirq)</span>
              <span className="mt-2 block text-sm text-fd-muted-foreground">
                The output meter for AI.
              </span>
            </Link>
            <Link
              href="/docs"
              className="rounded-xl border border-fd-border bg-fd-card p-5 transition-colors hover:bg-fd-accent/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-primary"
            >
              <span className="mb-3 flex size-8 items-center justify-center rounded-lg border border-fd-border bg-fd-muted text-fd-primary">
                <span className="icon-[ph--book-open-fill] size-4" />
              </span>
              <span className="font-semibold">All Documentation</span>
              <span className="mt-2 block text-sm text-fd-muted-foreground">
                Browse every guide & API spec.
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-fd-border bg-fd-muted/30 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 text-sm text-fd-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>XO Space — Open-source agent workspace & observability engine.</p>
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
