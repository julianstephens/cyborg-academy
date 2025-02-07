import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("seminar")
    .addColumn("id", "varchar", (col) => col.primaryKey())
    .addColumn("title", "varchar", (col) => col.notNull())
    .addColumn("createdAt", "bigint", (col) => col.notNull())
    .addColumn("updatedAt", "bigint", (col) => col.notNull())
    .execute();
  await db.schema
    .createTable("seminarSession")
    .addColumn("id", "varchar", (col) => col.primaryKey())
    .addColumn("seminarId", "varchar", (col) =>
      col.references("seminar.id").onDelete("cascade").notNull(),
    )
    .addColumn("title", "varchar", (col) => col.notNull())
    .addColumn("description", "varchar")
    .addColumn("locked", "boolean", (col) => col.notNull())
    .addColumn("readings", sql`varchar[]`)
    .addColumn("notes", sql`varchar[]`)
    .addColumn("createdAt", "bigint", (col) => col.notNull())
    .addColumn("updatedAt", "bigint", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("seminar").execute();
  await db.schema.dropTable("seminarSession").execute();
}
