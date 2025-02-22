import { get_db } from "@/db";
import { NewSeminar, SeminarUpdate } from "@/models";
import type { Seminar } from "cyborg-utils";
import { Expression } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";

const db = await get_db();

const seminarSessions = (seminarId: Expression<string>) => {
  return jsonArrayFrom(
    db
      .selectFrom("seminarSession")
      .selectAll()
      .where("seminarSession.draft", "=", false)
      .where("seminarSession.seminarId", "=", seminarId),
  );
};

export async function findSeminarById(id: string) {
  return await db
    .selectFrom("seminar")
    .where("slug", "=", id)
    .selectAll()
    .select(({ ref }) => [seminarSessions(ref("seminar.id")).as("sessions")])
    .executeTakeFirst();
}

export async function findSeminars(criteria: Partial<Seminar>) {
  let query = db.selectFrom("seminar").selectAll();

  if (criteria.id) {
    query = query.where("id", "=", criteria.id);
  }

  if (criteria.title) {
    query = query.where("title", "=", criteria.title);
  }

  if (criteria.draft) {
    query = query.where("draft", "=", criteria.draft);
  }

  if (criteria.createdAt) {
    query = query.where("createdAt", "=", criteria.createdAt);
  }

  if (criteria.updatedAt) {
    query = query.where("updatedAt", "=", criteria.updatedAt);
  }

  return await query
    .select(({ ref }) => [seminarSessions(ref("seminar.id")).as("sessions")])
    .execute();
}

export async function updateSeminar(id: string, updateWith: SeminarUpdate) {
  await db
    .updateTable("seminar")
    .set(updateWith)
    .where("slug", "=", id)
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
    .where("slug", "=", id)
    .returningAll()
    .executeTakeFirst();
}
