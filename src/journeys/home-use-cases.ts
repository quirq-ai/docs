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
    title: "Run a qq repo with one command",
    text: "qq fetch clones a repo that has a qq file (infra/repo.toml) and downloads the toolchains it pins. Then qq test builds and tests it.",
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
    id: "repos-to-space",
    tool: "xo",
    title: "Make a space from famous repos",
    text: "A space is a collection of GitHub repos. Clone Flask and Requests into ./web, and xo create space web publishes the folder as a space: one branch per repo.",
    ids: ["xo-create-space"],
    more: {
      href: "/docs/xo/spaces#a-space-from-your-folders",
      label: "Create a space",
    },
  },
  {
    id: "repo-to-space",
    tool: "xo",
    title: "Add any GitHub repo to a space",
    text: "Log in, add Flask as a project straight from its GitHub URL, and connect it to the web space.",
    ids: ["xo-login", "xo-create-project-url", "xo-connect"],
    more: { href: "/docs/xo/projects", label: "Projects" },
  },
  {
    id: "space-anywhere",
    tool: "xo",
    title: "Get a whole space on another machine",
    text: "See your projects and spaces, then clone every repo in the web space at its ref with one command.",
    ids: ["xo-list", "xo-install"],
    more: { href: "/docs/xo/projects", label: "Projects" },
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
    text: "Invite alex to a copy of web, then see what alex shared with you: their api space, with Express in it. Accept it as team-api.",
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

// A repo name never starts with "-" (xo's _REPO rule) and is never "." or "..".
const GITHUB_URL =
  /^https:\/\/github\.com\/[A-Za-z0-9][A-Za-z0-9-]{0,38}\/[A-Za-z0-9_.][A-Za-z0-9._-]{0,99}$/;
const repoOf = (url: string) =>
  url
    .split("/")
    .pop()
    ?.replace(/\.git$/, "") ?? "";

const repoUrl = (label: string, placeholder: string): Field => ({
  key: "url",
  label,
  placeholder,
  rule: "a https://github.com/OWNER/REPO address",
  ok: (v) => GITHUB_URL.test(v) && !/\.\.|\.git$|\/\.$/.test(v),
});

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

// A space made from a folder: xo's _SPACE rule (src/xo/names.py), lowercased,
// and not a kind, new or create, or ending in .git.
const folderSpace: Field = {
  key: "folder",
  label: "Space name",
  placeholder: "web",
  rule: "1 to 64 letters, digits, _ . or -, starting with a letter or digit",
  ok: (v) =>
    /^[A-Za-z0-9][A-Za-z0-9_.-]{0,63}$/.test(v) &&
    !v.toLowerCase().endsWith(".git") &&
    !["new", "create", ...KINDS].includes(v.toLowerCase()),
};

export const recipes: Recipe[] = [
  {
    id: "run-a-repo",
    tool: "qq",
    title: "Run a qq repo",
    fields: [
      repoUrl(
        "GitHub repo with a qq file (infra/repo.toml)",
        "https://github.com/quirq-ai/innernet",
      ),
    ],
    build: (v) => [`qq fetch ${v.url}`, `cd ${repoOf(v.url)}`, "qq test"],
    play: ["qq-fetch", "qq-test"],
  },
  {
    id: "repos-to-space",
    tool: "xo",
    title: "Make a space from GitHub repos",
    fields: [
      folderSpace,
      {
        ...repoUrl("First GitHub repo", "https://github.com/pallets/flask"),
        key: "url1",
      },
      {
        ...repoUrl("Second GitHub repo", "https://github.com/psf/requests"),
        key: "url2",
      },
    ],
    build: (v) => [
      `mkdir ${v.folder} && cd ${v.folder}`,
      `git clone ${v.url1}`,
      `git clone ${v.url2}`,
      "xo create space",
    ],
    play: ["xo-create-space"],
  },
  {
    id: "repo-to-space",
    tool: "xo",
    title: "Add a repo to a space",
    fields: [
      repoUrl("Any GitHub repo", "https://github.com/pallets/flask"),
      yourSpace("space", "Space", "web"),
    ],
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
        ok: (v) => /^[1-9]\d{1,2}$/.test(v) && +v >= 20 && +v <= 100,
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
      yourSpace("space", "Space", "web"),
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
