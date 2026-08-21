import { chromium } from "playwright";

const baseUrl = process.env.BORA_PIAUI_URL ?? "http://127.0.0.1:3000/";
const title = "Validação temporária da Agenda Bora Piauí";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function removeTemporaryEvent(page) {
  await page.goto(new URL("/admin/editorial", baseUrl).href, { waitUntil: "domcontentloaded" });
  const eventCard = page.locator("article").filter({ hasText: title });
  if (await eventCard.count() === 0) return;
  await eventCard.getByRole("button", { name: "Remover", exact: true }).click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Remover programação", exact: true }).click();
  await eventCard.waitFor({ state: "hidden", timeout: 10_000 });
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

try {
  await removeTemporaryEvent(page);
  await page.goto(new URL("/admin/editorial", baseUrl).href, { waitUntil: "domcontentloaded" });

  await page.getByLabel("Título").fill(title);
  await page.getByLabel("Cidade").fill("Teresina");
  await page.getByLabel("Data de início").fill("2026-09-12");
  await page.getByLabel(/Data de término/).fill("2026-09-14");
  await page.getByLabel("Local").fill("Espaço de validação temporária");
  await page.getByLabel("Resumo editorial").fill("Registro temporário criado somente para validar o período e a remoção da programação editorial.");
  await page.getByLabel("Nome da fonte").fill("Fonte de validação local");
  await page.getByLabel("URL da fonte").fill("https://www.gov.br/");
  await page.getByRole("button", { name: "Adicionar rascunho", exact: true }).click();

  const eventCard = page.locator("article").filter({ hasText: title });
  await eventCard.waitFor({ state: "visible", timeout: 10_000 });
  assert((await eventCard.textContent())?.includes("12/09/2026 — 14/09/2026"), "A Revisão Editorial não exibiu o período completo da programação.");

  await eventCard.getByRole("button", { name: "Publicar", exact: true }).click();
  await eventCard.getByRole("button", { name: "Despublicar", exact: true }).waitFor({ state: "visible" });

  await page.goto(new URL("/agenda", baseUrl).href, { waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { name: title, exact: true }).waitFor({ state: "visible", timeout: 10_000 });

  await removeTemporaryEvent(page);
  await page.goto(new URL("/agenda", baseUrl).href, { waitUntil: "domcontentloaded" });
  assert(await page.getByRole("heading", { name: title, exact: true }).count() === 0, "A programação removida ainda aparece na Agenda pública.");

  console.log(JSON.stringify({ status: "ok", period: "12/09/2026 — 14/09/2026", publication: "publicar e despublicar preservados", removal: "evento removido da Revisão Editorial e da Agenda" }, null, 2));
} finally {
  try {
    await removeTemporaryEvent(page);
  } finally {
    await browser.close();
  }
}
