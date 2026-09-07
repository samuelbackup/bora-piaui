import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

const geocodeCache = new Map<string, { lat: number; lng: number } | null>();
const GEOCODE_TTL_MS = 1000 * 60 * 60 * 24 * 7;

async function nominatimLookup(query: string): Promise<{ lat: number; lng: number } | null> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  const response = await fetch(url, {
    headers: {
      "User-Agent": "UmboraPiaui/1.0 (https://bora-piaui.vercel.app)",
      "Accept": "application/json",
    },
  });
  if (!response.ok) return null;
  const data = (await response.json()) as Array<{ lat: string; lon: string }>;
  const first = data[0];
  if (!first) return null;
  const lat = Number(first.lat);
  const lng = Number(first.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

function registerGeocodeProxy(app: import("express").Express) {
  app.get("/api/geocode", async (req: import("express").Request, res: import("express").Response) => {
    const query = String(req.query.q ?? "").trim();
    if (!query) {
      res.status(400).json({ error: "missing q" });
      return;
    }
    const cacheKey = query.toLowerCase();
    if (geocodeCache.has(cacheKey)) {
      const cached = geocodeCache.get(cacheKey) ?? null;
      res.json({ lat: cached?.lat ?? null, lng: cached?.lng ?? null, cached: true });
      return;
    }
    try {
      const result = await nominatimLookup(query);
      geocodeCache.set(cacheKey, result);
      setTimeout(() => geocodeCache.delete(cacheKey), GEOCODE_TTL_MS).unref?.();
      res.json({ lat: result?.lat ?? null, lng: result?.lng ?? null, cached: false });
    } catch (error) {
      console.error("[Geocode] error:", error);
      res.status(502).json({ error: "geocode upstream failed" });
    }
  });
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  app.use(express.json({ limit: "12mb" }));
  app.use(express.urlencoded({ limit: "12mb", extended: true }));
  registerStorageProxy(app);
  registerGeocodeProxy(app);
  app.get("/api/healthz", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
