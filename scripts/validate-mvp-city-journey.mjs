import { chromium } from "playwright";

const baseUrl = process.env.BORA_PIAUI_URL ?? "http://127.0.0.1:3000/";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function selectCityFromHome(page, index, expectedSlug, expectedName) {
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  const cityLinks = page.getByRole("link", { name: "Explorar cidade" });
  await cityLinks.nth(index).waitFor({ state: "visible" });
  await Promise.all([
    page.waitForURL(new RegExp(`/cidades/${expectedSlug}$`), { timeout: 10_000 }),
    cityLinks.nth(index).click(),
  ]);
  await page.getByRole("heading", { name: expectedName, exact: true }).waitFor({ state: "visible" });
}

async function runLoadingState(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(new URL("/cidades/teresina?mvpLoading=1", baseUrl).href, { waitUntil: "domcontentloaded" });
  await page.getByText("Preparando a cidade", { exact: true }).waitFor({ state: "visible" });
  await page.getByRole("heading", { name: "Teresina", exact: true }).waitFor({ state: "visible", timeout: 5_000 });
  await page.close();
}

async function runDesktop(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await selectCityFromHome(page, 0, "teresina", "Teresina");

  await page.getByLabel("Tipo de item").selectOption("business");
  await page.getByText("Negócios em curadoria", { exact: true }).waitFor({ state: "visible" });
  await page.getByLabel("Tipo de item").selectOption("all");
  await page.getByText("Contato não publicado", { exact: true }).first().waitFor({ state: "visible" });
  await page.getByRole("link", { name: "Ver detalhes", exact: true }).first().waitFor({ state: "visible" });

  await page.locator("#mapa-destino-ativo").scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector("#mapa-destino-ativo")?.textContent?.includes("Encontro dos Rios"), null, { timeout: 10_000 });
  const routeLink = page.getByRole("link", { name: "Abrir rota", exact: true }).first();
  assert((await routeLink.getAttribute("href"))?.includes("google.com/maps/dir"), "A rota prática de Teresina não usa a URL pública esperada.");

  await Promise.all([
    page.waitForURL(/\/roteiros\/teresina-ponto-de-partida$/, { timeout: 10_000 }),
    page.getByRole("link", { name: "Ver roteiro de 1 dia" }).click(),
  ]);
  await page.getByRole("heading", { name: "Teresina como ponto de partida", exact: true }).waitFor({ state: "visible" });
  await page.close();
}

async function runContact(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await selectCityFromHome(page, 2, "sao-raimundo-nonato", "São Raimundo Nonato");
  const contactLink = page.getByRole("link", { name: "Contato", exact: true });
  await contactLink.waitFor({ state: "visible" });
  assert(await contactLink.getAttribute("href") === "https://www.gov.br/icmbio/pt-br/canais_atendimento", "O contato institucional do ICMBio não corresponde ao canal público confirmado.");
  assert(await contactLink.getAttribute("target") === "_blank", "O contato institucional deveria abrir em nova aba.");
  const [contactPage] = await Promise.all([page.waitForEvent("popup"), contactLink.click()]);
  await contactPage.close();
  await page.close();
}

async function runProximity(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await selectCityFromHome(page, 0, "teresina", "Teresina");

  await page.locator("#por-perto").scrollIntoViewIfNeeded();
  await page.getByRole("heading", { name: "O que há por perto de Encontro dos Rios", exact: true }).waitFor({ state: "visible" });
  await page.locator("#por-perto").getByRole("heading", { name: "Polo Cerâmico do Poti Velho", exact: true }).waitFor({ state: "visible" });
  const proximityRoute = page.locator("#por-perto").getByRole("link", { name: "Abrir rota", exact: true });
  assert((await proximityRoute.getAttribute("href"))?.includes("Polo%20Ceramico%20do%20Poti%20Velho"), "A relação de proximidade não aponta para a rota pública do Poti Velho.");

  await Promise.all([
    page.waitForURL(/\/cidades\/teresina\/locais\/polo-ceramico-poti-velho$/, { timeout: 10_000 }),
    page.getByRole("link", { name: "Conhecer o local", exact: true }).click(),
  ]);
  await page.getByRole("heading", { name: "Polo Cerâmico do Poti Velho", exact: true }).waitFor({ state: "visible" });
  await page.close();
}

async function runSerraProximity(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await selectCityFromHome(page, 2, "sao-raimundo-nonato", "São Raimundo Nonato");

  await page.locator("#por-perto").scrollIntoViewIfNeeded();
  await page.getByRole("heading", { name: "O que há por perto de Parque Nacional Serra da Capivara", exact: true }).waitFor({ state: "visible" });
  await page.locator("#por-perto").getByRole("heading", { name: "Museu do Homem Americano", exact: true }).waitFor({ state: "visible" });
  const sourceLink = page.locator("#por-perto").getByRole("link", { name: /FUMDHAM/ });
  assert((await sourceLink.getAttribute("href"))?.includes("fumdham.org.br"), "A relação da Serra da Capivara não mantém a fonte institucional do museu.");
  await page.close();
}

async function runMobile(browser) {
  const page = await browser.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  await selectCityFromHome(page, 1, "cajueiro-da-praia", "Cajueiro da Praia");
  await page.locator("#por-perto").scrollIntoViewIfNeeded();
  await page.getByRole("heading", { name: "O que há por perto de Barra Grande", exact: true }).waitFor({ state: "visible" });
  await page.locator("#por-perto").getByRole("heading", { name: "Cajueiro-rei do Piauí", exact: true }).waitFor({ state: "visible" });
  await Promise.all([
    page.waitForURL(/\/cidades\/cajueiro-da-praia\/locais\/cajueiro-rei$/, { timeout: 10_000 }),
    page.locator("#por-perto").getByRole("link", { name: "Conhecer o local", exact: true }).click(),
  ]);
  await page.getByRole("heading", { name: "Cajueiro-rei do Piauí", exact: true }).waitFor({ state: "visible", timeout: 10_000 });
  await page.close();
}

const browser = await chromium.launch({ headless: true });
try {
  await runLoadingState(browser);
  await runDesktop(browser);
  await runContact(browser);
  await runProximity(browser);
  await runSerraProximity(browser);
  await runMobile(browser);
  console.log(JSON.stringify({ status: "ok", loading: "Teresina", desktop: "Teresina", contact: "ICMBio", proximity: ["Encontro dos Rios → Poti Velho", "Serra da Capivara → Museu do Homem Americano", "Barra Grande → Cajueiro-rei"], mobile: "Cajueiro da Praia" }, null, 2));
} finally {
  await browser.close();
}
