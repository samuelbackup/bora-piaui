import { chromium } from "playwright";

const width = Number(process.argv[2] ?? 400);
const height = Number(process.argv[3] ?? 689);
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width, height } });

await page.goto("http://127.0.0.1:3000/dados", { waitUntil: "networkidle" });

const report = await page.evaluate(() => {
  const viewport = window.innerWidth;
  const overflowing = [...document.querySelectorAll("*")]
    .map((element) => {
      const box = element.getBoundingClientRect();
      return {
        tag: element.tagName,
        className: element.className?.toString().slice(0, 160) ?? "",
        id: element.id,
        left: Math.round(box.left),
        right: Math.round(box.right),
        width: Math.round(box.width),
        scrollWidth: element.scrollWidth,
      };
    })
    .filter((element) => element.right > viewport + 1 || element.left < -1 || element.scrollWidth > viewport + 1)
    .slice(0, 20);

  return {
    viewport,
    documentWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
    overflowing,
  };
});

console.log(JSON.stringify(report, null, 2));
await browser.close();
