import { db } from "@/db";
import { NewSeminar, SeminarUpdate } from "@/models";
import { Seminar } from "cyborg-utils";
import { Expression } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";

const seminarSessions = (seminarId: Expression<string>) => {
  return jsonArrayFrom(
    db
      .selectFrom("seminarSession")
      .selectAll()
      .where("seminarSession.seminarId", "=", seminarId),
  );
};

export async function findSeminarById(id: string) {
  return await db
    .selectFrom("seminar")
    .where("id", "=", id)
    .selectAll()
    .select((eb) => [
      jsonArrayFrom(
        eb
          .selectFrom("seminarSession")
          .whereRef("seminarSession.seminarId", "=", "seminar.id"),
      ).as("sessions"),
    ])
    .executeTakeFirst();
}

export async function findSeminars(criteria: Partial<Seminar>) {
  let query = db.selectFrom("seminar");

  if (criteria.id) {
    query = query.where("id", "=", criteria.id); // Kysely is immutable, you must re-assign!
  }

  if (criteria.title) {
    query = query.where("title", "=", criteria.title);
  }

  if (criteria.createdAt) {
    query = query.where("createdAt", "=", criteria.createdAt);
  }

  if (criteria.updatedAt) {
    query = query.where("updatedAt", "=", criteria.updatedAt);
  }

  return await query
    .selectAll()
    .select(({ ref }) => [seminarSessions(ref("seminar.id")).as("sessions")])
    .execute();
}

export async function updateSeminar(id: string, updateWith: SeminarUpdate) {
  await db
    .updateTable("seminar")
    .set(updateWith)
    .where("id", "=", id)
    .execute();
}

export async function createSeminar(seminar: NewSeminar) {
  return await db
    .insertInto("seminar")
    .values(seminar)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function deleteSeminar(id: string) {
  return await db
    .deleteFrom("seminar")
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
}
