const { chromium } = require(process.env.PLAYWRIGHT_CORE || "playwright-core");
const fs = require("node:fs");
// node map.cjs OUT_DIR [NAME WIDTH HEIGHT]: map.webm at 1100x980, or a phone
// cut such as `map-phone 400 760`. Below 768 px the map is wider than the
// screen, so the phone cut keeps the map and the step text in view and slides
// the map sideways to the lanes each step lights up.
const out = process.argv[2];
const name = process.argv[3] || "map";
const w = Number(process.argv[4] || 1100);
const h = Number(process.argv[5] || 980);
const phone = w < 768;

// Scroll the page to the map, below the sticky tab bar, and the map sideways
// to the lit repo boxes (the wide products box is left out).
const follow = () => {
  const svg = document.querySelector('svg[aria-label^="Map of the qq repos"]');
  const card = svg.parentElement;
  window.scrollTo({
    top: card.getBoundingClientRect().top + window.scrollY - 78,
    behavior: "smooth",
  });
  const lit = [
    ...svg.querySelectorAll("rect.fill-card, rect.fill-accent"),
  ].filter((r) => r.getAttribute("width") === "150");
  if (!lit.length) return;
  const left = card.getBoundingClientRect().left - card.scrollLeft;
  const xs = lit.flatMap((r) => {
    const b = r.getBoundingClientRect();
    return [b.left - left, b.right - left];
  });
  const mid = (Math.min(...xs) + Math.max(...xs)) / 2;
  card.scrollTo({ left: mid - card.clientWidth / 2, behavior: "smooth" });
};

(async () => {
  const b = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH,
  });
  const ctx = await b.newContext({
    viewport: { width: w, height: h },
    colorScheme: "dark",
    recordVideo: { dir: out, size: { width: w, height: h } },
  });
  const p = await ctx.newPage();
  await p.goto(process.env.MAP_URL || "http://127.0.0.1:3200/");
  await p.waitForTimeout(2500);
  const start = p.getByRole("button", { name: "Follow a change" });
  await start.evaluate((e) =>
    window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY - 24),
  );
  await p.waitForTimeout(1500);
  // On a phone the buttons sit above the map, so they are pressed without
  // scrolling to them.
  const press = (button) =>
    phone ? button.evaluate((e) => e.click()) : button.click();
  await press(start);
  for (let i = 0; i < 9; i++) {
    if (phone) await p.evaluate(follow);
    await p.waitForTimeout(i === 0 ? 5500 : 6000);
    if (i < 8) {
      await press(p.getByRole("button", { name: "Next step" }));
    }
  }
  await p.screenshot({ path: `${out}/${name}.png` });
  const v = p.video();
  await ctx.close();
  fs.renameSync(await v.path(), `${out}/${name}.webm`);
  await b.close();
})();
