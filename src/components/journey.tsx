"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { buttonVariants } from "./ui/button";

// A guided journey: numbered steps beside a terminal. The terminal replays a
// real run recorded by scripts/videos/recorder.py (see scripts/journeys/):
// typing or tapping a step's command plays back what that command printed,
// with its timings. Nothing typed here runs anywhere; "Run it for real" opens
// a Codespace where it does.

type RecEvent =
  | { k: "say"; text: string }
  | { k: "cmd"; prompt: string; text: string; id?: string; accept?: string[] }
  | { k: "out"; dt: number; text: string }
  | { k: "end"; dt: number; code: number };

export type Recording = { title: string; events: RecEvent[] };

type Line = { kind: "cmd" | "out" | "note"; prompt?: string; text: string };

type Replay = {
  prompt: string;
  shown: string;
  recorded: string;
  out: { dt: number; text: string }[];
  code: number;
};

type JourneyState = {
  active: string;
  done: Set<string>;
  wide: boolean;
  busy: boolean;
  select: (id: string) => void;
  run: (id: string, typed?: string) => void;
  terminal: ReactNode;
};

const Ctx = createContext<JourneyState | null>(null);

const norm = (s: string) => s.trim().replace(/\s+/g, " ");

// Each recorded command, keyed by its step id, with what it printed.
function replays(rec: Recording, shownFor: Record<string, string>) {
  const out: Record<string, Replay> = {};
  let cur: { id: string; r: Replay } | null = null;
  for (const e of rec.events) {
    if (e.k === "cmd") {
      const id = e.id ?? e.text;
      cur = {
        id,
        r: {
          prompt: e.prompt,
          shown: shownFor[id] ?? e.text,
          recorded: e.text,
          out: [],
          code: 0,
        },
      };
    } else if (e.k === "out" && cur) {
      cur.r.out.push({ dt: e.dt, text: e.text });
    } else if (e.k === "end" && cur) {
      cur.r.code = e.code;
      out[cur.id] = cur.r;
      cur = null;
    }
  }
  return out;
}

function useWide() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const q = window.matchMedia("(min-width: 1024px)");
    const on = () => setWide(q.matches);
    on();
    q.addEventListener("change", on);
    return () => q.removeEventListener("change", on);
  }, []);
  return wide;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function Journey({
  recording,
  steps,
  realUrl,
  recordedOn,
  children,
}: {
  recording: Recording;
  /** step id -> the command a reader types, in the order of the guide */
  steps: { id: string; cmd: string }[];
  /** where "Run it for real" goes: a Codespace with the tools installed */
  realUrl: string;
  /** when and where the recording was made, shown under the terminal */
  recordedOn: string;
  children: ReactNode;
}) {
  const shownFor = useMemo(
    () => Object.fromEntries(steps.map((s) => [s.id, s.cmd])),
    [steps],
  );
  const reps = useMemo(
    () => replays(recording, shownFor),
    [recording, shownFor],
  );
  const accepts = useMemo(() => {
    const m = new Map<string, string>();
    for (const e of recording.events) {
      if (e.k !== "cmd") continue;
      const id = e.id ?? e.text;
      for (const a of [e.text, shownFor[id], ...(e.accept ?? [])])
        if (a) m.set(norm(a), id);
    }
    return m;
  }, [recording, shownFor]);

  const [active, setActive] = useState(steps[0]?.id ?? "");
  const [done, setDone] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [lines, setLines] = useState<Line[]>([
    {
      kind: "note",
      text: "Replay of a real run. Type a command from the steps, or press Run on a step. Type help for more.",
    },
  ]);
  const [prompt, setPrompt] = useState(reps[steps[0]?.id]?.prompt ?? "~");
  const wide = useWide();
  const stop = useRef(false);

  const push = useCallback((l: Line) => setLines((ls) => [...ls, l]), []);

  const run = useCallback(
    async (id: string, typed?: string) => {
      const r = reps[id];
      if (!r || busy) return;
      setBusy(true);
      stop.current = false;
      setActive(id);
      push({ kind: "cmd", prompt: r.prompt, text: typed ?? r.shown });
      if (norm(r.recorded) !== norm(typed ?? r.shown))
        push({ kind: "note", text: `recorded as: ${r.recorded}` });
      for (const o of r.out) {
        // Real timings, but no single wait longer than 1.5 s.
        await sleep(Math.min(o.dt, 1.5) * 1000);
        if (stop.current) break;
        setLines((ls) => {
          const last = ls[ls.length - 1];
          if (last?.kind === "out")
            return [...ls.slice(0, -1), { ...last, text: last.text + o.text }];
          return [...ls, { kind: "out", text: o.text }];
        });
      }
      if (stop.current) push({ kind: "note", text: "^C" });
      else if (r.code < 0)
        push({
          kind: "note",
          text: "(stopped here; on your machine it keeps running until Ctrl-C)",
        });
      const i = steps.findIndex((s) => s.id === id);
      const next = steps[i + 1]?.id;
      setPrompt(next ? (reps[next]?.prompt ?? r.prompt) : r.prompt);
      setDone((d) => new Set(d).add(id));
      if (next) setActive(next);
      setBusy(false);
    },
    [reps, busy, push, steps],
  );

  const onCommand = useCallback(
    (raw: string) => {
      const cmd = norm(raw);
      if (!cmd) return;
      const id = accepts.get(cmd);
      if (id) return run(id, cmd);
      push({ kind: "cmd", prompt, text: cmd });
      if (cmd === "clear") return setLines([]);
      if (cmd === "help")
        return push({
          kind: "note",
          text: `This terminal replays a real run of this guide. It knows these commands:\n${steps
            .map((s) => `  ${s.cmd}`)
            .join("\n")}\nTo run anything else, use "Run it for real" below.`,
        });
      if (cmd === "pwd") return push({ kind: "out", text: `${prompt}\n` });
      if (cmd === "cd" || cmd.startsWith("cd ")) {
        const to = cmd.slice(3).replace(/\/$/, "") || "~";
        const known = [...new Set(Object.values(reps).map((r) => r.prompt))];
        const hit = known.find(
          (p) => p === to || p.endsWith(`/${to}`) || p === `${prompt}/${to}`,
        );
        if (hit) return setPrompt(hit);
        return push({
          kind: "note",
          text: `cd: ${to}: not a folder in this replay`,
        });
      }
      push({
        kind: "note",
        text: `${cmd.split(" ")[0]}: not in this replay. Only the guide's commands are recorded here; "Run it for real" opens a machine where anything runs.`,
      });
    },
    [accepts, run, push, prompt, steps, reps],
  );

  const terminal = (
    <Terminal
      lines={lines}
      prompt={prompt}
      busy={busy}
      onCommand={onCommand}
      onStop={() => {
        stop.current = true;
      }}
      title={recording.title}
      realUrl={realUrl}
      recordedOn={recordedOn}
    />
  );

  const state: JourneyState = {
    active,
    done,
    wide,
    busy,
    select: setActive,
    run: (id, typed) => void run(id, typed),
    terminal,
  };

  return (
    <Ctx.Provider value={state}>
      <div className="not-prose my-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <ol className="flex min-w-0 flex-col gap-3">{children}</ol>
        {wide && (
          <aside className="min-w-0">
            <div className="sticky top-24">{terminal}</div>
          </aside>
        )}
      </div>
    </Ctx.Provider>
  );
}

export function JourneyStep({
  id,
  n,
  title,
  children,
}: {
  id: string;
  n: number;
  title: string;
  children: ReactNode;
}) {
  const j = useContext(Ctx);
  if (!j) throw new Error("JourneyStep must be inside Journey");
  const isActive = j.active === id;
  const isDone = j.done.has(id);
  return (
    <li
      className={`rounded-xl border bg-fd-card p-4 text-sm leading-relaxed transition-colors ${
        isActive ? "border-fd-primary" : "border-fd-border"
      }`}
      aria-current={isActive ? "step" : undefined}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
            isDone
              ? "border-fd-primary bg-fd-primary text-fd-primary-foreground"
              : "border-fd-border text-fd-muted-foreground"
          }`}
        >
          {isDone ? "✓" : n}
        </span>
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => j.select(id)}
            className="text-left text-base font-semibold text-fd-foreground hover:underline"
          >
            {title}
            {isDone && <span className="sr-only"> (done)</span>}
          </button>
          <div className="journey-body mt-1 text-fd-muted-foreground [&_code]:rounded [&_code]:bg-fd-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.85em] [&_code]:text-fd-foreground [&_p]:my-2">
            {children}
          </div>
          <button
            type="button"
            disabled={j.busy}
            onClick={() => j.run(id)}
            className={buttonVariants({
              variant: isActive ? "primary" : "outline",
              className: "mt-2 min-h-11 px-4",
            })}
          >
            Run this step
          </button>
        </div>
      </div>
      {!j.wide && isActive && <div className="mt-4">{j.terminal}</div>}
    </li>
  );
}

function Terminal({
  lines,
  prompt,
  busy,
  onCommand,
  onStop,
  title,
  realUrl,
  recordedOn,
}: {
  lines: Line[];
  prompt: string;
  busy: boolean;
  onCommand: (cmd: string) => void;
  onStop: () => void;
  title: string;
  realUrl: string;
  recordedOn: string;
}) {
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const box = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll whenever a line lands
  useEffect(() => {
    box.current?.scrollTo({ top: box.current.scrollHeight });
  }, [lines]);

  return (
    <div className="overflow-hidden rounded-xl border border-fd-border bg-neutral-950 text-neutral-100 shadow-sm">
      <div className="flex items-center gap-2 border-b border-neutral-800 px-3 py-2 text-xs text-neutral-400">
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-neutral-700" />
          <span className="size-2.5 rounded-full bg-neutral-700" />
          <span className="size-2.5 rounded-full bg-neutral-700" />
        </span>
        <span className="truncate">{title}</span>
        <span className="ms-auto shrink-0 rounded border border-neutral-700 px-1.5 py-0.5 text-[0.7rem] uppercase tracking-wide">
          replay
        </span>
      </div>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: a click anywhere in the terminal focuses its input, as in a real terminal; the input itself is the keyboard path */}
      <div
        ref={box}
        role="log"
        aria-label="Terminal output"
        className="h-[22rem] overflow-y-auto px-3 py-3 font-mono text-[0.8rem] leading-relaxed lg:h-[28rem]"
        onClick={() => input.current?.focus()}
      >
        {lines.map((l, i) => (
          <pre
            // biome-ignore lint/suspicious/noArrayIndexKey: lines only ever append
            key={i}
            className={`whitespace-pre-wrap break-words ${
              l.kind === "note" ? "text-neutral-400" : ""
            }`}
          >
            {l.kind === "cmd" ? (
              <>
                <span className="text-emerald-400">{l.prompt}</span>
                <span className="text-neutral-400"> $ </span>
                {l.text}
              </>
            ) : l.kind === "note" ? (
              `# ${l.text}`
            ) : (
              l.text
            )}
          </pre>
        ))}
        <form
          className="flex items-center"
          onSubmit={(e) => {
            e.preventDefault();
            if (busy) return;
            if (value.trim()) setHistory((h) => [...h, value]);
            setHi(-1);
            onCommand(value);
            setValue("");
          }}
        >
          <span className="shrink-0 text-emerald-400">{prompt}</span>
          <span className="shrink-0 text-neutral-400">&nbsp;$&nbsp;</span>
          <input
            ref={input}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "c" && e.ctrlKey && busy) {
                e.preventDefault();
                onStop();
              } else if (e.key === "ArrowUp" && history.length) {
                e.preventDefault();
                const n = hi < 0 ? history.length - 1 : Math.max(0, hi - 1);
                setHi(n);
                setValue(history[n]);
              } else if (e.key === "ArrowDown" && hi >= 0) {
                e.preventDefault();
                const n = hi + 1;
                setHi(n < history.length ? n : -1);
                setValue(n < history.length ? history[n] : "");
              }
            }}
            aria-label="Type a command"
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent font-mono text-[16px] text-neutral-100 caret-emerald-400 outline-none sm:text-[0.8rem]"
          />
        </form>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-neutral-800 px-3 py-2 text-xs text-neutral-400">
        <span className="min-w-0 flex-1">{recordedOn}</span>
        <a
          href={realUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center rounded-md border border-neutral-600 px-3 font-medium text-neutral-100 hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        >
          Run it for real ↗
        </a>
      </div>
    </div>
  );
}
