import { SeminarService, SeminarSessionService } from "@/services";
import { faker } from "@faker-js/faker";

const main = async () => {
  const seminarSVC = new SeminarService();
  const sessionSVC = new SeminarSessionService();
  const numSeminars = 3;
  const numSessions = [6, 3, 10];

  for (let i = 0; i < numSeminars; i++) {
    const inProgress = faker.datatype.boolean();
    const sem = await seminarSVC.create({
      title: "Test " + i,
      inProgress,
      completed: !inProgress,
    });
    console.log("\n* created seminar: " + sem.title + " (" + sem.id + ")");
    for (let j = 0; j < numSessions[i]; j++) {
      const sess = await sessionSVC.create({
        title: "Test Session " + j,
        description: faker.word.words({ count: { min: 5, max: 10 } }),
        order: j + 1,
        locked: faker.datatype.boolean(),
        seminarId: sem.id,
      });
      console.log(
        " ==> created seminar session: " + sess.title + " (" + sess.id + ")",
      );
    }
  }
};

await main();
