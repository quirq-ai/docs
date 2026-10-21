# Journeys

A journey page (such as `content/docs/try-first-build.mdx`) puts a guide's steps beside a terminal
that replays a real run. The run is recorded with the video recorder, from a spec here:

```sh
python3 ../videos/recorder.py first-build.json ../../src/journeys/first-build.json
```

Each command in a spec carries the step `id` it belongs to and, in `accept`, what a reader may type
for it (the guide's own command, when the recording machine had to run a different one). The page
shows "recorded as: ..." whenever the two differ. Run it with the spec's `home` set to a
throwaway account with qq installed (see `../videos/README.md`), and re-record when qq's output
changes. Nothing a reader types runs anywhere; the page's "Run it for real" button opens the
Codespace in `.devcontainer/playground/`, where it does.
