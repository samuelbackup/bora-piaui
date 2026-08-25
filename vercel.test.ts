import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const vercelConfig = readFileSync(new URL("./vercel.json", import.meta.url), "utf8");
const robots = readFileSync(new URL("./client/public/robots.txt", import.meta.url), "utf8");

describe("publicação Vercel limitada", () => {
  it("impede indexação enquanto a API externa não está integrada", () => {
    expect(vercelConfig).toContain('"X-Robots-Tag"');
    expect(vercelConfig).toContain("noindex, nofollow, noarchive");
    expect(robots).toContain("User-agent: *");
    expect(robots).toContain("Disallow: /");
  });
});
