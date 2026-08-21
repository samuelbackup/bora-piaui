import { chromium } from "playwright";

const baseUrl = process.env.BORA_PIAUI_URL ?? "http://127.0.0.1:3000/";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForPreview(page, expectedText) {
  await page.waitForFunction(
    ([selector, text]) => document.querySelector(selector)?.textContent?.includes(text),
    ["#contexto-do-polo", expectedText],
    { timeout: 1_000 },
  );
}

async function getAnimationName(page) {
  return page.locator("#contexto-do-polo").evaluate((element) => getComputedStyle(element).animationName);
}

async function waitForMapCount(page, expectedCount) {
  const label = `Mapa com ${expectedCount} ${expectedCount === 1 ? "destino" : "destinos"}`;
  await page.getByRole("region", { name: label, exact: true }).waitFor({ state: "visible", timeout: 1_000 });
}

async function runDesktop(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  const poles = page.locator('button[aria-describedby="contexto-do-polo"]');
  await poles.filter({ hasText: "Teresina" }).first().hover();
  await waitForPreview(page, "Contexto do polo · Polo Teresina");
  await page.waitForTimeout(25);
  assert(await getAnimationName(page) === "pole-preview-enter", "A prévia de Teresina não iniciou a animação esperada.");

  const startedAt = Date.now();
  await poles.filter({ hasText: "Costa do Delta" }).first().hover();
  await waitForPreview(page, "Contexto do polo · Costa do Delta");
  const hoverSwitchMs = Date.now() - startedAt;
  assert(hoverSwitchMs < 1_000, `A troca de prévia no desktop demorou ${hoverSwitchMs} ms.`);

  await poles.filter({ hasText: "Aventura e Mistério" }).first().click();
  await waitForPreview(page, "Contexto do polo · Aventura e Mistério");
  await waitForMapCount(page, 2);
  assert(
    await poles.filter({ hasText: "Aventura e Mistério" }).first().getAttribute("aria-pressed") === "true",
    "O filtro do polo Aventura e Mistério não foi aplicado no desktop.",
  );
  await page.close();
  return { hoverSwitchMs };
}

async function runMobile(browser) {
  const page = await browser.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  const poles = page.locator('button[aria-describedby="contexto-do-polo"]');
  await poles.filter({ hasText: "Teresina" }).first().click();
  await waitForPreview(page, "Contexto do polo · Polo Teresina");

  const startedAt = Date.now();
  await poles.filter({ hasText: "Costa do Delta" }).first().click();
  await waitForPreview(page, "Contexto do polo · Costa do Delta");
  await waitForMapCount(page, 2);
  const tapSwitchMs = Date.now() - startedAt;
  assert(tapSwitchMs < 1_000, `A troca de prévia no celular demorou ${tapSwitchMs} ms.`);
  assert(
    await poles.filter({ hasText: "Costa do Delta" }).first().getAttribute("aria-pressed") === "true",
    "O filtro Costa do Delta não foi aplicado no celular.",
  );
  await page.close();
  return { tapSwitchMs };
}

const browser = await chromium.launch({ headless: true });
try {
  const desktop = await runDesktop(browser);
  const mobile = await runMobile(browser);
  console.log(JSON.stringify({ status: "ok", desktop, mobile }, null, 2));
} finally {
  await browser.close();
}
