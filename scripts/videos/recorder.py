"""Run a scripted terminal session for real and record its output with timings.

Usage: python3 recorder.py script.json out.json
script.json: {"title": str, "home": str, "env": {..}, "cwd": str, "steps": [
  {"say": "a comment shown as # ..."} | {"cmd": "shell command", "cd": "dir (optional, applied before)", "hide": "regex lines to drop", "max": seconds-cap,
   "id": "journey step id", "accept": ["what a reader may type for it"]}
]}
"""
import json, os, pty, re, select, subprocess, sys, time

spec = json.load(open(sys.argv[1]))
home = spec["home"]
env = dict(os.environ, HOME=home, TERM="dumb", COLUMNS="96", LINES="40", NO_COLOR="1")
env.pop("HTTPS_PROXY", None) if spec.get("noproxy") else None
env.update(spec.get("env", {}))
env["PATH"] = spec.get("path", "").replace("~", home) + ":" + env["PATH"] if spec.get("path") else env["PATH"]
cwd = spec["cwd"].replace("~", home)
events = []
ansi = re.compile(r"\x1b\[[0-9;?]*[A-Za-z]|\x1b\][^\x07]*\x07|\r(?!\n)")

def pretty(path):
    return "~" + path[len(home):] if path.startswith(home) else path

for step in spec["steps"]:
    if "say" in step:
        events.append({"k": "say", "text": step["say"]})
        continue
    if "cd" in step:
        cwd = step["cd"].replace("~", home)
    events.append({"k": "cmd", "prompt": pretty(cwd), "text": step["cmd"], **{k: step[k] for k in ("id", "accept") if k in step}})
    pid, fd = pty.fork()
    if pid == 0:
        os.chdir(cwd)
        os.execvpe("bash", ["bash", "-c", step["cmd"]], env)
    start = time.time(); buf = b""; last = start
    cap = step.get("max", 1e9)
    while True:
        if time.time() - start > cap:
            os.kill(pid, 15)
        r, _, _ = select.select([fd], [], [], 0.1)
        if r:
            try:
                data = os.read(fd, 4096)
            except OSError:
                break
            if not data:
                break
            now = time.time()
            text = ansi.sub("", data.decode("utf-8", "replace")).replace("\r\n", "\n")
            text = text.replace(home, "~")
            if step.get("hide"):
                text = "".join(l for l in text.splitlines(True) if not re.search(step["hide"], l))
            if text:
                events.append({"k": "out", "dt": round(now - last, 3), "text": text})
            last = now
    _, status = os.waitpid(pid, 0)
    events.append({"k": "end", "dt": round(time.time() - last, 3), "code": os.waitstatus_to_exitcode(status)})
    if "cd_after" in step:
        cwd = step["cd_after"].replace("~", home)

json.dump({"title": spec["title"], "events": events}, open(sys.argv[2], "w"), indent=1)
print("recorded", len(events), "events")
