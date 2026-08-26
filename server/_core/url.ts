import { z } from "zod";

export function externalUrl(max: number) {
  return z
    .string()
    .url()
    .max(max)
    .refine(value => {
      try {
        const { protocol } = new URL(value);
        return (
          protocol === "https:" ||
          (process.env.NODE_ENV !== "production" && protocol === "http:")
        );
      } catch {
        return false;
      }
    }, "A URL deve usar o esquema https.");
}
