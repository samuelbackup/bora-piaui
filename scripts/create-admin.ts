import { randomBytes, scryptSync } from "crypto";
import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import mysql from "mysql2/promise";
import { users } from "../server/database/schema";

const email = (process.argv[2] ?? "").trim().toLowerCase();
const password = process.argv[3] ?? "";
const name = process.argv[4] ?? "Administrador";

if (!email || !password || password.length < 8) {
  console.error("Uso: npx tsx scripts/create-admin.ts <email> <senhamin8> [nome]");
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error("Defina DATABASE_URL antes de rodar este script.");
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64).toString("hex");
const passwordHash = `${salt}:${hash}`;

const pool = mysql.createPool(process.env.DATABASE_URL);
const db = drizzle(pool);

const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
if (existing.length) {
  await db.update(users).set({ passwordHash, role: "admin", name }).where(eq(users.id, existing[0].id));
  console.log(`Senha redefinida para o admin existente: ${email}`);
} else {
  const openId = `local_${randomBytes(8).toString("hex")}`;
  await db.insert(users).values({ openId, email, name, passwordHash, role: "admin" });
  console.log(`Admin criado: ${email} (openId ${openId})`);
}
await pool.end();
