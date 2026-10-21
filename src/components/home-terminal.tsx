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
      text: "Every qq and xo command, replayed. Tap one below, or type it here. Type help for the list.",
    },
  ]);
  const [prompt, setPrompt] = useState("~");
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [last, setLast] = useState<Command | null>(null);
  const [tool, setTool] = useState<"qq" | "xo">("qq");
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
      if (!auto && !window.matchMedia("(min-width: 1024px)").matches)
        termRef.current?.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      const text = typed ?? c.cmd;
      const calm = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
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
      else if (norm(r.recorded) !== norm(text))
        push({ kind: "note", text: `recorded as: ${r.recorded}` });
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
        text: `${cmd.split(" ")[0]}: not in this replay. ${
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

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
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
            logClassName="h-[20rem] sm:h-[24rem] lg:h-[30rem]"
          >
            <div className="flex flex-wrap items-center gap-2 border-t border-fd-border px-3 py-2.5">
              <span className="text-xs text-[var(--term-dim)]">
                {last ? "Try next" : "Start with"}
              </span>
              {next.map((c) => (
                <Chip key={c.id} c={c} disabled={busy} onRun={run} quiet />
              ))}
            </div>
          </Terminal>
        </div>
        <div
          aria-live="polite"
          className="mt-3 flex min-h-16 flex-col gap-1.5 rounded-xl border border-fd-border bg-fd-card px-4 py-3 text-sm sm:flex-row sm:items-start sm:gap-3"
        >
          {last ? (
            <>
              <SourceBadge src={last.src} />
              <p className="min-w-0 flex-1 text-fd-muted-foreground">
                <span className="font-mono text-fd-foreground">{last.cmd}</span>
                {": "}
                {last.what}{" "}
                <Link
                  href={last.more.href}
                  className="whitespace-nowrap font-medium text-fd-primary underline-offset-4 hover:underline"
                >
                  Read more: {last.more.label}
                </Link>
              </p>
            </>
          ) : (
            <p className="text-fd-muted-foreground">
              After each command, this line says what just happened and where to
              read more.
            </p>
          )}
        </div>
      </div>

      <aside
        aria-label="All commands"
        className="min-w-0 rounded-xl border border-fd-border bg-fd-card lg:flex lg:max-h-[38rem] lg:flex-col"
      >
        <div
          role="tablist"
          aria-label="Tool"
          className="flex gap-1 border-b border-fd-border p-1.5"
        >
          {tools.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={tool === t.id}
              aria-controls="tool-panel"
              onClick={() => setTool(t.id)}
              className={`min-h-11 flex-1 rounded-lg px-3 font-mono text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring sm:min-h-9 ${
                tool === t.id
                  ? "bg-fd-primary text-fd-primary-foreground"
                  : "text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-foreground"
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>
        <div
          id="tool-panel"
          role="tabpanel"
          aria-labelledby={`tab-${active.id}`}
          className="flex flex-col gap-4 p-4 lg:overflow-y-auto"
        >
          <p className="text-sm text-fd-muted-foreground">{active.blurb}</p>
          {active.groups.map((g) => (
            <section key={g.title}>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-fd-muted-foreground">
                {g.title}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {g.ids.map((i) => {
                  const c = byId.get(i);
                  return c ? (
                    <Chip key={i} c={c} disabled={busy} onRun={run} />
                  ) : null;
                })}
              </div>
            </section>
          ))}
        </div>
      </aside>
    </div>
  );
}

function Chip({
  c,
  disabled,
  onRun,
  quiet,
}: {
  c: Command;
  disabled: boolean;
  onRun: (id: string) => void;
  quiet?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onRun(c.id)}
      title={c.what}
      className={`inline-flex min-h-11 max-w-full items-center gap-1.5 rounded-lg border px-2.5 py-1 text-left font-mono text-[0.78rem] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring disabled:opacity-60 sm:min-h-8 ${
        quiet
          ? "border-fd-border bg-[var(--term-bar)] text-[var(--term-fg)] hover:border-[var(--term-prompt)]"
          : "border-fd-border bg-fd-background text-fd-foreground hover:border-fd-primary hover:bg-fd-accent"
      }`}
    >
      <span aria-hidden className="text-[var(--term-prompt)]">
        $
      </span>
      <span className="[overflow-wrap:anywhere]">{c.cmd}</span>
      {c.src !== "recorded" && (
        <span className="sr-only">
          {" "}
          ({SOURCE_LABEL[c.src].name.toLowerCase()})
        </span>
      )}
    </button>
  );
}

function SourceBadge({ src }: { src: Source }) {
  return (
    <span
      title={SOURCE_LABEL[src].tip}
      className={`inline-flex h-6 w-fit shrink-0 items-center rounded-full border px-2 text-[0.7rem] font-semibold uppercase tracking-wide ${
        src === "recorded"
          ? "border-fd-primary/40 text-fd-primary"
          : "border-fd-border text-fd-muted-foreground"
      }`}
    >
      {SOURCE_LABEL[src].name}
    </span>
  );
}

function Legend() {
  return (
    <span>
      <strong className="font-semibold">Recorded</strong>: a real run.{" "}
      <strong className="font-semibold">Stand-in</strong>: the real xo CLI and
      server with made-up users.{" "}
      <strong className="font-semibold">Example</strong>: needs GitHub, so
      written from the source.
    </span>
  );
}
