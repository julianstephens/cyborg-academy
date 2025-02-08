import { NewSeminar, SeminarUpdate } from "@/models";
import * as repo from "@/repos/seminar";
import { getTimestamp } from "@/utils";
import type { Seminar } from "cyborg-utils";
import { nanoid } from "nanoid";

class SeminarService {
  genSlug = (title: string) => {
    return title.toLowerCase().replace(" ", "-");
  };

  get = async (id: string): Promise<Seminar | undefined> => {
    return await repo.findSeminarById(id);
  };

  list = async (filters: Partial<Seminar> = {}) => {
    return await repo.findSeminars(filters);
  };

  create = async (
    seminar: Omit<NewSeminar, "id" | "slug" | "createdAt" | "updatedAt">,
  ): Promise<Seminar> => {
    const newSeminar: NewSeminar = {
      id: nanoid(),
      ...seminar,
      slug: this.genSlug(seminar.title),
      createdAt: getTimestamp(),
      updatedAt: getTimestamp(),
    };
    return await repo.createSeminar(newSeminar);
  };

  update = async (id: string, updates: SeminarUpdate): Promise<Seminar> => {
    await repo.updateSeminar(id, { ...updates, updatedAt: getTimestamp() });
    const seminar = await repo.findSeminarById(id);
    if (!seminar) throw Error("unable to retrieve seminar");
    return seminar;
  };

  delete = async (id: string): Promise<Seminar | undefined> => {
    return await repo.deleteSeminar(id);
  };
}

export default SeminarService;
