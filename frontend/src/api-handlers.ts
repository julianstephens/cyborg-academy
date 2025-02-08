import type { APIError, ResponseObject, Seminar, User } from "cyborg-utils";

export const getAuthMe = async (): Promise<ResponseObject<User>> => {
  const res = await fetch("/api/auth/me");
  return res.json();
};

export const getSeminars = async (): Promise<ResponseObject<Seminar[]>> => {
  try {
    const res = await fetch("/api/seminars");
    return res.json();
  } catch (err) {
    throw err as APIError;
  }
};

export const getSeminar = async ({
  slug,
}: {
  slug: string;
}): Promise<ResponseObject<Seminar>> => {
  try {
    const res = await fetch(`/api/seminars/${slug}`);
    return res.json();
  } catch (err) {
    throw err as APIError;
  }
};
