import type { ResponseObject, Seminar, User } from "cyborg-utils";

export const getAuthMe = async (): Promise<ResponseObject<User>> => {
  const res = await fetch("/api/auth/me");
  return res.json();
};

export const getSeminars = async (): Promise<ResponseObject<Seminar[]>> => {
  const res = await fetch("/api/seminars");
  return res.json();
};
