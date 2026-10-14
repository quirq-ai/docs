const { chromium } = require(process.env.PLAYWRIGHT_CORE || "playwright-core");
const fs = require("node:fs");
const [, , jsonPath, outDir, name, w = "1100", h = "660", font = "17"] =
  process.argv;
const width = +w,
  height = +h;
(async () => {
  const rec = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  const b = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH,
  });
  const ctx = await b.newContext({
    viewport: { width, height },
    recordVideo: { dir: outDir, size: { width, height } },
  });
  const p = await ctx.newPage();
  await p.goto(`file://${__dirname}/player.html?fs=${font}`);
  await p.evaluate((r) => window.play(r), rec);
  await p.waitForFunction(() => window.done, null, {
    timeout: 600000,
    polling: 200,
  });
  await p.screenshot({ path: `${outDir}/${name}.png` });
  const v = p.video();
  await ctx.close();
  fs.renameSync(await v.path(), `${outDir}/${name}.webm`);
  await b.close();
})();
