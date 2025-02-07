import type { ResponseObject, User } from "cyborg-utils";

export const getAuthMe = async (): Promise<ResponseObject<User>> => {
  const res = await fetch("/api/auth/me");
  return res.json();
};
