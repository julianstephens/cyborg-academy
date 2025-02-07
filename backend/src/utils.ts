import { env } from "@/env";
import type { APIError, User } from "cyborg-utils";
import got from "got";
import { StatusCodes } from "http-status-codes";

export const getUser = async (token: string) => {
  const headers = { Authorization: `Bearer ${token}` };

  try {
    return await got
      .get(`${env.DISCORD_API_URL}/users/@me`, {
        headers,
      })
      .json<User>();
  } catch (err: unknown) {
    throw {
      status: StatusCodes.UNAUTHORIZED,
      message: "unable to retrieve discord user",
      detail: err,
    } as APIError;
  }
};

export const getTimestamp = () => {
  return Math.floor(Date.now() / 1000);
};

export class IDError extends Error {
  statusCode: number;

  constructor(msg: string, statusCode: number) {
    super(msg);
    this.statusCode = statusCode;
    this.name = IDError.name;
  }
}
