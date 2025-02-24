import { Database } from "@/models";
import "dotenv/config";
import { promises as fs } from "fs";
import {
  FileMigrationProvider,
  Kysely,
  Migrator,
  PostgresDialect,
} from "kysely";
import { run } from "kysely-migration-cli";
import * as path from "path";
import pg from "pg";

const migrationFolder = new URL("../migrations", import.meta.url).pathname;

const pgPool = new pg.Pool({
  connectionString: process.env.DB_URL,
  max: 10,
});

const db = new Kysely<Database>({
  dialect: new PostgresDialect({ pool: pgPool }),
});

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder,
  }),
});

run(db, migrator, migrationFolder);
