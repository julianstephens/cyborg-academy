import { NewSeminar, SeminarUpdate } from "@/models.js";
import * as repo from "@/repos/seminar.js";
import { S3Service } from "@/services";
import { getTimestamp } from "@/utils.js";
import { APIError, isEmpty, type Seminar } from "cyborg-utils";
import { StatusCodes } from "http-status-codes";
import { nanoid } from "nanoid";
import { PostgresError } from "pg-error-enum";

class SeminarService {
  s3: S3Service;

  constructor() {
    this.s3 = new S3Service();
  }

  #genSlug = (title: string) => {
    return title.toLowerCase().replaceAll(" ", "-");
  };

  #populateRemoteResources = async (seminar: Seminar) => {
    if (
      seminar.sessions &&
      seminar.sessions.length > 0 &&
      !isEmpty(seminar.sessions[0])
    ) {
      seminar.sessions = (await Promise.all(
        seminar.sessions.map(async (sess) => {
          const readings = await this.s3.listReadings(seminar.slug, sess.order);
          if (readings) sess.readings = readings;
          return sess;
        }),
      )) as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    }
    return seminar;
  };

  get = async (id: string): Promise<Seminar | undefined> => {
    const seminar = await repo.findSeminarById(id);
    return seminar ? await this.#populateRemoteResources(seminar) : seminar;
  };

  list = async (filters: Partial<Seminar> = { draft: false }) => {
    const seminars = await repo.findSeminars(filters);
    const res = [];

    for (const seminar of seminars) {
      const populatedSeminar = await this.#populateRemoteResources(seminar);
      res.push(populatedSeminar);
    }
    return res;
  };

  create = async (
    seminar: Omit<NewSeminar, "id" | "slug" | "createdAt" | "updatedAt">,
  ): Promise<Seminar> => {
    const newSeminar: NewSeminar = {
      id: nanoid(),
      ...seminar,
      slug: this.#genSlug(seminar.title),
      createdAt: getTimestamp(),
      updatedAt: getTimestamp(),
    };
    try {
      const s = await repo.createSeminar(newSeminar);
      return await this.#populateRemoteResources(s);
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "code" in err &&
        err.code === PostgresError.UNIQUE_VIOLATION
      ) {
        throw {
          status: StatusCodes.CONFLICT,
          message: `seminar with slug ${newSeminar.slug} already exists`,
        } as APIError;
      }
      throw err;
    }
  };

  update = async (id: string, updates: SeminarUpdate): Promise<Seminar> => {
    await repo.updateSeminar(id, { ...updates, updatedAt: getTimestamp() });
    const seminar = await repo.findSeminarById(id);
    if (!seminar) throw Error("unable to retrieve seminar");
    return await this.#populateRemoteResources(seminar);
  };

  delete = async (id: string): Promise<Seminar | undefined> => {
    return await repo.deleteSeminar(id);
  };
}

export default SeminarService;
