# Videos

The videos in `public/videos/` are made here. The four terminal videos are replays of real runs:
`recorder.py` runs each command for real and saves its output with timings, and `record.cjs` plays
that output back in a drawn terminal window (`player.html`) and records the screen. Nothing in a
video is typed by hand; re-record when qq's output changes.

| Video | Spec | Run in |
|---|---|---|
| `install` | `specs/install.json` | an empty home folder |
| `first-build` | `specs/first-build.json` | a home with qq installed and Node 24 at `~/toolchains/node` |
| `commands` | `specs/commands.json` | after `first-build`, in `~/qq-try/innernet` |
| `onboard` | `specs/onboard.json` | a home with Python 3.14.8 at `~/toolchains/python` and clones of infra-config and toolchains under `~/src` |

Each spec names its `home`; use a throwaway account or folder, since the install spec writes to
its `~/.bashrc`. Where ghcr.io cannot be reached, the specs pass toolchains with `--toolchain`
instead of `qq sync`, and say so on screen.

## Make one

You need Python 3, Node, Playwright's `playwright-core`, a Chromium, and ffmpeg.

```sh
python3 recorder.py specs/commands.json /tmp/commands.json
export CHROMIUM_PATH=/path/to/chrome   # and PLAYWRIGHT_CORE if playwright-core is not resolvable
node record.cjs /tmp/commands.json /tmp/out commands                    # desktop, 1100x660
node record.cjs /tmp/commands.json /tmp/out commands-phone 520 760 17   # phone, readable at 390 px
for n in commands commands-phone; do
  ffmpeg -i /tmp/out/$n.webm -c:v libx264 -preset slow -crf 30 -pix_fmt yuv420p -movflags +faststart -an /tmp/out/$n.mp4
done
```

Copy the `.mp4` files and the `.png` posters (the last frame) into `public/videos/`.

## The infra map walkthrough

`map.cjs` records the "Follow a change" walkthrough of the research infra map
(quirq-ai/research `infra/output/app/infra-map`), served at `MAP_URL` (default
`http://127.0.0.1:3200/`). The copy recorded for `map.mp4` was built with the old name depot
replaced by qq; the docs caption says so. Its poster is a frame from the start of the video:

```sh
ffmpeg -ss 1.5 -i map.mp4 -frames:v 1 -q:v 4 map.jpg
```

## The explainer film

`explainer.mp4` (the voiced film on the overview) is not made here. It is the quirq infra field
guide, a HyperFrames film narrated with ElevenLabs, whose project lives in the quirq project's
shared files (`vision/quirq-infra/video`, with its own README). It was made on 2026-10-05; on
2026-10-14 three lines were re-voiced and the depot labels renamed to qq. The web and phone copies
come from its master render:

```sh
ffmpeg -i master.mp4 -vf scale=1280:720 -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart explainer.mp4
ffmpeg -i master.mp4 -vf scale=854:480 -c:v libx264 -preset slow -crf 30 -pix_fmt yuv420p -c:a aac -b:a 64k -movflags +faststart explainer-phone.mp4
ffmpeg -ss 18 -i master.mp4 -frames:v 1 -vf scale=1280:720 -q:v 4 explainer.jpg
```
