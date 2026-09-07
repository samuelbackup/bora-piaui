import mysql from "mysql2/promise";
import { Client } from "pg";

const mysqlUrl = process.env.DATABASE_URL_MYSQL;
const pgUrl = process.env.DATABASE_URL;

if (!mysqlUrl || !pgUrl) {
  console.error("Defina DATABASE_URL_MYSQL (origem MySQL) e DATABASE_URL (destino PostgreSQL) antes de executar.");
  process.exit(1);
}

const TABLES = [
  "users",
  "destinations",
  "destination_images",
  "cultural_events",
  "partner_submissions",
  "feedbacks",
  "usage_events",
] as const;

const BOOLEAN_FIELDS = new Set(["published", "isRead"]);
const needsSsl = /aivencloud\.com|render\.com|sslmode=required|ssl=true/i.test(pgUrl);

async function main() {
  const mysqlConn = await mysql.createConnection(mysqlUrl);
  const pg = new Client({
    connectionString: pgUrl,
    ...(needsSsl ? { ssl: { rejectUnauthorized: false } } : {}),
  });
  await pg.connect();

  await pg.query(`TRUNCATE ${[...TABLES].reverse().join(", ")} RESTART IDENTITY CASCADE`);

  for (const table of TABLES) {
    const [rawRows] = await mysqlConn.query(`SELECT * FROM \`${table}\``);
    const rows = rawRows as unknown as Record<string, unknown>[];
    if (!rows.length) {
      console.log(`${table}: 0 linhas`);
      continue;
    }
    const columns = Object.keys(rows[0]);
    const columnList = columns.map(column => `"${column}"`).join(", ");
    const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");

    for (const row of rows) {
      const values = columns.map(column => {
        const value = row[column];
        if (BOOLEAN_FIELDS.has(column)) return Boolean(value);
        return value;
      });
      await pg.query(`INSERT INTO "${table}" (${columnList}) VALUES (${placeholders})`, values);
    }

    await pg.query(
      `SELECT setval(pg_get_serial_sequence('${table}', 'id'), COALESCE((SELECT MAX(id) FROM "${table}"), 0) + 1, false)`
    );
    console.log(`${table}: ${rows.length} linhas copiadas`);
  }

  await mysqlConn.end();
  await pg.end();
  console.log("Migracao concluida. Revise os horarios de eventos com data marcada (conversao de fuso MySQL -> PostgreSQL).");
}

main().catch(error => {
  console.error("Falha na migracao:", error);
  process.exit(1);
});
