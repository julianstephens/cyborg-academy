import type {
  APIError,
  AuthSession,
  NewSeminar,
  NewSeminarSession,
  ResponseObject,
  Seminar,
  SeminarSession,
} from "cyborg-utils";

const opts: RequestInit = { credentials: "include" };

export const getAuthMe = async (): Promise<ResponseObject<AuthSession>> => {
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

export const createSeminar = async (
  newSeminar: NewSeminar,
): Promise<Seminar> => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/seminars`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSeminar),
    });
    const data = await res.json();
    return data.data;
  } catch (err) {
    throw err as APIError;
  }
};

export const deleteSeminar = async (slug: string): Promise<void> => {
  try {
    await fetch(`${import.meta.env.VITE_API_URL}/seminars/${slug}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    throw err as APIError;
  }
};

export const createSeminarSession = async (
  newSeminarSession: NewSeminarSession,
): Promise<SeminarSession> => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSeminarSession),
    });
    const data = await res.json();
    return data.data;
  } catch (err) {
    throw err as APIError;
  }
};
