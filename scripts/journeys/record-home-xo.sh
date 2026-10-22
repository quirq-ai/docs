#!/usr/bin/env bash
# Record the home page's xo commands against xo-standin.py: the real xo CLI and the real
# `xo serve`, with made-up users and data, and nothing sent to Clerk, XO or xo.quirq.dev.
# Usage: record-home-xo.sh XO_VENV OUT.json   (XO_VENV: a venv with xo installed, e.g. ~/.xo)
# The recording home is /home/xo-demo (the spec's "home"); it must not exist yet.
set -euo pipefail
here=$(cd "$(dirname "$0")" && pwd)
venv=$1 out=$2 home=/home/xo-demo
[ ! -e "$home" ] || { echo "$home exists; remove it first" >&2; exit 1; }
mkdir -p "$home" /tmp/xo-alex
ln -s "$venv" "$home/.xo"
printf '%s\n' "ak_demo_sam" > "$home/.demo-key"
export PATH="$venv/bin:$PATH" NO_PROXY=127.0.0.1,localhost no_proxy=127.0.0.1,localhost
python3 "$here/xo-standin.py" > /tmp/xo-standin.log 2>&1 &
standin=$!
trap 'kill $standin 2>/dev/null' EXIT
for _ in $(seq 50); do curl -sf --noproxy '*' http://127.0.0.1:8790/healthz >/dev/null && break; sleep 0.2; done
# alex shares a space and a project with sam before the recording starts.
(cd /tmp/xo-alex && export HOME=/tmp/xo-alex
 printf '%s\n' "ak_demo_alex" | xo login me --key --url http://127.0.0.1:8790
 xo connect api && xo connect expressjs/express api
 xo share space:api sam && xo share project:express sam) > /dev/null 2>&1
# sam's space web, as an entry only: since xo ca83435, xo create space NAME with no KIND publishes
# a folder to GitHub, so the home page shows that command as an example instead.
(cd /tmp && HOME="$home" XO_API_KEY=ak_demo_sam xo connect web --url http://127.0.0.1:8790) > /dev/null 2>&1
shared=$(cd /tmp/xo-alex && HOME=/tmp/xo-alex XO_API_KEY=ak_demo_sam xo list shared --url http://127.0.0.1:8790 2>/dev/null)
pick() { python3 -c 'import json,sys; d=json.loads(sys.argv[1]); print([i["id"] for i in d if i["item"].startswith(sys.argv[2])][0])' "$shared" "$1"; }
lab=$(python3 -c 'import uuid; print(uuid.uuid5(uuid.NAMESPACE_URL, "standin/lab"))')
sed -e "s/{SPACE_INVITE}/$(pick space:)/" -e "s/{PROJECT_INVITE}/$(pick project:)/" -e "s/{LAB_ID}/$lab/" \
  "$here/home-xo.json" > /tmp/home-xo.filled.json
python3 "$here/../videos/recorder.py" /tmp/home-xo.filled.json "$out"
