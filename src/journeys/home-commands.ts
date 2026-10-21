// The docs home page's terminal: every command it knows, grouped the way a
// reader meets them, with one line on what it did and where to read more.
//
// Where the output comes from (`src` below):
// - "recorded": a real run, recorded by scripts/videos/recorder.py from
//   scripts/journeys/home-qq.json into home-qq.json.
// - "stand-in": the real xo CLI and the real `xo serve`, recorded by
//   scripts/journeys/record-home-xo.sh into home-xo.json, against
//   scripts/journeys/xo-standin.py: made-up users and data on 127.0.0.1, its
//   address shown as https://xo.quirq.dev.
// - "example": not a run. These need GitHub, a signed-in gh or ghcr.io, so
//   the output below is written from the source of the version named, line
//   for line, with a made-up pull request, branch and commit.

export type Source = "recorded" | "stand-in" | "example";

export type Example = {
  prompt: string;
  out: string;
  code: number;
  /** where each printed line comes from, for review */
  from: string;
};

export type Command = {
  id: string;
  /** what the reader types (and the chip shows) */
  cmd: string;
  /** one plain line: what just happened */
  what: string;
  more: { href: string; label: string };
  src: Source;
  /** other things a reader may type for it */
  accept?: string[];
  /** ids to suggest next */
  next?: string[];
};

export type Group = { title: string; ids: string[] };
export type Tool = {
  id: "qq" | "xo";
  title: string;
  blurb: string;
  groups: Group[];
};

const PR = "https://github.com/quirq-ai/innernet/pull/123";
const HEAD = "3f2a9c1d0b7e";

export const examples: Record<string, Example> = {
  "qq-fetch": {
    prompt: "~/qq-try",
    out: ".qq/toolchains/node: sha256:8c0ab89a2bc9…\n",
    code: 0,
    from: "qq b205b0e src/qqdepot/commands/sync.py run_fetch (git clone --quiet, then sync) and sync() line 89; the digest is innernet's linux-x86_64 node pin, from the recorded qqsync pins",
  },
  "qq-sync": {
    prompt: "~/qq-try/innernet",
    out: ".qq/toolchains/node: sha256:8c0ab89a2bc9…\n",
    code: 0,
    from: "qq b205b0e src/qqdepot/commands/sync.py sync() line 89, as for qq fetch",
  },
  "qq-upload": {
    prompt: "~/qq-try/innernet",
    out: `${PR} (fix-typo -> main) at ${HEAD}\n`,
    code: 0,
    from: "qq b205b0e src/qqdepot/commands/change.py run_upload; git push and gh output are captured (backends/github.py _run)",
  },
  "qq-try": {
    prompt: "~/qq-try/innernet",
    out: `try try-quirq-ai-innernet-123-${HEAD}: ${PR} at ${HEAD}\n  the verdict is pushed to ~/.cache/qq/verdicts/try-quirq-ai-innernet-123-${HEAD}.json\n  qq status 123 --repo quirq-ai/innernet shows it now\n`,
    code: 0,
    from: "qq b205b0e src/qqdepot/commands/change.py _receipt; run_id and verdict_path in src/qqdepot/watch.py (qq prints the full path; ~ here)",
  },
  "qq-status": {
    prompt: "~/qq-try/innernet",
    out: `${PR} at ${HEAD}: pass\n  green    innernet-presubmit\n`,
    code: 0,
    from: "qq b205b0e src/qqdepot/commands/change.py run_status, for a gated repo whose required check passed",
  },
  "qq-land": {
    prompt: "~/qq-try/innernet",
    out: `land land-quirq-ai-innernet-123-${HEAD}: ${PR} at ${HEAD}\n  the verdict is pushed to ~/.cache/qq/verdicts/land-quirq-ai-innernet-123-${HEAD}.json\n  qq status 123 --repo quirq-ai/innernet shows it now\n`,
    code: 0,
    from: "qq b205b0e src/qqdepot/commands/change.py run_land (gate passed, so queued) then _receipt",
  },
  "xo-update": {
    prompt: "~",
    out: 'xo: ./innernet: pushed\n{\n  "project": "innernet"\n}\n',
    code: 0,
    from: "xo 10937c6 src/xo/workspace.py update() (project) and _say; JSON as xo prints it",
  },
  "xo-sync": {
    prompt: "~",
    out: 'xo: ./innernet: rebased on its upstream and pushed\n{\n  "project": "innernet"\n}\n',
    code: 0,
    from: "xo 10937c6 src/xo/workspace.py sync() (project) and _say; JSON as xo prints it",
  },
};

const D = {
  work: { href: "/docs/commands#work-in-a-repo", label: "Work in a repo" },
  build: { href: "/docs/build-test-run", label: "Build, test and run" },
  own: { href: "/docs/repo-commands", label: "Repo commands" },
  send: { href: "/docs/send-a-change", label: "Send a change" },
  sync: {
    href: "/docs/commands#read-or-edit-the-manifest-qqsync",
    label: "qqsync",
  },
  install: {
    href: "/docs/commands#install-from-a-channel-qqinstall",
    label: "qqinstall",
  },
  xoLogin: { href: "/docs/xo/login", label: "Log in to xo" },
  xoCmds: { href: "/docs/xo/commands", label: "xo commands" },
  xoProjects: { href: "/docs/xo/projects", label: "Projects" },
  xoSpaces: { href: "/docs/xo/spaces", label: "Spaces" },
  xoShare: { href: "/docs/xo/share", label: "Share" },
};

export const commands: Command[] = [
  // qq: start
  {
    id: "qq-version",
    cmd: "qq --version",
    src: "recorded",
    more: { href: "/docs/install", label: "Install qq" },
    what: "The qq on your PATH. Inside a repo, qq runs the version that repo pins.",
    next: ["qq-help", "qq-fetch"],
  },
  {
    id: "qq-help",
    cmd: "qq --help",
    src: "recorded",
    more: D.work,
    what: "qq's commands, then any the repo adds with qq create.",
    next: ["qq-fetch", "qqsync-show"],
  },
  {
    id: "qq-fetch",
    cmd: "qq fetch https://github.com/quirq-ai/innernet",
    src: "example",
    more: D.work,
    what: "Clones the repo, then runs qq sync in it: each pinned toolchain is downloaded and checked against its digest.",
    next: ["qqsync-show", "qq-test"],
  },
  {
    id: "qq-sync",
    cmd: "qq sync",
    src: "example",
    more: D.work,
    what: "Fetches every pin in infra/repo.toml, checks its digest and links it under .qq/.",
    next: ["qq-build", "qq-test"],
  },
  {
    id: "qqsync-show",
    cmd: "qqsync show",
    src: "recorded",
    more: D.sync,
    what: "The manifest as JSON. innernet has one target, app, of kind node-app.",
    next: ["qqsync-validate", "qq-test"],
  },
  {
    id: "qqsync-validate",
    cmd: "qqsync validate",
    src: "recorded",
    accept: ["qqsync validate && echo valid"],
    more: D.sync,
    what: "Checks infra/repo.toml against the schema; exit 1 lists every problem.",
    next: ["qqsync-pins", "qqsync-guard"],
  },
  {
    id: "qqsync-pins",
    cmd: "qqsync pins",
    src: "recorded",
    more: D.sync,
    what: "Every pin: what it is, its digest and where it is fetched from.",
    next: ["qq-sync", "qqsync-guard"],
  },
  {
    id: "qqsync-guard",
    cmd: "qqsync guard",
    src: "recorded",
    accept: ["qqsync guard && echo guard passed"],
    more: D.sync,
    what: "Fails if anything but qqsync parses repo.toml. Every repo runs it in presubmit.",
    next: ["qq-build", "qq-test"],
  },
  // qq: every day
  {
    id: "qq-build",
    cmd: "qq build",
    src: "recorded",
    more: D.build,
    what: "Builds every target, one line per step: result, target, step and time.",
    next: ["qq-test", "out"],
  },
  {
    id: "qq-test",
    cmd: "qq test",
    src: "recorded",
    more: D.build,
    what: "Builds, then tests. Results land in .qq/out.",
    next: ["out", "qq-run"],
  },
  {
    id: "out",
    cmd: "ls .qq/out .qq/out/logs",
    src: "recorded",
    accept: ["ls .qq/out"],
    more: D.build,
    what: "results.json for scripts and agents, one log per step, JUnit XML in junit/.",
    next: ["qq-run", "qq-upload"],
  },
  {
    id: "qq-run",
    cmd: 'qq run "node --version"',
    src: "recorded",
    accept: ["qq run 'node --version'"],
    more: D.build,
    what: "Runs a command from the repo root with the pinned toolchains first on PATH. The not synced line is only there because the recording machine could not reach ghcr.io for qq sync.",
    next: ["qq-create", "qq-test"],
  },
  {
    id: "qq-create",
    cmd: 'qq create hello echo "hello from innernet"',
    src: "recorded",
    accept: ["qq create hello echo 'hello from innernet'"],
    more: D.own,
    what: "Saves a command for this repo as infra/commands/hello.sh. Commit it and everyone gets it.",
    next: ["qq-name", "qq-help"],
  },
  {
    id: "qq-name",
    cmd: "qq hello",
    src: "recorded",
    more: D.own,
    what: "Runs the repo's own command, like qq run.",
    next: ["qq-upload"],
  },
  // qq: send a change
  {
    id: "qq-upload",
    cmd: "qq upload",
    src: "example",
    more: D.send,
    what: "Pushes this branch and opens or updates its pull request. Needs gh signed in.",
    next: ["qq-try", "qq-status"],
  },
  {
    id: "qq-try",
    cmd: "qq try",
    src: "example",
    more: D.send,
    what: "Uploads, prints a run ID and returns at once. A watcher writes the gate's verdict to the file named.",
    next: ["qq-status", "qq-land"],
  },
  {
    id: "qq-status",
    cmd: "qq status",
    src: "example",
    more: D.send,
    what: "The gate's verdict now: each required check, green, failing or missing.",
    next: ["qq-land"],
  },
  {
    id: "qq-land",
    cmd: "qq land",
    src: "example",
    more: D.send,
    what: "Once the gate passes, queues the change in the merge queue and returns at once.",
    next: ["qqinstall-show"],
  },
  // qq tools: channels
  {
    id: "qqinstall-show",
    cmd: "qqinstall show",
    src: "recorded",
    more: D.install,
    what: "Every release channel: the commit, digest and generation it names.",
    next: ["qqinstall-resolve"],
  },
  {
    id: "qqinstall-resolve",
    cmd: "qqinstall resolve --repo xo-space --channel canary",
    src: "recorded",
    more: D.install,
    what: "One channel's commit, digest and generation, for an install script.",
    next: ["xo-version", "qq-help"],
  },
  // xo: log in
  {
    id: "xo-version",
    cmd: "xo --version",
    src: "recorded",
    more: { href: "/docs/xo/install", label: "Install xo" },
    what: "The xo CLI on your PATH.",
    next: ["xo-help", "xo-login"],
  },
  {
    id: "xo-help",
    cmd: "xo --help",
    src: "recorded",
    more: D.xoCmds,
    what: "Every xo command, then the settings it reads.",
    next: ["xo-login", "xo-status"],
  },
  {
    id: "xo-login",
    cmd: "xo login --key",
    src: "stand-in",
    accept: ["xo login", "xo login me --key", "xo login me"],
    more: D.xoLogin,
    what: "Checks your XO API key through the xo server and saves it where only you can read it. On the real server, plain xo login signs you in in your browser instead.",
    next: ["xo-status", "xo-me"],
  },
  {
    id: "xo-status",
    cmd: "xo status",
    src: "stand-in",
    more: D.xoLogin,
    what: "Each service, its address and whether you are logged in. Never a key.",
    next: ["xo-me", "xo-create-space"],
  },
  {
    id: "xo-me",
    cmd: "xo me",
    src: "stand-in",
    more: D.xoCmds,
    what: "Your profile from the xo server. Here it already holds two invites from alex.",
    next: ["xo-create-space", "xo-create-project"],
  },
  // xo: projects
  {
    id: "xo-create-project",
    cmd: "xo create project hello",
    src: "stand-in",
    more: D.xoProjects,
    what: "Adds a project by name and makes ./hello, an empty git repository.",
    next: ["xo-create-project-url", "xo-projects"],
  },
  {
    id: "xo-create-project-url",
    cmd: "xo create project https://github.com/quirq-ai/innernet",
    src: "stand-in",
    more: D.xoProjects,
    what: "Adds a GitHub project, named after its repo, and clones it into ./innernet.",
    next: ["xo-projects-add", "xo-connect"],
  },
  {
    id: "xo-projects-add",
    cmd: "xo projects add notes-app",
    src: "stand-in",
    more: D.xoProjects,
    what: "Adds just the name to your projects list. Nothing is made here.",
    next: ["xo-projects"],
  },
  {
    id: "xo-projects",
    cmd: "xo projects",
    src: "stand-in",
    more: D.xoProjects,
    what: "Your projects, with the owner of each GitHub one.",
    next: ["xo-create-space", "xo-connect"],
  },
  // xo: spaces
  {
    id: "xo-create-space",
    cmd: "xo create space demo",
    src: "stand-in",
    more: D.xoSpaces,
    what: "A space here only: the folder ./demo, recorded in your spaces, nothing on XO Cloud.",
    next: ["xo-connect", "xo-create-kind-dry"],
  },
  {
    id: "xo-connect",
    cmd: "xo connect innernet demo",
    src: "stand-in",
    more: D.xoProjects,
    what: "Puts the innernet project in the demo space at main.",
    next: ["xo-list", "xo-install"],
  },
  {
    id: "xo-list",
    cmd: "xo list",
    src: "stand-in",
    more: D.xoCmds,
    what: "Your projects and your spaces together.",
    next: ["xo-install", "xo-spaces"],
  },
  {
    id: "xo-install",
    cmd: "xo install space:demo",
    src: "stand-in",
    more: D.xoProjects,
    what: "Clones each of the space's projects into ./demo at its ref.",
    next: ["xo-update", "xo-create-kind-dry"],
  },
  {
    id: "xo-update",
    cmd: "xo update project:innernet",
    src: "example",
    more: D.xoProjects,
    what: "Pushes the project's branch to GitHub, never forced.",
    next: ["xo-sync"],
  },
  {
    id: "xo-sync",
    cmd: "xo sync project:innernet",
    src: "example",
    more: D.xoProjects,
    what: "Rebases the branch on GitHub's copy, then pushes it.",
    next: ["xo-create-kind-dry", "xo-share"],
  },
  {
    id: "xo-create-kind-dry",
    cmd: "xo create space lab claude-code --volume-size 20 --dry-run",
    src: "stand-in",
    more: D.xoSpaces,
    what: "Shows the request a Claude Code space would send, and sends nothing.",
    next: ["xo-create-kind"],
  },
  {
    id: "xo-create-kind",
    cmd: "xo create space lab claude-code --volume-size 20",
    src: "stand-in",
    more: D.xoSpaces,
    what: "Creates the space on XO Cloud and records it in your spaces as lab.",
    next: ["xo-spaces", "xo-space-id"],
  },
  {
    id: "xo-spaces",
    cmd: "xo spaces",
    src: "stand-in",
    more: D.xoSpaces,
    what: "Your spaces, with their projects and refs.",
    next: ["xo-space-id", "xo-share"],
  },
  {
    id: "xo-space-id",
    cmd: "xo spaces --space-id 181772e3-3c50-5fc6-b0c8-05c9292c3b7a",
    src: "stand-in",
    more: D.xoSpaces,
    what: "XO Cloud's view of one space you own, with its connection URLs.",
    next: ["xo-share"],
  },
  // xo: share
  {
    id: "xo-share",
    cmd: "xo share space:demo alex",
    src: "stand-in",
    more: D.xoShare,
    what: "Invites alex to a copy of the space: its name and its GitHub projects.",
    next: ["xo-list-shared"],
  },
  {
    id: "xo-list-shared",
    cmd: "xo list shared",
    src: "stand-in",
    more: D.xoShare,
    what: "The invites waiting on you.",
    next: ["xo-accept", "xo-reject"],
  },
  {
    id: "xo-accept",
    cmd: "xo accept ID --as team-notes --yes",
    src: "stand-in",
    more: D.xoShare,
    what: "Adds the shared space as your own, named team-notes, and its projects to yours. Without --yes it asks first.",
    next: ["xo-reject", "xo-logout"],
  },
  {
    id: "xo-reject",
    cmd: "xo reject ID",
    src: "stand-in",
    more: D.xoShare,
    what: "Takes the invite off your list. Its sender can share again.",
    next: ["xo-logout"],
  },
  {
    id: "xo-logout",
    cmd: "xo logout",
    src: "stand-in",
    more: D.xoLogin,
    what: "Deletes the saved key and addresses. With gh installed, it asks before logging gh out too.",
    next: ["xo-login", "qq-version"],
  },
];

export const tools: Tool[] = [
  {
    id: "qq",
    title: "qq",
    blurb: "Build, test and land code in any repo the same way.",
    groups: [
      { title: "Start", ids: ["qq-version", "qq-help", "qq-fetch", "qq-sync"] },
      {
        title: "Every day",
        ids: ["qq-build", "qq-test", "out", "qq-run", "qq-create", "qq-name"],
      },
      {
        title: "Send a change",
        ids: ["qq-upload", "qq-try", "qq-status", "qq-land"],
      },
      {
        title: "Read the manifest",
        ids: ["qqsync-show", "qqsync-validate", "qqsync-pins", "qqsync-guard"],
      },
      {
        title: "Release channels",
        ids: ["qqinstall-show", "qqinstall-resolve"],
      },
    ],
  },
  {
    id: "xo",
    title: "xo",
    blurb: "Your XO Cloud spaces and projects, from the command line.",
    groups: [
      {
        title: "Log in",
        ids: [
          "xo-version",
          "xo-help",
          "xo-login",
          "xo-status",
          "xo-me",
          "xo-logout",
        ],
      },
      {
        title: "Projects",
        ids: [
          "xo-create-project",
          "xo-create-project-url",
          "xo-projects-add",
          "xo-projects",
          "xo-update",
          "xo-sync",
        ],
      },
      {
        title: "Spaces",
        ids: [
          "xo-create-space",
          "xo-connect",
          "xo-list",
          "xo-install",
          "xo-create-kind-dry",
          "xo-create-kind",
          "xo-spaces",
          "xo-space-id",
        ],
      },
      {
        title: "Share",
        ids: ["xo-share", "xo-list-shared", "xo-accept", "xo-reject"],
      },
    ],
  },
];
