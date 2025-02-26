import type { Seminar, SeminarSession } from "cyborg-utils";
import { Insertable, Updateable } from "kysely";

export interface Database {
  seminar: Seminar;
  seminarSession: SeminarSession;
}

export interface Session {
  sid: string;
  sess: object;
  expire: Date;
}

export type NewSeminar = Insertable<Seminar>;
export type SeminarUpdate = Updateable<Seminar>;
export type NewSeminarSession = Insertable<SeminarSession>;
export type SeminarSessionUpdate = Updateable<SeminarSession>;
