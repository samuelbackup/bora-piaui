import { describe, expect, it } from "vitest";
import { enforceRateLimit } from "./rateLimit";

const req = { headers: { "x-forwarded-for": "203.0.113.10" } };
const otherReq = { headers: { "x-forwarded-for": "198.51.100.20" } };
const opts = { max: 2, windowMs: 60_000 };

describe("enforceRateLimit", () => {
  it("permite até o limite, bloqueia quem excede e isola por IP", () => {
    expect(() => enforceRateLimit(req, "teste", opts)).not.toThrow();
    expect(() => enforceRateLimit(req, "teste", opts)).not.toThrow();
    expect(() => enforceRateLimit(req, "teste", opts)).toThrowError(
      /Muitas tentativas/
    );
    expect(() => enforceRateLimit(otherReq, "teste", opts)).not.toThrow();
  });

  it("ignora chamadas sem requisição (testes/cron)", () => {
    expect(() => enforceRateLimit(undefined, "teste", opts)).not.toThrow();
  });
});
