import logger from "@/logger";
import { NewSeminar, SeminarUpdate } from "@/models";
import * as repo from "@/repos/seminar";
import { getTimestamp } from "@/utils";
import { Seminar } from "cyborg-types";
import { nanoid } from "nanoid";

class SeminarService {
  get = async (id: string): Promise<Seminar | undefined> => {
    if (!id) throw TypeError;

    return await repo.findSeminarById(id);
  };

  list = async (filters: Partial<Seminar> = {}) => {
    return await repo.findSeminars(filters);
  };

  create = async (title: string): Promise<Seminar> => {
    if (!title) {
      logger.error("unable to create seminar with empty title");
      throw TypeError;
    }

    const newSeminar: NewSeminar = {
      id: nanoid(),
      title,
      createdAt: getTimestamp(),
      updatedAt: getTimestamp(),
    };
    return await repo.createSeminar(newSeminar);
  };

  update = async (id: string, updates: SeminarUpdate): Promise<Seminar> => {
    if (!id) throw TypeError;
    await repo.updateSeminar(id, { ...updates, updatedAt: getTimestamp() });
    const seminar = await repo.findSeminarById(id);
    if (!seminar) throw TypeError;
    return seminar;
  };

  delete = async (id: string): Promise<Seminar | undefined> => {
    return await repo.deleteSeminar(id);
  };
}

export default SeminarService;
