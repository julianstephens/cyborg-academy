import { env } from "@/env";
import type { APIError, User } from "cyborg-utils";
import type { Request, Response } from "express";
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

export const doLogout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) throw err;
    if (req.cookies && req.cookies["connect.sid"]) {
      res.clearCookie("connect.sid");
    }
  });
};
