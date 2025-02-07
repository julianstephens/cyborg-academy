import { NewSeminarSession, SeminarSessionUpdate } from "@/models";
import * as repo from "@/repos/seminarSession";
import { getTimestamp } from "@/utils";
import { SeminarSession } from "cyborg-types";
import { nanoid } from "nanoid";

class SeminarSessionService {
  get = async (id: string): Promise<SeminarSession | undefined> => {
    if (!id) throw TypeError;

    return await repo.findSeminarSessionById(id);
  };

  list = async (filters: Partial<SeminarSession> = {}) => {
    return await repo.findSeminarSessions(filters);
  };

  create = async (
    session: Omit<NewSeminarSession, "id" | "createdAt" | "updatedAt">,
  ): Promise<SeminarSession> => {
    const newSeminarSession: NewSeminarSession = {
      ...session,
      id: nanoid(),
      createdAt: getTimestamp(),
      updatedAt: getTimestamp(),
    };
    return await repo.createSeminarSession(newSeminarSession);
  };

  update = async (
    id: string,
    updates: SeminarSessionUpdate,
  ): Promise<SeminarSession> => {
    if (!id) throw TypeError;
    await repo.updateSeminarSession(id, {
      ...updates,
      updatedAt: getTimestamp(),
    });
    const seminar = await repo.findSeminarSessionById(id);
    if (!seminar) throw TypeError;
    return seminar;
  };

  delete = async (id: string): Promise<SeminarSession | undefined> => {
    return await repo.deleteSeminarSession(id);
  };
}

export default SeminarSessionService;
