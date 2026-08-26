import "dotenv/config";
import mysql from "mysql2/promise";

export async function pingDatabase(): Promise<
  | { ok: true; serverVersion: string }
  | { ok: false; code?: string; message: string }
> {
  const url = process.env.DATABASE_URL ?? "";
  if (!url) {
    return { ok: false, message: "DATABASE_URL ausente no ambiente" };
  }
  try {
    const connection = await mysql.createConnection(url);
    try {
      const [rows] = await connection.query("SELECT VERSION() AS v");
      const version = (rows as { v?: string }[])[0]?.v ?? "unknown";
      return { ok: true, serverVersion: version };
    } finally {
      await connection.end();
    }
  } catch (error) {
    const err = error as { code?: string; message: string };
    return { ok: false, code: err.code, message: err.message };
  }
}

const invokedDirectly = Boolean(
  process.argv[1]?.replace(/\\/g, "/").endsWith("server/db/ping.ts")
);
if (invokedDirectly) {
  pingDatabase().then(result => {
    if (result.ok) {
      console.log(`[db:ping] Conexão OK · MySQL ${result.serverVersion}`);
    } else {
      console.error(
        `[db:ping] Falhou ${result.code ? `(${result.code})` : ""}: ${result.message}`
      );
      process.exitCode = 1;
    }
  });
}
