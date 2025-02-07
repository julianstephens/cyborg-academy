import type { ResponseObject, User } from "cyborg-types";

export const getAuthMe = async (): Promise<ResponseObject<User>> => {
  const res = await fetch("/api/auth/me");
  return res.json();
};
