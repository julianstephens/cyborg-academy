import { env } from "@/env";
import logger from "@/logger";
import { Database } from "@/models";
import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";

export const pgPool = new pg.Pool({
  connectionString: env.DB_URL,
  max: 10,
});

async function checkDatabaseConnection() {
  try {
    await pgPool.query("SELECT 1");
    logger.info("database connection healthy");
  } catch (error) {
    logger.error("database connection check failed:", error);
    throw error;
  }
}

await checkDatabaseConnection();

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({ pool: pgPool }),
  log(event) {
    if (event.level === "error") {
      logger.error({
        event: "query",
        durationMs: event.queryDurationMillis,
        error: event.error,
        sql: event.query.sql,
        params: event.query.parameters,
      });
    } else {
      logger.info({
        event: "query",
        durationMs: event.queryDurationMillis,
        sql: event.query.sql,
        params: event.query.parameters,
      });
    }
  },
});

export const get_db = async () => {
  await checkDatabaseConnection();
  return db;
};
