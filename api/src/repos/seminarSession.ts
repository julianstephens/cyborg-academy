import { db } from "@/db";
import { NewSeminarSession, SeminarSessionUpdate } from "@/models";
import type { SeminarSession } from "cyborg-utils";

export async function findSeminarSessionById(id: string) {
  return await db
    .selectFrom("seminarSession")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirst();
}

export async function findSeminarSessions(criteria: Partial<SeminarSession>) {
  let query = db.selectFrom("seminarSession");

  if (criteria.id) {
    query = query.where("id", "=", criteria.id);
  }

  if (criteria.seminarId) {
    query = query.where("seminarId", "=", criteria.seminarId);
  }

  if (criteria.title) {
    query = query.where("title", "=", criteria.title);
  }

  if (criteria.description) {
    query = query.where("description", "=", criteria.description);
  }

  if (criteria.locked) {
    query = query.where("locked", "=", criteria.locked);
  }

  if (criteria.createdAt) {
    query = query.where("createdAt", "=", criteria.createdAt);
  }

  if (criteria.updatedAt) {
    query = query.where("updatedAt", "=", criteria.updatedAt);
  }

  return await query.selectAll().orderBy("order asc").execute();
}

export async function updateSeminarSession(
  id: string,
  updateWith: SeminarSessionUpdate,
) {
  await db
    .updateTable("seminarSession")
    .set(updateWith)
    .where("id", "=", id)
    .execute();
}

export async function createSeminarSession(seminar: NewSeminarSession) {
  return await db
    .insertInto("seminarSession")
    .values(seminar)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function deleteSeminarSession(id: string) {
  return await db
    .deleteFrom("seminarSession")
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
}
