# quirq playground

This Codespace has qq, qqsync and the xo CLI installed. Open a terminal
(**Ctrl+`**) and follow any guide on [docs.quirq.dev](https://docs.quirq.dev/docs),
for example:

```sh
mkdir -p ~/qq-try && cd ~/qq-try
qq fetch https://github.com/quirq-ai/innernet
cd innernet && qq test
```

It is your own machine, on your GitHub account's Codespaces allowance (free
up to its monthly limit). `xo login` cannot finish its browser sign-in here,
because the sign-in returns to 127.0.0.1 on your own device, not this
Codespace; if you have an XO API key, use `xo login --key`. Delete the
Codespace at https://github.com/codespaces when you are done.
