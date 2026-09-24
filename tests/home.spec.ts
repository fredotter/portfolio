import { test, expect, type Page } from "@playwright/test";
import { content } from "../src/content";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

test("desktop 1440×1311 screenshot matches the design height", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1311 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: "test-results/home-1440.png" });
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(1311);
});

for (const width of [360, 390, 768, 1024, 1280, 1440, 1920]) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    expect(await horizontalOverflow(page)).toBe(0);
    if (width === 390 || width === 768) {
      await page.screenshot({ path: `test-results/home-${width}.png`, fullPage: true });
    }
  });
}

test("audience switcher works with mouse and keyboard", async ({ page }) => {
  await page.goto("/");
  const intro = page.locator("[aria-live] p");
  const [first, ...rest] = content.personas;

  await expect(page.getByRole("button", { name: first.label, exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(intro).toHaveText(first.blurb);

  // Mouse
  for (const p of rest) {
    await page.getByRole("button", { name: p.label, exact: true }).click();
    await expect(intro).toHaveText(p.blurb);
    await expect(page.getByRole("button", { name: p.label, exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("button", { name: first.label, exact: true })).toHaveAttribute("aria-pressed", "false");
  }

  // Keyboard: Enter and Space on focused buttons
  const firstBtn = page.getByRole("button", { name: first.label, exact: true });
  await firstBtn.focus();
  await page.keyboard.press("Enter");
  await expect(intro).toHaveText(first.blurb);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: rest[0].label, exact: true })).toBeFocused();
  await page.keyboard.press("Space");
  await expect(intro).toHaveText(rest[0].blurb);
});

test("all text renders in the web fonts, not fallbacks", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);

  // document.fonts.check() for each face, using the family name next/font generated
  const checks = await page.evaluate(() => {
    const family = (sel: string) => getComputedStyle(document.querySelector(sel)!).fontFamily.split(",")[0];
    const serif = family("h1");
    const sans = family("nav a");
    const mono = family("footer a");
    const loaded = (fam: string, style: string) =>
      [...document.fonts].some((f) => f.family.replace(/['"]/g, "") === fam.replace(/['"]/g, "") && f.style === style && f.status === "loaded");
    return {
      plantinRegular: document.fonts.check(`400 24px ${serif}`) && loaded(serif, "normal"),
      plantinItalic: document.fonts.check(`italic 400 56px ${serif}`) && loaded(serif, "italic"),
      figtree: document.fonts.check(`400 15px ${sans}`) && loaded(sans, "normal"),
      plexMono: document.fonts.check(`400 15px ${mono}`) && loaded(mono, "normal"),
    };
  });
  expect(checks).toEqual({ plantinRegular: true, plantinItalic: true, figtree: true, plexMono: true });

  // Ask Chromium which font actually painted each text element
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("DOM.enable");
  await cdp.send("CSS.enable");
  const { root } = await cdp.send("DOM.getDocument", { depth: -1 });
  const expected: [string, string][] = [
    ["h1", "Plantin MT Pro"],
    ['p[role="group"] button', "Plantin MT Pro"],
    ["[aria-live] p", "Plantin MT Pro"],
    ["footer p:first-child", "Plantin MT Pro"],
    ["nav a", "Figtree"],
    ["main li", "Figtree"],
    ["footer p:nth-child(2)", "IBM Plex Mono"],
    ["footer a", "IBM Plex Mono"],
  ];
  for (const [selector, family] of expected) {
    const { nodeIds } = await cdp.send("DOM.querySelectorAll", { nodeId: root.nodeId, selector });
    expect(nodeIds.length, selector).toBeGreaterThan(0);
    for (const nodeId of nodeIds) {
      const { fonts } = await cdp.send("CSS.getPlatformFontsForNode", { nodeId });
      for (const f of fonts) {
        expect(f.isCustomFont, `${selector} painted with system font ${f.familyName}`).toBe(true);
        expect(f.familyName, selector).toContain(family);
      }
    }
  }
});
