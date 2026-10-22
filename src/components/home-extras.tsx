"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { CopyButton } from "@/components/copy-button";
import type { TerminalControl } from "@/components/home-terminal";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { commands } from "@/journeys/home-commands";
import { recipes, useCases } from "@/journeys/home-use-cases";

// Two parts of the docs home that drive its terminal: a builder that turns
// your own names into commands to copy, and use cases that play a few
// commands in a row. Nothing here runs anything.

type Control = React.RefObject<TerminalControl | null>;

const cmdOf = new Map(commands.map((c) => [c.id, c.cmd]));

const PLAY = "min-h-11 gap-1.5 sm:min-h-8";

export function CommandBuilder({
  control,
  busy,
}: {
  control: Control;
  busy: boolean;
}) {
  const [id, setId] = useState(recipes[0].id);
  const recipe = recipes.find((r) => r.id === id) ?? recipes[0];
  const [values, setValues] = useState<Record<string, string>>({});
  const uid = useId();

  const value = (key: string, fallback: string) => values[key] ?? fallback;
  const filled = Object.fromEntries(
    recipe.fields.map((f) => [f.key, value(f.key, f.placeholder).trim()]),
  );
  const bad = recipe.fields.filter((f) => !f.ok(filled[f.key]));
  const out = bad.length ? [] : recipe.build(filled);

  return (
    <div className="rounded-xl border border-fd-border bg-fd-card p-4 sm:p-5">
      <fieldset>
        <legend className="text-sm font-medium">What do you want to do?</legend>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {recipes.map((r) => (
            <button
              key={r.id}
              type="button"
              aria-pressed={r.id === recipe.id}
              onClick={() => setId(r.id)}
              className={buttonVariants({
                variant: r.id === recipe.id ? "secondary" : "outline",
                size: "sm",
                className: `min-h-11 gap-1.5 sm:min-h-8 ${r.id === recipe.id ? "" : "text-fd-muted-foreground"}`,
              })}
            >
              <span className="font-mono text-[0.7rem] text-fd-muted-foreground">
                {r.tool}
              </span>
              {r.title}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {recipe.fields.map((f) => {
          const wrong = !f.ok(filled[f.key]);
          const inputId = `${uid}-${recipe.id}-${f.key}`;
          return (
            <div key={f.key} className="min-w-0">
              <label htmlFor={inputId} className="text-sm font-medium">
                {f.label}
              </label>
              <Input
                id={inputId}
                value={value(f.key, f.placeholder)}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [f.key]: e.target.value }))
                }
                aria-invalid={wrong}
                aria-describedby={wrong ? `${inputId}-rule` : undefined}
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
                spellCheck={false}
                className="mt-1 h-11 font-mono text-[16px] sm:h-9 sm:text-sm"
              />
              {wrong && (
                <p
                  id={`${inputId}-rule`}
                  className="mt-1 text-xs text-fd-muted-foreground"
                >
                  Use {f.rule}.
                </p>
              )}
            </div>
          );
        })}
      </div>

      <section
        aria-label="Your commands"
        className="mt-4 overflow-hidden rounded-lg border border-fd-border bg-[var(--term-bg)] text-[var(--term-fg)]"
      >
        <pre className="whitespace-pre-wrap break-words px-3 py-3 font-mono text-[0.8rem] leading-relaxed">
          {out.length ? (
            out.map((c) => (
              <span key={c} className="block">
                <span aria-hidden className="text-[var(--term-dim)]">
                  ${" "}
                </span>
                {c}
              </span>
            ))
          ) : (
            <span className="text-[var(--term-dim)]">
              # fix the field above to see the commands
            </span>
          )}
        </pre>
        <div className="flex flex-wrap items-center gap-2 border-t border-fd-border px-3 py-2">
          {out.length > 0 && (
            <CopyButton
              text={out.join("\n")}
              label={out.length > 1 ? "Copy commands" : "Copy command"}
              className="border-fd-border bg-[var(--term-bg)] text-[var(--term-fg)]"
            />
          )}
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              control.current?.play(
                recipe.play,
                `a run like yours, with the recording's names: ${recipe.play.map((i) => cmdOf.get(i)).join(", then ")}`,
              )
            }
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: `${PLAY} border-fd-border bg-[var(--term-bg)] text-[var(--term-fg)]`,
            })}
          >
            <span aria-hidden className="icon-[ph--play] size-3.5" />
            {busy ? "Playing…" : "Play a run like it"}
          </button>
        </div>
      </section>
      <p className="mt-2 text-xs text-fd-muted-foreground">
        The commands are made here from your names; nothing is sent anywhere.
        The terminal plays the recorded run closest to them, with its own names.
      </p>
    </div>
  );
}

export function UseCases({
  control,
  busy,
}: {
  control: Control;
  busy: boolean;
}) {
  return (
    <div className="grid gap-x-8 gap-y-10 md:grid-cols-2">
      {(["qq", "xo"] as const).map((tool) => (
        <div key={tool}>
          <h3 className="font-mono text-sm text-fd-muted-foreground">{tool}</h3>
          <ul className="mt-3 grid gap-3">
            {useCases
              .filter((u) => u.tool === tool)
              .map((u) => {
                const cmds = u.ids.map((i) => cmdOf.get(i) ?? i);
                return (
                  <li
                    key={u.id}
                    className="rounded-xl border border-fd-border bg-fd-card p-4"
                  >
                    <h4 className="font-medium">{u.title}</h4>
                    <p className="mt-1 text-sm leading-6 text-fd-muted-foreground">
                      {u.text}
                    </p>
                    <pre className="mt-3 whitespace-pre-wrap break-words rounded-md bg-fd-muted px-3 py-2 font-mono text-[0.78rem] leading-relaxed">
                      {cmds.map((c) => (
                        <span key={c} className="block">
                          <span
                            aria-hidden
                            className="text-fd-muted-foreground"
                          >
                            ${" "}
                          </span>
                          {c}
                        </span>
                      ))}
                    </pre>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          control.current?.play(u.ids, `use case: ${u.title}`)
                        }
                        className={buttonVariants({
                          variant: "primary",
                          size: "sm",
                          className: PLAY,
                        })}
                      >
                        <span
                          aria-hidden
                          className="icon-[ph--play] size-3.5"
                        />
                        {busy ? "Playing…" : "Play it"}
                        <span className="sr-only">
                          {" "}
                          in the terminal: {u.title}
                        </span>
                      </button>
                      <CopyButton
                        text={cmds.join("\n")}
                        label={cmds.length > 1 ? "Copy commands" : "Copy"}
                      />
                      <Link
                        href={u.more.href}
                        className="ms-auto inline-flex min-h-11 items-center text-sm font-medium underline-offset-4 hover:underline sm:min-h-8"
                      >
                        {u.more.label} →
                      </Link>
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
      ))}
    </div>
  );
}
