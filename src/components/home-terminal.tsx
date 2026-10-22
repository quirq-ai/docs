"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type Line,
  type Recording,
  type Replay,
  replays,
  Terminal,
} from "@/components/journey";
import { buttonVariants } from "@/components/ui/button";
import {
  type Command,
  commands,
  examples,
  type Source,
  tools,
} from "@/journeys/home-commands";
import qqRecording from "@/journeys/home-qq.json";
import xoRecording from "@/journeys/home-xo.json";

// The docs home page: one big terminal that replays every qq and xo command.
// Tap a command and it types itself and plays back what it printed; or type
// one. Nothing typed here runs anywhere. See src/journeys/home-commands.ts
// for where each command's output comes from.

const norm = (s: string) => s.trim().replace(/\s+/g, " ");
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const byId = new Map(commands.map((c) => [c.id, c]));

export const SOURCE_LABEL: Record<Source, { name: string; tip: string }> = {
  recorded: {
    name: "Recorded",
    tip: "A real run on Linux, 2026-10-21, with long waits cut short.",
  },
  "stand-in": {
    name: "Stand-in",
    tip: "The real xo CLI and xo server, run against made-up users on the recording machine, so no account was touched. The stand-in's address is shown as xo.quirq.dev.",
  },
  example: {
    name: "Example",
    tip: "Not a run: this needs GitHub, gh or ghcr.io, so the output is written from qq's or xo's source, with a made-up pull request and commit.",
  },
};

function allReplays(): Record<string, Replay> {
  const shown = Object.fromEntries(commands.map((c) => [c.id, c.cmd]));
  const out = {
    ...replays(qqRecording as Recording, shown),
    ...replays(xoRecording as Recording, shown),
  };
  for (const [id, e] of Object.entries(examples))
    out[id] = {
      prompt: e.prompt,
      shown: shown[id] ?? id,
      recorded: shown[id] ?? id,
      // One line at a time, as a terminal would show it.
      out: e.out
        .split(/(?<=\n)/)
        .map((text, i) => ({ dt: i === 0 ? 0.6 : 0.15, text })),
      code: e.code,
    };
  return out;
}

const START = ["qq-version", "qq-test", "xo-login"];

export function HomeTerminal() {
  const reps = useMemo(allReplays, []);
  const accepts = useMemo(() => {
    const m = new Map<string, string>();
    for (const c of commands) {
      const r = reps[c.id];
      for (const a of [c.cmd, r?.recorded, ...(c.accept ?? [])])
        if (a) m.set(norm(a), c.id);
    }
    return m;
  }, [reps]);

  const [lines, setLines] = useState<Line[]>([
    {
      kind: "note",
      text: `${commands.length} commands, replayed. Tap one below, or type it here. Type help for the list.`,
    },
  ]);
  const [prompt, setPrompt] = useState("~");
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [last, setLast] = useState<Command | null>(null);
  const [tool, setTool] = useState<"qq" | "xo">("qq");
  const [moreBelow, setMoreBelow] = useState(true);
  const panel = useRef<HTMLDivElement>(null);
  const checkMore = useCallback(() => {
    const el = panel.current;
    if (el) setMoreBelow(el.scrollTop + el.clientHeight < el.scrollHeight - 8);
  }, []);
  // A new tab starts at its top; the fade then shows whether it has more below.
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs when the tab changes
  useEffect(() => {
    if (panel.current) panel.current.scrollTop = 0;
    checkMore();
  }, [tool, checkMore]);
  const stop = useRef(false);
  const termRef = useRef<HTMLDivElement>(null);

  const push = useCallback((l: Line) => setLines((ls) => [...ls, l]), []);

  const run = useCallback(
    async (id: string, typed?: string, auto = false) => {
      const c = byId.get(id);
      const r = reps[id];
      if (!c || !r || busy) return;
      setBusy(true);
      stop.current = false;
      setTool(id.startsWith("xo") ? "xo" : "qq");
      const calm = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (!auto && !window.matchMedia("(min-width: 1024px)").matches)
        termRef.current?.scrollIntoView({
          block: "nearest",
          behavior: calm ? "auto" : "smooth",
        });
      const text = typed ?? c.cmd;
      if (typed || calm) push({ kind: "cmd", prompt: r.prompt, text });
      else {
        // A tapped command types itself.
        push({ kind: "cmd", prompt: r.prompt, text: "" });
        for (let i = 1; i <= text.length; i += 2) {
          await sleep(18);
          const part = text.slice(0, i);
          setLines((ls) => [
            ...ls.slice(0, -1),
            { ...ls[ls.length - 1], text: part },
          ]);
        }
        setLines((ls) => [...ls.slice(0, -1), { ...ls[ls.length - 1], text }]);
      }
      if (c.src === "example")
        push({
          kind: "note",
          text: "example: written from the source, not a recorded run",
        });
      else {
        if (c.src === "stand-in")
          push({
            kind: "note",
            text: "stand-in: the real xo against made-up users on 127.0.0.1, shown here as https://xo.quirq.dev",
          });
        if (norm(r.recorded) !== norm(text))
          push({ kind: "note", text: `recorded as: ${r.recorded}` });
      }
      for (const o of r.out) {
        // Real timings, but no single wait longer than 1.5 s.
        await sleep(Math.min(o.dt, 1.5) * 1000);
        if (stop.current) break;
        setLines((ls) => {
          const end = ls[ls.length - 1];
          if (end?.kind === "out")
            return [...ls.slice(0, -1), { ...end, text: end.text + o.text }];
          return [...ls, { kind: "out", text: o.text }];
        });
      }
      if (stop.current) push({ kind: "note", text: "^C" });
      else if (r.code > 0) push({ kind: "note", text: `exit ${r.code}` });
      setPrompt(r.prompt);
      setLast(c);
      setBusy(false);
    },
    [reps, busy, push],
  );

  // Play one short command on arrival, so the terminal shows what it does.
  const runRef = useRef(run);
  runRef.current = run;
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(
      () => void runRef.current("qq-version", undefined, true),
      700,
    );
    return () => clearTimeout(t);
  }, []);

  const onCommand = useCallback(
    (raw: string) => {
      const cmd = norm(raw);
      if (!cmd) return;
      const id = accepts.get(cmd);
      if (id) return void run(id, cmd);
      push({ kind: "cmd", prompt, text: cmd });
      if (cmd === "clear") return setLines([]);
      if (cmd === "help")
        return push({
          kind: "note",
          text: `This terminal replays these commands:\n${tools
            .flatMap((t) => t.groups.flatMap((g) => g.ids))
            .map((i) => `  ${byId.get(i)?.cmd}`)
            .join("\n")}`,
        });
      if (cmd === "pwd") return push({ kind: "out", text: `${prompt}\n` });
      const near = commands.find((c) => c.cmd.startsWith(cmd.split(" ")[0]));
      push({
        kind: "note",
        text: `${cmd}: not in this replay. ${
          near ? `Try ${near.cmd}, or type help.` : "Type help for the list."
        }`,
      });
    },
    [accepts, run, push, prompt],
  );

  const next = (last?.next ?? START)
    .map((i) => byId.get(i))
    .filter((c): c is Command => !!c);
  const active = tools.find((t) => t.id === tool) ?? tools[0];

  // Left and Right move between the tool tabs (the WAI-ARIA tabs pattern).
  const onTabKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const i = tools.findIndex((t) => t.id === tool);
    const to =
      tools[
        (i + (e.key === "ArrowRight" ? 1 : -1) + tools.length) % tools.length
      ];
    setTool(to.id);
    document.getElementById(`tab-${to.id}`)?.focus();
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-6">
      <div className="min-w-0">
        <div ref={termRef} className="scroll-mt-4 scroll-mb-4">
          <Terminal
            lines={lines}
            prompt={prompt}
            busy={busy}
            value={value}
            setValue={setValue}
            history={history}
            setHistory={setHistory}
            onCommand={onCommand}
            onStop={() => {
              stop.current = true;
            }}
            title="qq and xo"
            recordedOn={
              <>
                Nothing you type runs anywhere. <Legend />
              </>
            }
            logClassName="h-[15rem] sm:h-[19rem] lg:h-[22rem]"
          >
            <div
              aria-live="polite"
              className="flex min-h-12 flex-col gap-1 border-t border-fd-border px-3 py-2.5 text-[0.8rem] leading-relaxed sm:flex-row sm:items-baseline sm:gap-2"
            >
              {last ? (
                <>
                  <SourceBadge src={last.src} />
                  <p className="min-w-0 flex-1 text-[var(--term-dim)]">
                    <code className="font-mono text-[var(--term-fg)] [overflow-wrap:anywhere]">
                      {last.cmd}
                    </code>
                    : {last.what}{" "}
                    <Link
                      href={last.more.href}
                      className="whitespace-nowrap font-medium text-[var(--term-fg)] underline underline-offset-4 decoration-[var(--term-dim)] hover:decoration-[var(--term-fg)]"
                    >
                      {last.more.label} →
                    </Link>
                  </p>
                </>
              ) : (
                <p className="text-[var(--term-dim)]">
                  After each command, this line says what happened and where to
                  read more.
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-1.5 border-t border-fd-border px-3 py-2">
              <span className="me-1 text-xs text-[var(--term-dim)]">
                {last ? "Next" : "Start with"}
              </span>
              {next.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  disabled={busy}
                  onClick={() => run(c.id)}
                  title={c.what}
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                    className:
                      "min-h-11 max-w-full justify-start border-fd-border bg-[var(--term-bg)] text-left font-mono font-normal text-[var(--term-fg)] sm:min-h-8",
                  })}
                >
                  <span className="min-w-0 [overflow-wrap:anywhere]">
                    {c.cmd}
                  </span>
                  <SrSource src={c.src} />
                </button>
              ))}
            </div>
          </Terminal>
        </div>
      </div>

      {/* On desktop the list takes the terminal's height; on a phone it is capped. Either way
          it scrolls inside, with a fade while more is below. */}
      <div className="relative min-w-0">
        <aside
          aria-label="Commands in this replay"
          className="relative flex flex-col overflow-hidden rounded-xl border border-fd-border bg-fd-card lg:absolute lg:inset-0"
        >
          <div className="border-b border-fd-border p-2">
            <div
              role="tablist"
              aria-label="Tool"
              onKeyDown={onTabKey}
              className="grid grid-cols-2 gap-1 rounded-lg bg-fd-muted p-1"
            >
              {tools.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  id={`tab-${t.id}`}
                  aria-selected={tool === t.id}
                  aria-controls="tool-panel"
                  tabIndex={tool === t.id ? 0 : -1}
                  onClick={() => setTool(t.id)}
                  className={buttonVariants({
                    variant: "ghost",
                    className: `min-h-11 font-mono sm:min-h-8 sm:py-1 ${
                      tool === t.id
                        ? "bg-fd-background text-fd-foreground shadow-sm hover:bg-fd-background"
                        : "text-fd-muted-foreground"
                    }`,
                  })}
                >
                  {t.title}
                </button>
              ))}
            </div>
            <p className="px-1 pt-2 text-xs text-fd-muted-foreground">
              {active.blurb}
            </p>
          </div>
          <div
            id="tool-panel"
            role="tabpanel"
            aria-labelledby={`tab-${active.id}`}
            ref={panel}
            onScroll={checkMore}
            className="flex max-h-[24rem] flex-col gap-3 overflow-y-auto p-2 lg:max-h-none lg:min-h-0 lg:flex-1"
          >
            {active.groups.map((g) => (
              <section key={g.title}>
                <h3 className="px-2 pb-1 text-xs font-medium text-fd-muted-foreground">
                  {g.title}
                </h3>
                <ul>
                  {g.ids.map((i) => {
                    const c = byId.get(i);
                    if (!c) return null;
                    const current = last?.id === c.id;
                    return (
                      <li key={i}>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => run(c.id)}
                          aria-current={current ? "true" : undefined}
                          className={buttonVariants({
                            variant: "ghost",
                            className: `min-h-11 w-full justify-start gap-2 text-left font-mono text-[0.8rem] font-normal sm:min-h-8 sm:py-1 ${
                              current
                                ? "bg-fd-accent text-fd-accent-foreground"
                                : "text-fd-foreground"
                            }`,
                          })}
                        >
                          <span className="min-w-0 [overflow-wrap:anywhere]">
                            {c.cmd}
                          </span>
                          {c.src !== "recorded" && (
                            <span
                              aria-hidden
                              className="ms-auto shrink-0 font-sans text-[0.68rem] text-fd-muted-foreground"
                            >
                              {SOURCE_LABEL[c.src].name}
                            </span>
                          )}
                          <SrSource src={c.src} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-x-0 bottom-0 h-12 rounded-b-xl bg-gradient-to-t from-fd-card to-transparent transition-opacity ${
              moreBelow ? "opacity-100" : "opacity-0"
            }`}
          />
        </aside>
      </div>
    </div>
  );
}

function SrSource({ src }: { src: Source }) {
  return src === "recorded" ? null : (
    <span className="sr-only"> ({SOURCE_LABEL[src].name.toLowerCase()})</span>
  );
}

function SourceBadge({ src }: { src: Source }) {
  return (
    <span
      title={SOURCE_LABEL[src].tip}
      className="inline-flex w-fit shrink-0 items-center gap-1.5 text-[0.7rem] font-medium text-[var(--term-fg)]"
    >
      <span
        aria-hidden
        className={`size-1.5 rounded-full ${
          src === "recorded"
            ? "bg-[var(--term-prompt)]"
            : "bg-[var(--term-dim)]"
        }`}
      />
      {SOURCE_LABEL[src].name}
    </span>
  );
}

function Legend() {
  return (
    <span>
      <strong className="font-semibold">Recorded</strong>: a real run.{" "}
      <strong className="font-semibold">Stand-in</strong>: the real xo CLI and
      server with made-up users on the recording machine, its address shown as
      xo.quirq.dev. <strong className="font-semibold">Example</strong>: needs
      GitHub, so written from the source.
    </span>
  );
}
