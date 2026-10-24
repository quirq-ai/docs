# Journeys

A journey page (such as `content/docs/try-first-build.mdx`) puts a guide's steps beside a terminal
that replays a real run. The run is recorded with the video recorder, from a spec here:

```sh
python3 ../videos/recorder.py first-build.json ../../src/journeys/first-build.json
```

Each command in a spec carries the step `id` it belongs to and, in `accept`, what a reader may type
for it (the guide's own command, when the recording machine had to run a different one). The page
shows "recorded as: ..." whenever the two differ. Run it with the spec's `home` set to a
throwaway account with qq installed and an empty `~/qq-try` (see `../videos/README.md`), and
re-record when qq's output changes. The recorder drops variables whose names look like a key, token,
secret, password, credential, `*_PASS`, `*_PWD`, `*_PAT`, `*_AUTH*`, cookie or `*_DSN` from what
the commands see. It goes by names only, so still check a recording before committing it:

```sh
grep -nE 'ak_|sk[-_]|gh[opsu]_|github_pat_|xi-api-key|AKIA[0-9A-Z]{16}|eyJ[A-Za-z0-9_-]{20}|/home/' ../../src/journeys/first-build.json
```

Nothing a reader types runs anywhere.

## The home page terminal

The docs home (`src/components/home-terminal.tsx`) replays every qq and xo command it lists in
`src/journeys/home-commands.ts`, from three sources, and labels each one:

- **Recorded**: `home-qq.json`, recorded like a journey into `src/journeys/home-qq.json`, on
  2026-10-21 with qq b205b0e, qqsync 9821f74, qqinstall ca28825 and xo 10937c6 (`qq build` and
  `qq test` take `--toolchain node=~/toolchains/node`, since ghcr.io was out of reach). `xo --help`
  was recorded again the same day with xo ca83435, whose no-KIND `xo create space` it describes;
  on 2026-10-22 its lines on that form were changed to what xo d027963 prints (`[NAME]`, the
  folder `./NAME` or this one, an index in a new or existing `.git`), the only lines that differ at
  that width (`COLUMNS=96`). On 2026-10-24 `xo --help` and `xo --version` were replaced with what
  xo 38361fb prints (`COLUMNS=96`, by-hand install): the quirq hub in `xo login`, `xo update` and
  `xo sync`, and the commit after the version.
- **Stand-in**: `record-home-xo.sh` records `home-xo.json` into `src/journeys/home-xo.json`. It
  runs the real xo CLI against the real `xo serve`, which talks to `xo-standin.py`: a fake Clerk and
  a fake XO core API on 127.0.0.1 with two made-up users, so no real account, Clerk, XO or
  xo.quirq.dev is touched. The spec's `replace` shows the stand-in's address as
  `https://xo.quirq.dev`, and the page says so. The invite IDs and the space ID are filled in when
  it runs, so they match what the recording printed. The projects are real public repos, cloned
  from GitHub while it records: sam adds `pallets/flask` and connects it to the space `web`, and
  alex shares a space `api` holding `expressjs/express` at its default branch, `master`. Since xo ca83435, `xo create space NAME`
  publishes a folder (to the quirq hub since xo 9bbb460, or GitHub with `--github`), so it is an
  example below; the script makes sam's space `web` with `xo connect web` before recording. The
  stand-in keeps no quirq hub (the xo server takes only an https hub), so `xo login` prints no hub
  line. The committed `home-xo.json` was recorded on 2026-10-24 with xo 38361fb.

  ```sh
  ./record-home-xo.sh ~/.xo ../../src/journeys/home-xo.json   # ~/.xo: a venv with xo installed
  ```

- **Example**: commands that need GitHub, a signed-in gh or ghcr.io (`qq fetch`, `sync`,
  `upload`, `try`, `status`, `land`, `xo update`, `xo sync`, `xo create space`). Their output is written in
  `home-commands.ts` from the source of the version named there, each with a `from` note saying
  where every line comes from, and a made-up pull request, branch and commit. `xo create space web` is
  the real output of xo 38361fb's `spacerepo.create()` with a quirq hub saved, on shallow clones of
  `pallets/flask` and `psf/requests`, asking GitHub for real with no login, with only the hub
  stubbed (no space there yet, its creation and the push).

Check both recordings with the grep above before committing them.
