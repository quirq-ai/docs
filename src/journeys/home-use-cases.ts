// The docs home's use cases (each plays a few replayed commands in the
// terminal) and its command builder (fill in your own names, get the commands
// to copy). Every command here is one the terminal replays, in
// home-commands.ts; the builder only swaps in your names, checked first, so
// what it prints can be pasted into a shell as it is.

export type UseCase = {
  id: string;
  tool: "qq" | "xo";
  title: string;
  text: string;
  /** command ids from home-commands.ts, played in order */
  ids: string[];
  more: { href: string; label: string };
};

export const useCases: UseCase[] = [
  {
    id: "run-a-repo",
    tool: "qq",
    title: "Run any repo with one command",
    text: "qq fetch clones a repo and downloads the toolchains it pins. Then qq test builds and tests it.",
    ids: ["qq-fetch", "qq-test"],
    more: { href: "/docs/first-build", label: "Your first build" },
  },
  {
    id: "open-a-pr",
    tool: "qq",
    title: "Open a pull request with one command",
    text: "qq upload pushes your branch and opens its pull request, or updates the one it has.",
    ids: ["qq-upload"],
    more: { href: "/docs/send-a-change", label: "Send a change" },
  },
  {
    id: "land-a-change",
    tool: "qq",
    title: "Test a change and land it",
    text: "qq try runs the gate, qq status shows its checks, and qq land queues the change once they pass.",
    ids: ["qq-try", "qq-status", "qq-land"],
    more: { href: "/docs/send-a-change", label: "Send a change" },
  },
  {
    id: "team-command",
    tool: "qq",
    title: "Give your team a shortcut",
    text: "qq create saves a command in the repo, so everyone who clones it can run qq hello.",
    ids: ["qq-create", "qq-name"],
    more: { href: "/docs/commands", label: "Commands" },
  },
  {
    id: "repo-to-xo",
    tool: "xo",
    title: "Bring a GitHub repo to XO",
    text: "Log in with your XO key, add the repo as a project, and see it in your list.",
    ids: ["xo-login", "xo-create-project-url", "xo-projects"],
    more: { href: "/docs/xo/projects", label: "Projects" },
  },
  {
    id: "folder-space",
    tool: "xo",
    title: "Put your repos in a space",
    text: "Make a folder of repos a space on GitHub, add a project to it, and clone the space anywhere.",
    ids: ["xo-create-space", "xo-connect", "xo-install"],
    more: { href: "/docs/xo/spaces", label: "Create a space" },
  },
  {
    id: "claude-space",
    tool: "xo",
    title: "Start a Claude Code space",
    text: "See the request first with --dry-run, then create the space on XO Cloud and list your spaces.",
    ids: ["xo-create-kind-dry", "xo-create-kind", "xo-spaces"],
    more: { href: "/docs/xo/spaces", label: "Create a space" },
  },
  {
    id: "share-space",
    tool: "xo",
    title: "Share a space with a teammate",
    text: "Invite alex to a copy of your space, then see the spaces shared with you and accept one.",
    ids: ["xo-share", "xo-list-shared", "xo-accept"],
    more: { href: "/docs/xo/share", label: "Share" },
  },
];

export type Field = {
  key: string;
  label: string;
  placeholder: string;
  /** what a valid value looks like, said when it does not */
  rule: string;
  ok: (v: string) => boolean;
};

export type Recipe = {
  id: string;
  tool: "qq" | "xo";
  title: string;
  fields: Field[];
  /** the commands, from checked values */
  build: (v: Record<string, string>) => string[];
  /** the replayed commands closest to it, played with their own names */
  play: string[];
};

const GITHUB_URL =
  /^https:\/\/github\.com\/[A-Za-z0-9][A-Za-z0-9-]{0,38}\/[A-Za-z0-9._-]{1,100}$/;
const repoOf = (url: string) =>
  url
    .split("/")
    .pop()
    ?.replace(/\.git$/, "") ?? "";

const repoUrl: Field = {
  key: "url",
  label: "GitHub repo",
  placeholder: "https://github.com/quirq-ai/innernet",
  rule: "a https://github.com/OWNER/REPO address",
  ok: (v) => GITHUB_URL.test(v) && !/\.\.|\.git$/.test(v),
};

// xo's rules (src/xo/names.py): a new space on XO Cloud is 1 to 32 letters,
// digits or hyphens; a space you already have is 1 to 64 letters, digits,
// _ . or -. Both start with a letter or digit.
const KINDS = [
  "claude-code",
  "codex",
  "antigravity",
  "hermes",
  "openclaw",
  "xo-cowork",
  "nebius-openclaw",
];
const newSpace = (key: string, label: string, placeholder: string): Field => ({
  key,
  label,
  placeholder,
  rule: "1 to 32 letters, digits or hyphens, starting with a letter or digit",
  ok: (v) =>
    /^[A-Za-z0-9][A-Za-z0-9-]{0,31}$/.test(v) &&
    !["new", "create", ...KINDS].includes(v.toLowerCase()),
});
const yourSpace = (key: string, label: string, placeholder: string): Field => ({
  key,
  label,
  placeholder,
  rule: "one of your spaces: letters, digits, _ . or -",
  ok: (v) => /^[A-Za-z0-9][A-Za-z0-9_.-]{0,63}$/.test(v),
});

export const recipes: Recipe[] = [
  {
    id: "run-a-repo",
    tool: "qq",
    title: "Run a repo",
    fields: [repoUrl],
    build: (v) => [`qq fetch ${v.url}`, `cd ${repoOf(v.url)}`, "qq test"],
    play: ["qq-fetch", "qq-test"],
  },
  {
    id: "repo-to-space",
    tool: "xo",
    title: "Add a repo to a space",
    fields: [repoUrl, yourSpace("space", "Space", "demo")],
    build: (v) => [
      `xo create project ${v.url}`,
      `xo connect ${repoOf(v.url)} ${v.space}`,
    ],
    play: ["xo-create-project-url", "xo-connect"],
  },
  {
    id: "claude-space",
    tool: "xo",
    title: "Create a Claude Code space",
    fields: [
      newSpace("name", "Space name", "lab"),
      {
        key: "size",
        label: "Volume size (GB)",
        placeholder: "20",
        rule: "a whole number from 20 to 100",
        ok: (v) => /^\d{2,3}$/.test(v) && +v >= 20 && +v <= 100,
      },
    ],
    build: (v) => {
      const base = `xo create space ${v.name} claude-code --volume-size ${v.size}`;
      return [`${base} --dry-run`, base];
    },
    play: ["xo-create-kind-dry", "xo-create-kind"],
  },
  {
    id: "share-space",
    tool: "xo",
    title: "Share a space",
    fields: [
      yourSpace("space", "Space", "demo"),
      {
        key: "user",
        label: "Their XO username",
        placeholder: "alex",
        rule: "letters, digits, _ . or -",
        ok: (v) => /^[A-Za-z0-9][A-Za-z0-9_.-]{0,63}$/.test(v),
      },
    ],
    build: (v) => [`xo share space:${v.space} ${v.user}`],
    play: ["xo-share"],
  },
];
