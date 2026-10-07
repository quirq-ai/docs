#!/usr/bin/env node
/* Unmodified browser captures of a sibling xo-space checkout. All API data
   comes from server.py, with no live accounts or private workspace reads. */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE
    ? pathToFileURL(resolve(process.env.PLAYWRIGHT_MODULE)).href
    : "playwright"
);
const origin = process.env.SPACE_PREVIEW_URL || "http://127.0.0.1:5101";
const sourceRepository = "https://github.com/quirq-ai/xo-space";
const primaryViews = ["projects", "agents", "inbox", "setup"];
const primaryRoutes = [
  "projects/overview",
  "agents/overview",
  "inbox/items",
  "setup/workspace",
];
const output = resolve(
  process.argv[2] || resolve(here, "../../public/images/space"),
);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
    : {}),
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
  locale: "en-US",
  timezoneId: "UTC",
  reducedMotion: "no-preference",
});
await context.addInitScript(() => {
  const NativeDate = Date;
  const now = NativeDate.parse("2026-09-14T10:00:00Z");
  globalThis.Date = class extends NativeDate {
    constructor(...args) {
      super(...(args.length ? args : [now]));
    }
    static now() {
      return now;
    }
  };
  let seed = 100;
  Math.random = () => {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 4294967296;
  };
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
page.on("response", (response) => {
  if (response.status() >= 400)
    errors.push(`${response.status()} ${response.url()}`);
});
const metadata = await (
  await context.request.get(`${origin}/__fixture__/meta`)
).json();
assert.equal(
  metadata.assets_modified,
  false,
  "Source UI must be an unmodified checkout",
);
const report = {
  source: metadata,
  viewport: { width: 1440, height: 1000 },
  screenshots: [],
  checks: [],
  errors,
};

async function go(id) {
  await page.goto(`${origin}/space/#/${id}`, { waitUntil: "networkidle" });
  await page.waitForFunction((id) => location.hash === `#/${id}`, id);
}
async function settleGraph() {
  await page.waitForFunction(
    () =>
      document.querySelector("#root-name")?.textContent &&
      document.querySelector("#simstat"),
  );
  await page.waitForFunction(
    () => document.querySelector("#simstat")?.style.opacity === "0",
    undefined,
    { timeout: 20000 },
  );
}
async function shot(name, description) {
  // Let native page crossfades and drawer transitions finish before capture.
  await page.waitForTimeout(750);
  await assertHeaderLinks();
  await page.mouse.move(1430, 985);
  await page.screenshot({
    path: resolve(output, `${name}.png`),
  });
  const bytes = await readFile(resolve(output, `${name}.png`));
  report.screenshots.push({
    file: `${name}.png`,
    description,
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
  });
  console.log(`Captured ${name}.png`);
}

async function assertHeaderLinks() {
  for (const href of ["#/wiki", sourceRepository]) {
    const link = page.locator(`.topbar a[href="${href}"]`);
    assert.equal(await link.count(), 1, `Global header link: ${href}`);
    assert.equal(await link.isVisible(), true);
    if (href === "#/wiki") {
      assert.ok([null, "_self"].includes(await link.getAttribute("target")));
      assert.equal((await link.textContent()).trim(), "Wiki");
      assert.equal(
        await link.getAttribute("aria-current"),
        new URL(page.url()).hash === "#/wiki" ? "page" : null,
      );
    } else {
      assert.equal(await link.getAttribute("target"), "_blank");
      const rel = (await link.getAttribute("rel"))?.split(/\s+/) || [];
      assert.ok(rel.includes("noopener"), "External links isolate the new tab");
    }
    const bounds = await link.boundingBox();
    assert.ok(bounds && bounds.x >= 0 && bounds.y >= 0);
    assert.ok(bounds.x + bounds.width <= page.viewportSize().width + 1);
  }
  assert.deepEqual(
    await page
      .locator(".tabs a")
      .evaluateAll((buttons) => buttons.map((button) => button.id)),
    primaryViews.map((id) => `tab-${id}`),
  );
}

async function openWikiResource() {
  const pagesBefore = context.pages().length;
  const timeOrigin = await page.evaluate(() => performance.timeOrigin);
  await page.locator('.topbar a[href="#/wiki"]').click();
  await page.waitForFunction(() => location.hash === "#/wiki");
  await page.locator('#wiki-link[aria-current="page"]').waitFor();
  await page.locator(".wiki-topic").first().waitFor();
  assert.equal(
    context.pages().length,
    pagesBefore,
    "Wiki opens without a new tab",
  );
  assert.equal(
    await page.evaluate(() => performance.timeOrigin),
    timeOrigin,
    "Wiki keeps the same document",
  );
  assert.equal(new URL(page.url()).origin, new URL(origin).origin);
  assert.equal(
    await page.locator('.topbar a[href="#/wiki"]').getAttribute("aria-current"),
    "page",
  );
  assert.equal(await page.locator(".tabs a.is-on").count(), 0);
}

async function assertExternalLinkOpensNewTab(link) {
  const originalURL = page.url();
  const destination = await link.getAttribute("href");
  const popupReady = context.waitForEvent("page");
  await link.click();
  const popup = await popupReady;
  await popup.waitForLoadState("domcontentloaded");
  assert.equal(popup.url(), destination);
  assert.equal(
    page.url(),
    originalURL,
    "External links preserve the Space view",
  );
  await popup.close();
}

async function verifyWikiNavigation() {
  // Inspect navigation without contacting GitHub or the published docs site.
  // No screenshot includes this destination stub or modified Space content.
  for (const pattern of ["https://docs.quirq.dev/**", "https://github.com/**"]) {
    await context.route(pattern, (route) =>
      route.fulfill({
        contentType: "text/html",
        body: "<!doctype html><title>Navigation destination verified</title>",
      }),
    );
  }
  const layouts = [];
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await go("wiki");
    await page.locator(".wiki-topic").first().waitFor();
    await page.waitForTimeout(750);
    await assertHeaderLinks();
    const topics = page.locator(".wiki-topic");
    assert.equal(await topics.count(), 9);
    const layout = await topics.evaluateAll((cards) => ({
      documentWidth: document.documentElement.scrollWidth,
      cards: cards.map((card) => {
        const bounds = card.getBoundingClientRect();
        return { left: bounds.left, right: bounds.right };
      }),
    }));
    assert.ok(layout.documentWidth <= width, "Wiki has no horizontal overflow");
    assert.ok(
      layout.cards.every((card) => card.left >= 0 && card.right <= width + 1),
    );
    const docsLinks = page.locator(".wiki-doc-link");
    assert.equal(await docsLinks.count(), 15);
    assert.equal(
      await page.locator(".wiki-topic-actions > .wiki-doc-link").count(),
      9,
    );
    for (const link of await docsLinks.all()) {
      assert.equal(await link.getAttribute("target"), "_blank");
      assert.ok(
        (await link.getAttribute("rel"))?.split(/\s+/).includes("noopener"),
      );
    }
    await assertExternalLinkOpensNewTab(
      page.locator(".wiki-topic-actions > .wiki-doc-link").first(),
    );
    await assertExternalLinkOpensNewTab(
      page.locator(`.topbar a[href="${sourceRepository}"]`),
    );
    await page.locator('.wiki-quickstart [data-open-tab="projects"]').click();
    await page.waitForFunction(() => location.hash === "#/projects/overview");
    await settleGraph();
    await openWikiResource();
    await page
      .locator('.wiki-quickstart [data-open-tab="setup/workspace"]')
      .click();
    await page.waitForFunction(() => location.hash === "#/setup/workspace");
    await page.locator("#setup-alert.is-good").waitFor();
    for (const [index, id] of primaryViews.entries()) {
      await page.keyboard.press(String(index + 1));
      await page.waitForFunction(
        (route) => location.hash === `#/${route}`,
        primaryRoutes[index],
      );
      assert.equal(await page.locator(`#tab-${id}.is-on`).count(), 1);
      assert.equal(
        await page
          .locator('.topbar a[href="#/wiki"]')
          .getAttribute("aria-current"),
        null,
      );
    }
    await go("setup/server/details");
    await page.locator('[data-wiki-page="xo-data"]').click();
    await page.waitForFunction(() => location.hash === "#/wiki");
    await page.locator("#wiki-observability.is-highlighted").waitFor();
    assert.equal(
      await page.evaluate(() => document.activeElement?.id),
      "wiki-observability",
    );
    layouts.push({
      width,
      topics: 9,
      docsLinks: 15,
      internalQuickstartActions: true,
      localWikiResource: true,
      primaryHotkeys: "1–4",
      legacyHelpHandoff: true,
      externalLinksPreserveView: true,
      horizontalOverflow: false,
    });
  }
  report.wikiNavigation = layouts;
  report.checks.push(
    "Local Wiki navigation, legacy help handoff, four primary tab shortcuts and external documentation/GitHub links verified at 1440, 390 and 320 pixels. External destinations were stubbed only for new-tab navigation checks; published page content was not tested.",
  );
}

try {
  await go("projects/overview");
  await settleGraph();
  assert.deepEqual(
    await page
      .locator(".tabs a")
      .evaluateAll((buttons) => buttons.map((b) => b.id)),
    primaryViews.map((id) => `tab-${id}`),
  );
  await shot(
    "dashboard",
    "Projects Overview: ten projects grouped into five environments.",
  );
  await page.locator("#root-btn").click();
  await page.locator("#root-q").fill("Aurora Console");
  await page.locator("#root-q").press("Enter");
  await settleGraph();
  await page.waitForTimeout(1300);
  const canvasBounds = await page.locator("#gcanvas").boundingBox();
  await page.mouse.click(
    canvasBounds.x + canvasBounds.width / 2,
    canvasBounds.y + canvasBounds.height / 2,
  );
  await page
    .locator('#panel[data-id="aurora-console"] .ptodo')
    .first()
    .waitFor();
  await shot(
    "dashboard-detail",
    "Projects Overview focused on Aurora Console with its recorded todo satellites and detail panel.",
  );
  await page.locator("#panel-close").click();

  await go("projects/data/list");
  await page.locator(".prj-row").first().waitFor();
  assert.equal(await page.locator(".prj-row").count(), 10);
  await shot(
    "projects-list",
    "Projects Data List with descriptions, live activity and file counts.",
  );
  await page.locator('[data-id="aurora-console"].prj-row-head').click();
  await page.locator('[data-file="README.md"]').waitFor();
  await shot(
    "projects-detail",
    "Expanded Data List project drawer focused on files and folders.",
  );
  await page.locator('[data-file="README.md"]').click();
  await page.locator("#preview-body .pv-md").waitFor();
  await page
    .locator('#preview-version option[value="0"]')
    .waitFor({ state: "attached" });
  await shot(
    "file-preview",
    "Rendered file preview with source toggle and version history picker.",
  );
  await page.locator("#preview-version").selectOption("0");
  await page.waitForFunction(() =>
    document
      .querySelector("#preview-body")
      ?.textContent.includes("An earlier version"),
  );
  await shot(
    "file-version",
    "A historical version rendered in the same file preview.",
  );
  await page.locator("#preview-close").click();

  await go("projects/data/graph");
  await settleGraph();
  await shot("graph", "File graph across all ten fictional projects.");
  await go("projects/data/tree");
  await page.locator('.tv-node[title="Aurora Console"]').click();
  await page.locator('.tv-node[title="src"]').click();
  await page.locator(".tv-leaf").first().waitFor();
  await page.locator('[data-tv="reset"]').click();
  await page.waitForTimeout(650);
  await shot(
    "tree",
    "Tree lens: an expanded project and source folder in the workspace directory hierarchy.",
  );
  await go("inbox/sharing");
  await page.locator(".shl-detail").waitFor();
  await page.locator(".shr-members .shr-row").first().waitFor();
  await shot(
    "sharing",
    "Inbox Sharing with fetched commits awaiting explicit application.",
  );

  await go("projects/timeline");
  await page.locator("#tmode").waitFor({ state: "visible" });
  await page.locator('[data-tmode="project"]').click();
  await shot(
    "timeline",
    "Timeline in By project mode, showing parallel project histories.",
  );
  await page.locator('[data-tmode="file"]').click();
  await shot(
    "timeline-files",
    "Timeline in By file mode, showing when artifacts first appeared.",
  );

  await go("agents/overview");
  await page.locator("#ch-area svg").waitFor();
  await shot(
    "sessions",
    "Sessions overview: token trends, source filters, costs and model usage.",
  );
  await go("agents/trends");
  await page.locator("#ch-wk svg").first().waitFor();
  await shot(
    "sessions-trends",
    "Agents Trends combines model, tool and weekly usage in one view.",
  );
  await page
    .getByText("Tools", { exact: true })
    .last()
    .scrollIntoViewIfNeeded();
  await shot(
    "sessions-tools",
    "Tools section within the combined Agents Trends page.",
  );
  await go("agents/trends");
  await page
    .getByText("Models", { exact: true })
    .last()
    .scrollIntoViewIfNeeded();
  await shot(
    "sessions-models",
    "Model usage within the combined Agents Trends page.",
  );
  await go("agents/configure");
  await page.locator(".sess-agent-card").first().waitFor();
  assert.equal(await page.locator(".sess-agent-card").count(), 3);
  await shot(
    "agents-configure",
    "Agents Configure: collection switches, local paths and recorded telemetry for three fictional sources.",
  );
  await go("agents/sessions");
  await page.locator("[data-sid]").first().waitFor();
  await shot(
    "sessions-list",
    "Session table with sorting, pagination and telemetry by source.",
  );
  await page.locator("[data-sid]").first().click();
  await page.locator(".sess-prompt").first().waitFor();
  await shot(
    "session-detail",
    "Session detail: tokens, duration, source and tools.",
  );
  await page.mouse.move(1100, 700);
  await page.mouse.wheel(0, 650);
  await page.waitForTimeout(200);
  await shot(
    "session-prompts",
    "Session detail showing fictional prompts grouped by turn.",
  );

  await go("inbox/items");
  await page.locator(".inb-row").first().waitFor();
  await page.locator('[data-act="toggle"][data-id="00000004"]').click();
  await shot(
    "inbox",
    "Inbox Items with source categories and an expanded item already marked seen.",
  );
  await go("wiki");
  await page.locator(".wiki-topic").first().waitFor();
  assert.equal(await page.locator(".wiki-topic").count(), 9);
  await shot(
    "wiki",
    "Compact Wiki directory with local summaries and links to detailed hosted documentation.",
  );

  await go("setup/workspace");
  await page.locator("#setup-alert.is-good").waitFor();
  await shot(
    "setup",
    "Setup Workspace: fictional Space identity, account verification and configured storage folders.",
  );
  await go("setup/intelligence");
  await page.locator(".source-row").first().waitFor();
  await shot(
    "setup-runtime",
    "Setup Intelligence layer: chat agent selection and activity collection settings.",
  );
  await go("setup/commands");
  await page.locator("#setup-commands").scrollIntoViewIfNeeded();
  await page.locator(".setup-command-row").first().waitFor();
  await shot(
    "setup-commands",
    "Three fictional saved commands: manual results and an optional interval; no command is executed.",
  );
  await page
    .locator('[data-command-id="checkout-status"] [data-command-action="runs"]')
    .click();
  await page.locator("#command-runs .setup-run").waitFor();
  await shot(
    "setup-command-runs",
    "Retained command result with return code, duration, escaped output tail and local full-log path.",
  );
  await page.locator("#command-runs-close").click();
  await go("setup/server");
  await page.locator("#setup-restart").waitFor();
  await shot(
    "setup-server",
    "Setup Server: restart and update controls; neither is triggered.",
  );
  await go("setup/server/details");
  await page.locator("#quirq-activity-badge.is-live").waitFor();
  await shot(
    "quirq",
    "Machine-local Quirq state reached from Setup, including storage ownership and watcher heartbeat.",
  );

  await go("setup/connectors");
  await page.locator("#conn-grid .conn-card").first().waitFor();
  assert.equal(await page.locator(".conn-card").count(), 15);
  await shot(
    "connectors",
    "Setup Connectors: five native workspace connectors and ten account-app integrations.",
  );
  await page.locator('[data-toolkit="gmail"] [data-action="polling"]').click();
  await page.locator('#poll-gmail [data-poll="enabled"]').waitFor();
  await shot(
    "connector-polling",
    "Gmail polling drawer with collector selection, cadence and account label.",
  );

  await page.locator('[data-toolkit="gmail"] [data-action="polling"]').click();
  await page.locator('[data-toolkit="gmail"] [data-action="actions"]').click();
  await page.locator(".conn-actions .conn-action").first().waitFor();
  assert.equal(await page.locator(".conn-actions .conn-action").count(), 5);
  await shot(
    "connector-actions",
    "Gmail action preferences with read/write categories and a disabled send action.",
  );

  await go("projects/manage");
  await page.locator(".manage-project-row").first().waitFor();
  assert.equal(await page.locator(".manage-project-row").count(), 10);
  await page.locator('[data-project-toggle="aurora-console"]').click();
  await page
    .locator('[data-project-id="aurora-console"] .manage-project-repo')
    .waitFor();
  await shot(
    "manage",
    "Projects Manage: project actions, expandable metadata and GitHub issues; no project mutation is performed.",
  );
  await go("inbox/jobs");
  await page.locator(".inb-job-row").first().waitFor();
  assert.equal(await page.locator(".inb-job-row").count(), 1);
  await shot(
    "jobs",
    "Inbox Jobs includes only commands with intervals and links to their recorded results.",
  );
  await go("projects/overview");
  await settleGraph();
  await page.keyboard.press("ControlOrMeta+k");
  await page.locator('[role="combobox"]').waitFor();
  await page.locator('[role="combobox"]').fill("Aurora");
  await page.locator(".cmdk-opt").first().waitFor();
  await shot(
    "command-palette",
    "Command palette searches canonical pages, actions and fictional projects without executing a result.",
  );
  await page.keyboard.press("Escape");

  await verifyWikiNavigation();

  assert.deepEqual(
    errors,
    [],
    "No console, page or HTTP errors while rendering documented states",
  );
  report.checks.push(
    "Every capture rendered using original source assets, with no source modifications or DOM/CSS substitutions.",
  );
  report.checks.push(
    "All data is synthetic; no xo-space runtime, upstream request, account write, credential or private workspace is used.",
  );
  report.checks.push(
    "Four primary tabs, local Wiki resource, ten projects, fifteen connectors, historical file preview, session table/detail, and polling drawer verified.",
  );
  console.log(
    `Captured ${report.screenshots.length} screenshots without browser errors.`,
  );
} catch (error) {
  report.failure = error.stack;
  await page
    .screenshot({ path: "/tmp/space-docs-capture-failure.png" })
    .catch(() => {});
  throw error;
} finally {
  await writeFile(
    resolve(here, "capture-report.json"),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  await browser.close();
}
