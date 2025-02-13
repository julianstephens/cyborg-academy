import type { APIError, ResponseObject, Seminar, User } from "cyborg-utils";

const opts: RequestInit = { credentials: "include" };

export const getAuthMe = async (): Promise<ResponseObject<User>> => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, opts);
  return res.json();
};

export const getSeminars = async (): Promise<ResponseObject<Seminar[]>> => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/seminars`, opts);
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
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/seminars/${slug}`,
      opts,
    );
    return res.json();
  } catch (err) {
    throw err as APIError;
  }
};
