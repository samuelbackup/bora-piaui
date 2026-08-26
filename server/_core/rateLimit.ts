import { TRPCError } from "@trpc/server";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 10_000;

type MinimalRequest = {
  headers: Record<string, unknown>;
  socket?: { remoteAddress?: string };
};

export function clientIpFromReq(req: MinimalRequest) {
  const forwarded = req.headers["x-forwarded-for"];
  const first =
    typeof forwarded === "string"
      ? forwarded.split(",")[0]?.trim()
      : Array.isArray(forwarded)
        ? forwarded[0]
        : undefined;
  return first || req.socket?.remoteAddress || "unknown";
}

export function enforceRateLimit(
  req: MinimalRequest | undefined,
  scope: string,
  opts: { max: number; windowMs: number }
) {
  if (!req?.headers) return;
  const now = Date.now();
  const key = `${scope}:${clientIpFromReq(req)}`;
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    if (buckets.size > MAX_BUCKETS) {
      buckets.forEach((value, bucketKey) => {
        if (value.resetAt <= now) buckets.delete(bucketKey);
      });
    }
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
    return;
  }

  if (bucket.count >= opts.max) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message:
        "Muitas tentativas seguidas. Aguarde alguns minutos antes de tentar novamente.",
    });
  }

  bucket.count += 1;
}
