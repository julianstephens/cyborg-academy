import { copyFile } from "fs/promises";
import minimist from "minimist";
import path from "path";
import { fileURLToPath } from "url";
import { getTimestamp } from "../../src/utils";

const __filename = fileURLToPath(import.meta.url);

const main = async () => {
  const argv = minimist(process.argv.slice(2));
  const migrationName = argv._[0];
  if (!migrationName) throw TypeError;
  const filename = `${getTimestamp()}-${migrationName}.ts`;
  try {
    await copyFile(
      path.join(path.dirname(__filename), "template.ts"),
      path.join(path.dirname(__filename), "..", filename),
    );
    console.log("migration created: ");
  } catch (err) {
    console.error("unable to create migration");
  }
};

await main();

export {};
