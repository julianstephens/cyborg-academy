import { SeminarService } from "@/services";
import minimist from "minimist";

const main = async () => {
  const seminarSVC = new SeminarService();
  const argv = minimist(process.argv.slice(2));

  if (argv.h || argv.help) {
    console.log("Usage: pnpm seminar <seminar-name> [options]");
    console.log("\nCreate a new seminar");
    console.log("\nOptions:");
    console.log("  -d, --description        optional seminar description");
    console.log("  -p, --in-progress        marks the seminar as in progress");
    console.log("  -c, --completed          marks the seminar as completed");
    console.log("  -h, --help               print usage instructions");
    return;
  }

  const title = argv._[0];
  if (!title) {
    console.error("error: no seminar name provided");
    return;
  }

  if ((argv.c || argv.completed) && (argv.p || argv["in-progress"])) {
    console.error("error: seminar cannot be both completed and in progress");
    return;
  }

  let completed = false;
  let inProgress = false;
  let description = undefined;

  if (argv.d) description = argv.d;
  if (argv.description) description = argv.description;
  if (argv.c || argv.completed) completed = true;
  if (argv.p || argv["in-progress"]) inProgress = true;

  await seminarSVC.create({
    title,
    completed,
    inProgress,
    description,
  });

  console.log("seminar created!");
};

await main();
