import { getTimestamp } from "@/utils";
import { copyFile } from "fs/promises";
import minimist from "minimist";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const main = async () => {
  const argv = minimist(process.argv.slice(2));
  const migrationName = argv._[0];
  if (!migrationName) {
    console.error("no migration name provided");
    throw TypeError;
  }
  const filename = `${getTimestamp()}-${migrationName}.ts`;
  try {
    await copyFile(
      path.join(path.dirname(__filename), "template.ts"),
      path.join(path.dirname(__filename), "..", "migrations", filename),
    );
    console.log("migration created");
  } catch {
    console.error("unable to create migration");
  }
};

await main();

export {};
