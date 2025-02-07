import pg from "pg";
import { env } from "./env";
import { Kysely, PostgresDialect } from "kysely";
import { Database } from "./models";

export const pgPool = new pg.Pool({
  connectionString: env.DB_URL,
  max: 10,
});

const dialect = new PostgresDialect({ pool: pgPool });

export const db = new Kysely<Database>({ dialect });
