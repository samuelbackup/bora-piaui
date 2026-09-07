import { readFileSync } from "node:fs";
import path from "node:path";
import { newDb } from "pg-mem";
import { describe, expect, it } from "vitest";

const migrationPath = path.resolve(import.meta.dirname, "0000_sweet_onslaught.sql");

function applyMigration() {
  const db = newDb();
  const sql = readFileSync(migrationPath, "utf8");
  const statements = sql
    .split("--> statement-breakpoint")
    .map(statement => statement.trim().replace(/"public"\./g, ""))
    .filter(Boolean);
  for (const statement of statements) {
    db.public.none(statement);
  }
  return db;
}

const DESTINATION_SQL = `INSERT INTO destinations ("slug", "title", "polo", "category", "municipality", "summary", "description", "mapQuery", "routeUrl", "sourceName", "sourceUrl", "sourceYear")
  VALUES ('encontro-dos-rios', 'Encontro dos Rios', 'Teresina', 'natureza', 'Teresina', 'Resumo editorial', 'Descricao editorial', 'Encontro dos Rios Teresina', 'https://maps.google.com', 'Fonte oficial', 'https://fonte.example', '2026')`;

describe("migration inicial do PostgreSQL", () => {
  it("aplica a migration 0000 sem erros", () => {
    expect(() => applyMigration()).not.toThrow();
  });

  it("cria tabelas com serial, enums nativos e defaults", () => {
    const db = applyMigration();

    db.public.none("INSERT INTO users (\"openId\", \"name\") VALUES ('local_test', 'Teste')");
    const user = db.public.many("SELECT * FROM users")[0];
    expect(user.id).toBe(1);
    expect(user.role).toBe("user");

    db.public.none(DESTINATION_SQL);
    const destination = db.public.many("SELECT * FROM destinations")[0];
    expect(destination.id).toBe(1);
    expect(destination.published).toBe(true);
    expect(destination.operationalStatus).toBe("verificar");

    db.public.none("INSERT INTO feedbacks (\"category\", \"message\") VALUES ('elogio', 'Mensagem de teste')");
    const feedback = db.public.many("SELECT * FROM feedbacks")[0];
    expect(feedback.isRead).toBe(false);
  });

  it("propaga exclusao de destino para imagens via FK cascade", () => {
    const db = applyMigration();

    db.public.none(DESTINATION_SQL);
    db.public.none("INSERT INTO destination_images (\"destinationId\", \"imageUrl\", \"altText\") VALUES (1, 'https://img.example/foto.jpg', 'Foto do destino')");
    expect(db.public.many("SELECT * FROM destination_images")).toHaveLength(1);

    db.public.none("DELETE FROM destinations WHERE id = 1");
    expect(db.public.many("SELECT * FROM destination_images")).toHaveLength(0);
  });
});
