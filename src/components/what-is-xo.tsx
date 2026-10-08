"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { BrandIcon } from "./brand-icon";

// What is XO — 4-layer architecture explainer. Theme-aware (fd-* tokens).
const SIGN_UP_URL = "https://app.xo.builders/sign-up?ref=docs.quirq.dev";
const GITHUB_REPO_URL = "https://github.com/quirq-ai/xo-space";

const ICONS: Record<string, string> = {
  robot: "icon-[ph--robot-fill]",
  chat: "icon-[ph--chat-circle-fill]",
  shield: "icon-[ph--shield-check-fill]",
  slack: "icon-[ph--slack-logo-fill]",
  telegram: "icon-[ph--telegram-logo-fill]",
  whatsapp: "icon-[ph--whatsapp-logo-fill]",
  monitor: "icon-[ph--monitor-fill]",
  user: "icon-[ph--user-plus-fill]",
  rocket: "icon-[ph--rocket-fill]",
  check: "icon-[ph--check-bold]",
  caret: "icon-[ph--caret-down-bold]",
  terminal: "icon-[ph--terminal-window-fill]",
  eye: "icon-[ph--eye-fill]",
  copy: "icon-[ph--copy-bold]",
  blocks: "icon-[ph--squares-four-fill]",
  cpu: "icon-[ph--cpu-fill]",
  gauge: "icon-[ph--gauge-fill]",
  layers: "icon-[ph--stack-fill]",
  git: "icon-[ph--git-fork-fill]",
};

function Icon({ name, className }: { name: string; className?: string }) {
  const cls = ICONS[name] ?? "icon-[ph--circle-fill]";
  return <span className={`${cls} ${className ?? ""}`} aria-hidden="true" />;
}

function AgentChip({
  slug,
  label,
  href,
}: {
  slug: string;
  label: string;
  href?: string;
}) {
  const className =
    "inline-flex items-center gap-1.5 rounded-full border border-fd-border bg-fd-background px-2.5 py-1 text-xs text-fd-foreground";
  if (href) {
    return (
      <a
        href={href}
        className={`${className} transition-colors hover:border-fd-primary/50 hover:bg-fd-muted`}
      >
        <BrandIcon name={slug} size={12} />
        {label}
      </a>
    );
  }
  return (
    <span className={className}>
      <BrandIcon name={slug} size={12} />
      {label}
    </span>
  );
}

function TextChip({ icon, label }: { icon?: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-fd-border bg-fd-background px-2.5 py-1 text-xs text-fd-foreground">
      {icon ? <Icon name={icon} className="size-3.5" /> : null}
      {label}
    </span>
  );
}

type Step = {
  id: string;
  index: string;
  icon: string;
  title: string;
  time: string;
  layer: string;
  summary: string;
  detail: string;
  highlights: string[];
  ctaLabel: string;
  href: string;
  external?: boolean;
  chips?: ReactNode;
};

const STEPS: Step[] = [
  {
    id: "layer-1-runtime",
    index: "01",
    icon: "cpu",
    title: "1. Choose Your Runtime (The Machine)",
    time: "Layer 1",
    layer: "Runtime Layer",
    summary:
      "The machine executing the code: your laptop or a secure cloud VM.",
    detail:
      "Runtime is where code physically runs. You can run locally on your laptop with a single curl command, or provision isolated cloud VMs on XO with 1-click deployments.",
    highlights: [
      "Local OSS: Your machine, Mac Mini, or on-prem server",
      "Managed Cloud: 1-click isolated Linux containers on app.xo.builders",
      "Decoupled so you can run on multiple machines without lock-in",
    ],
    ctaLabel: "Get a Space",
    href: "/docs/space/install-space",
    chips: (
      <>
        <TextChip icon="terminal" label="curl installer" />
        <TextChip icon="cpu" label="Local / Cloud VM" />
      </>
    ),
  },
  {
    id: "layer-2-environment",
    index: "02",
    icon: "blocks",
    title: "2. Boot the Environment (XO Space)",
    time: "Layer 2",
    layer: "Environment Layer",
    summary:
      "The core control plane (cowork-api) holding state and observability.",
    detail:
      "Environment is the Space. It hosts the cowork-api control plane, file watchers, session memory, and the local UI. Decoupling Environment from Runtime lets entire teams share one unified workspace across different machines.",
    highlights: [
      "Serves the zero-dependency UI at http://localhost:5002/space/",
      "Tracks ~/xo-projects/ metadata, todos, and file events in real time",
      "Persistent state survives agent swaps and server restarts",
    ],
    ctaLabel: "Tour Space UI",
    href: "/docs/space/space-walk",
    chips: (
      <>
        <TextChip icon="monitor" label="localhost:5002" />
        <TextChip label="cowork-api daemon" />
        <TextChip icon="layers" label="Team Workspace" />
      </>
    ),
  },
  {
    id: "layer-3-agent",
    index: "03",
    icon: "robot",
    title: "3. Plug in Any Agent (Unopinionated)",
    time: "Layer 3",
    layer: "Agent Layer",
    summary:
      "Auto-discovers Claude Code, OpenClaw, Hermes, Antigravity, Cursor.",
    detail:
      "XO is completely unopinionated about agents. When you boot Space locally, it auto-detects existing CLIs in your $PATH. On Cloud, it provides pre-configured agent templates.",
    highlights: [
      "Auto-detects claude, openclaw, hermes, antigravity, and cursor",
      "Bring your own API key (Anthropic, OpenAI, OpenRouter) or OAuth",
      "Plug new custom agent adapters via BaseAgentAdapter",
    ],
    ctaLabel: "Explore Agent Guides",
    href: "/docs/agents",
    chips: (
      <>
        <AgentChip
          slug="claude-code"
          label="Claude Code"
          href="/docs/agents/claude-code"
        />
        <AgentChip
          slug="openclaw"
          label="OpenClaw"
          href="/docs/agents/openclaw"
        />
        <AgentChip slug="hermes" label="Hermes" href="/docs/agents/hermes" />
        <AgentChip
          slug="antigravity"
          label="Antigravity"
          href="/docs/agents/antigravity"
        />
      </>
    ),
  },
  {
    id: "layer-4-observability",
    index: "04",
    icon: "activity",
    title: "4. Live Observability & Telemetry (Session Traces)",
    time: "Layer 4",
    layer: "Observability Layer",
    summary:
      "Live trace streams, multi-runtime telemetry, and 3D session replay.",
    detail:
      "Monitor every coding agent in real time. Space normalizes session traces, token volumes, latency percentiles, and tool invocations across Claude Code, Codex, and Cursor into one unified control plane.",
    highlights: [
      "Real-time session trace streaming & token/cost telemetry",
      "Unified multi-runtime monitoring across Claude Code, Codex, and Cursor",
      "3D spatial session replays over interactive repository citymaps",
    ],
    ctaLabel: "Explore Observability",
    href: "/docs/space/observability",
    chips: (
      <>
        <TextChip icon="eye" label="Live Tracing" />
        <TextChip label="Token Telemetry" />
        <TextChip label="3D Session Replay" />
      </>
    ),
  },
];

const SCROLL_LOCK_MS = 2200;
const SCROLL_DEBOUNCE_MS = 220;
const SCROLL_HYSTERESIS = 0.12;

function StepConnector({ lit }: { lit: boolean }) {
  return (
    <div className="flex flex-col items-center py-3" aria-hidden="true">
      <div
        className={`h-7 w-px transition-colors duration-500 motion-reduce:transition-none ${
          lit ? "bg-fd-primary/60" : "bg-fd-border"
        }`}
      />
      <span
        className={`icon-[ph--arrow-down-bold] size-4 transition-colors duration-500 motion-reduce:transition-none ${
          lit ? "text-fd-primary" : "text-fd-muted-foreground/50"
        }`}
      />
      <div
        className={`h-7 w-px transition-colors duration-500 motion-reduce:transition-none ${
          lit ? "bg-fd-primary/60" : "bg-fd-border"
        }`}
      />
    </div>
  );
}

function FourLayersExplainer() {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const userLockedUntil = useRef(0);
  const activeRef = useRef(active);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  activeRef.current = active;

  const selectStep = useCallback((index: number, source: "user" | "scroll") => {
    if (source === "user") {
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
        scrollTimer.current = null;
      }
      userLockedUntil.current = Date.now() + SCROLL_LOCK_MS;
      setActive(index);
      return;
    }
    if (Date.now() < userLockedUntil.current) return;
    if (activeRef.current === index) return;
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      scrollTimer.current = null;
      if (Date.now() < userLockedUntil.current) return;
      if (activeRef.current === index) return;
      setActive(index);
    }, SCROLL_DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const ratios = new Map<number, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const idx = Number((entry.target as HTMLElement).dataset.stepIndex);
          if (Number.isNaN(idx)) continue;
          ratios.set(idx, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        let best = -1;
        let bestRatio = 0;
        for (const [idx, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = idx;
          }
        }
        if (best < 0 || bestRatio <= 0) return;

        const current = activeRef.current;
        const currentRatio = ratios.get(current) ?? 0;
        if (best !== current && bestRatio < currentRatio + SCROLL_HYSTERESIS) {
          return;
        }
        selectStep(best, "scroll");
      },
      {
        root: null,
        rootMargin: "-42% 0px -42% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const el of stepRefs.current) {
      if (el) observer.observe(el);
    }

    return () => {
      observer.disconnect();
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, [selectStep]);

  const goToStep = (index: number) => {
    selectStep(index, "user");
    const el = stepRefs.current[index];
    if (!el) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    el.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "center",
    });
  };

  return (
    <div className="mt-10">
      <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">
        The 4-Layer Agentic Architecture
      </p>

      {/* Progress rail */}
      <div
        className="mb-4 flex items-center justify-center gap-1.5"
        aria-hidden="true"
      >
        {STEPS.map((step, i) => (
          <button
            key={step.id}
            type="button"
            onClick={() => goToStep(i)}
            className={`h-1.5 rounded-full transition-[width,background-color] duration-500 ease-out motion-reduce:transition-none ${
              i === active
                ? "w-8 bg-fd-primary"
                : i < active
                  ? "w-4 bg-fd-primary/50"
                  : "w-4 bg-fd-border"
            }`}
            aria-label={`Go to ${step.layer}: ${step.title}`}
          />
        ))}
      </div>

      <ol className="mx-auto flex max-w-2xl flex-col">
        {STEPS.map((step, i) => {
          const isActive = i === active;
          const isDone = i < active;
          const panelId = `${baseId}-panel-${step.id}`;
          const headerId = `${baseId}-header-${step.id}`;

          return (
            <li
              key={step.id}
              ref={(node) => {
                stepRefs.current[i] = node;
              }}
              data-step-index={i}
              className="scroll-mt-28"
            >
              <div
                className={`rounded-2xl border bg-fd-card transition-[border-color,box-shadow,background-color] duration-500 ease-out motion-reduce:transition-none ${
                  isActive
                    ? "border-fd-primary/50 shadow-sm ring-1 ring-fd-primary/15"
                    : isDone
                      ? "border-fd-border/80 bg-fd-card/80"
                      : "border-fd-border hover:border-fd-primary/30"
                }`}
              >
                <button
                  type="button"
                  id={headerId}
                  aria-expanded={isActive}
                  aria-controls={panelId}
                  onClick={() => goToStep(i)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left sm:px-5"
                >
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold transition-colors duration-500 motion-reduce:transition-none ${
                      isDone
                        ? "bg-fd-primary text-fd-primary-foreground"
                        : isActive
                          ? "bg-fd-primary/10 text-fd-primary"
                          : "bg-fd-muted text-fd-muted-foreground"
                    }`}
                  >
                    {isDone ? (
                      <Icon name="check" className="size-4" />
                    ) : (
                      <Icon name={step.icon} className="size-5" />
                    )}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-fd-muted-foreground">
                        {step.layer}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          isDone
                            ? "text-fd-muted-foreground line-through decoration-fd-border"
                            : "text-fd-foreground"
                        }`}
                      >
                        {step.title}
                      </span>
                      <span className="rounded-full bg-fd-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-fd-muted-foreground">
                        {step.time}
                      </span>
                    </span>
                    {!isActive ? (
                      <span className="mt-0.5 block truncate text-xs text-fd-muted-foreground">
                        {step.summary}
                      </span>
                    ) : null}
                  </span>

                  <Icon
                    name="caret"
                    className={`size-4 shrink-0 text-fd-muted-foreground transition-transform duration-500 ease-out motion-reduce:transition-none ${
                      isActive ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <section
                  id={panelId}
                  aria-labelledby={headerId}
                  className={`grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none ${
                    isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-fd-border px-4 pb-4 pt-3 sm:px-5">
                      <p className="text-sm leading-relaxed text-fd-muted-foreground">
                        {step.detail}
                      </p>

                      <ul className="mt-3 space-y-1.5">
                        {step.highlights.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 text-xs text-fd-foreground"
                          >
                            <Icon
                              name="check"
                              className="mt-0.5 size-3.5 shrink-0 text-fd-primary"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      {step.chips ? (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {step.chips}
                        </div>
                      ) : null}

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <a
                          href={step.href}
                          {...(step.external
                            ? {
                                target: "_blank",
                                rel: "noopener noreferrer",
                              }
                            : {})}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-fd-primary px-3.5 py-2 text-sm font-semibold text-fd-primary-foreground transition-opacity hover:opacity-90"
                        >
                          {step.ctaLabel}
                          {step.external ? (
                            <span
                              className="icon-[ph--arrow-square-out-bold] size-3.5"
                              aria-hidden="true"
                            />
                          ) : (
                            <span
                              className="icon-[ph--arrow-right-bold] size-3.5"
                              aria-hidden="true"
                            />
                          )}
                        </a>
                        {i < STEPS.length - 1 ? (
                          <button
                            type="button"
                            onClick={() => goToStep(i + 1)}
                            className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-fd-muted-foreground transition-colors hover:bg-fd-muted hover:text-fd-foreground"
                          >
                            Next layer
                            <span
                              className="icon-[ph--caret-right-bold] size-3.5"
                              aria-hidden="true"
                            />
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {i < STEPS.length - 1 ? (
                <StepConnector lit={i <= active} />
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// What is XO — developer explainer for home page.
export function WhatIsXO() {
  const [copied, setCopied] = useState(false);
  const curlCmd = "curl -fsSL https://quirq.ai/install | sh";

  const copyCommand = () => {
    navigator.clipboard.writeText(curlCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="not-prose mb-14">
      <div className="mx-auto mb-8 max-w-3xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-muted/50 px-3 py-1 text-xs font-medium text-fd-foreground">
          <BrandIcon name="quirq" size={14} />
          <span>XO Space is Open Source</span>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-fd-primary hover:underline"
          >
            GitHub Repo →
          </a>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-fd-foreground sm:text-5xl">
          A place for your AI agents to work.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-fd-muted-foreground sm:text-base">
          XO Space runs on your computer or in the cloud. It shows what your
          agents are doing in one place: Claude Code, OpenClaw, Hermes,
          Antigravity, Codex or Cursor.
        </p>
      </div>

      {/* Hero Dual CTA */}
      <div className="mx-auto flex max-w-2xl flex-col items-stretch gap-4">
        {/* Terminal Install Snippet */}
        <div className="flex items-center justify-between gap-3 rounded-xl border border-fd-border bg-fd-card p-3 shadow-sm sm:px-4 sm:py-3">
          <div className="flex items-center gap-2 overflow-x-auto font-mono text-xs text-fd-foreground sm:text-sm">
            <span className="text-fd-primary font-bold">$</span>
            <code className="text-fd-foreground">{curlCmd}</code>
          </div>
          <button
            type="button"
            onClick={copyCommand}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-fd-border bg-fd-muted px-2.5 py-1.5 text-xs font-medium text-fd-foreground transition-colors hover:bg-fd-accent"
            aria-label="Copy install command"
          >
            {copied ? (
              <>
                <Icon name="check" className="size-3.5 text-fd-primary" />
                <span className="text-fd-primary">Copied</span>
              </>
            ) : (
              <>
                <Icon
                  name="copy"
                  className="size-3.5 text-fd-muted-foreground"
                />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Buttons Row */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="/docs/space"
            className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-5 py-2.5 text-sm font-semibold text-fd-primary-foreground transition-opacity hover:opacity-90"
          >
            <Icon name="terminal" className="size-4" />
            Install on my computer
          </a>
          <a
            href={SIGN_UP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-5 py-2.5 text-sm font-semibold text-fd-foreground transition-colors hover:bg-fd-muted"
          >
            <Icon name="rocket" className="size-4" />
            Use XO Cloud
          </a>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-4 py-2.5 text-sm font-semibold text-fd-foreground transition-colors hover:bg-fd-muted"
          >
            <BrandIcon name="github" size={16} />
            GitHub
          </a>
        </div>
      </div>

      <FourLayersExplainer />

      <div className="mt-8 flex flex-col items-center gap-2 rounded-2xl border border-fd-primary/20 bg-fd-primary/5 px-5 py-4 text-center sm:flex-row sm:justify-center sm:gap-3">
        <Icon name="shield" className="size-5 shrink-0 text-fd-primary" />
        <span className="text-xs font-medium leading-relaxed text-fd-foreground sm:text-sm">
          Space keeps your projects and history when you switch agents or
          restart.
        </span>
      </div>
    </section>
  );
}
