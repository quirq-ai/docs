const { chromium } = require(process.env.PLAYWRIGHT_CORE || "playwright-core");
const fs = require("node:fs");
const out = process.argv[2];
(async () => {
  const b = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH,
  });
  const ctx = await b.newContext({
    viewport: { width: 1100, height: 980 },
    colorScheme: "dark",
    recordVideo: { dir: out, size: { width: 1100, height: 980 } },
  });
  const p = await ctx.newPage();
  await p.goto(process.env.MAP_URL || "http://127.0.0.1:3200/");
  await p.waitForTimeout(2500);
  await p
    .getByRole("button", { name: "Follow a change" })
    .evaluate((e) =>
      window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY - 24),
    );
  await p.waitForTimeout(1500);
  await p.getByRole("button", { name: "Follow a change" }).click();
  for (let i = 0; i < 9; i++) {
    await p.waitForTimeout(i === 0 ? 5500 : 6000);
    if (i < 8) {
      await p.getByRole("button", { name: "Next step" }).click();
    }
  }
  await p.screenshot({ path: `${out}/map.png` });
  const v = p.video();
  await ctx.close();
  fs.renameSync(await v.path(), `${out}/map.webm`);
  await b.close();
})();
