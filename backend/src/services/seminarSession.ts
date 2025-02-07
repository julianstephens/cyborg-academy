import { NewSeminarSession, SeminarSessionUpdate } from "@/models";
import * as repo from "@/repos/seminarSession";
import { getTimestamp } from "@/utils";
import { SeminarSession } from "cyborg-utils";
import { nanoid } from "nanoid";

class SeminarSessionService {
  get = async (id: string): Promise<SeminarSession | undefined> => {
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
    await repo.updateSeminarSession(id, {
      ...updates,
      updatedAt: getTimestamp(),
    });
    const session = await repo.findSeminarSessionById(id);
    if (!session) throw Error("unable to retrieve seminar");
    return session;
  };

  delete = async (id: string): Promise<SeminarSession | undefined> => {
    return await repo.deleteSeminarSession(id);
  };
}

export default SeminarSessionService;
