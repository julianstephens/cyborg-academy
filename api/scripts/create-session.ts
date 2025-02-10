import { SeminarSessionService } from "@/services";
import minimist from "minimist";

const main = async () => {
  const sessionSVC = new SeminarSessionService();
  const argv = minimist(process.argv.slice(2));

  if (argv.h || argv.help) {
    console.log("Usage: pnpm session <session-name> [options]");
    console.log("\nCreate a new seminar");
    console.log("\nOptions:");
    console.log("  -s, --seminar            the seminar to link to");
    console.log("  -d, --description        the seminar description");
    console.log("  -u, --unlocked           marks the seminar as unlocked");
    console.log("  -o, --order              the display order");
    console.log("  -h, --help               print usage instructions");
    return;
  }

  const title = argv._[0];
  if (!title) {
    console.error("error: no session name provided");
    return;
  }

  if (!argv.s && !argv.seminar) {
    console.error("error: no seminar id provided");
    return;
  }
  const seminarId = argv.s ?? argv.session;

  if (!argv.o && !argv.order) {
    console.error("error: no session order provided");
    return;
  }
  const order = argv.o ?? argv.order;

  if (!argv.d && !argv.description) {
    console.error("error: no session description provided");
    return;
  }
  const description = argv.d ?? argv.description;

  let locked = true;
  if (argv.u || argv.unlocked) locked = false;

  await sessionSVC.create({
    title,
    seminarId,
    order,
    locked,
    description,
  });

  console.log("session created!");
};

await main();
