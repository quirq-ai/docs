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
