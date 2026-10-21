#!/usr/bin/env bash
# Installs qq, qqsync and the xo CLI the way the docs say, for the playground
# Codespace. The commits are the ones content/docs/install.mdx and
# content/docs/xo/install.mdx pin; bump them together.
set -euo pipefail

mkdir -p ~/qq-tools ~/qq-tools/bin
rm -rf ~/qq-tools/depot ~/qq-tools/qqsync
git clone -q https://github.com/quirq-ai/qq ~/qq-tools/depot
python3 -m venv ~/qq-tools/qqsync
~/qq-tools/qqsync/bin/pip install -q --disable-pip-version-check \
  "qqsync @ git+https://github.com/quirq-ai/sync@9821f745690d5150cac70cd2eee54c97d431e6c3"
ln -sf ~/qq-tools/depot/bin/qq ~/qq-tools/qqsync/bin/qqsync ~/qq-tools/bin/

rm -rf ~/.xo
python3 -m venv ~/.xo
~/.xo/bin/pip install -q --disable-pip-version-check \
  "quirq-xo @ git+https://github.com/quirq-ai/xo@436bfbef0d222c128bd10d3ae6b32bc407ce1b51"

grep -qs 'qq-tools/bin:' ~/.bashrc || printf '\nexport PATH="$HOME/qq-tools/bin:$HOME/.xo/bin:$PATH"\n' >> ~/.bashrc
~/qq-tools/bin/qq --version
~/qq-tools/bin/qqsync --version
~/.xo/bin/xo --version
