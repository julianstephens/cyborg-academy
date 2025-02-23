import { get_db } from "@/db";
import "dotenv/config";
import { promises as fs } from "fs";
import { FileMigrationProvider, Migrator } from "kysely";
import { run } from "kysely-migration-cli";
import * as path from "path";

const migrationFolder = new URL("../migrations", import.meta.url).pathname;

const db = await get_db();

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder,
  }),
});

run(db, migrator, migrationFolder);
