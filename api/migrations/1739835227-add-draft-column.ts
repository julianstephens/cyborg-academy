import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("seminar")
    .addColumn("draft", "boolean", (col) => col.notNull())
    .execute();
  await db.schema
    .alterTable("seminarSession")
    .addColumn("draft", "boolean", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("seminar").dropColumn("draft").execute();
  await db.schema.alterTable("seminarSession").dropColumn("draft").execute();
}
