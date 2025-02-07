/* eslint @typescript-eslint/no-unused-vars: 1 */
import { env } from "@/env";
import logger from "@/logger";
import { apiError } from "@/schemas";
import { getUser } from "@/utils";
import type { APIError } from "cyborg-types";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

export const errorLogger = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(err);
  next(err);
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const e: APIError = {
    status: StatusCodes.NOT_FOUND,
    message: "resource not found",
  };
  res.status(StatusCodes.NOT_FOUND).json(e);
};

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(err);
  }

  const apiErr: z.SafeParseReturnType<
    unknown,
    APIError<unknown>
  > = apiError.safeParse(err);
  if (apiErr.success) {
    res.status(apiErr.data.status).json(apiErr.data);
    return;
  }

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    message: "something went wrong",
    detail: err,
  } as APIError);
};

export const authGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.session.accessToken) {
    try {
      const currUser = await getUser(req.session.accessToken);
      req.session.user = currUser;
      return next();
    } catch {
      req.session.destroy((err) => {
        res.redirect(`${env.APP_URL}/`);
      });
      return;
    }
  }

  req.session.destroy((err) => {
    res.redirect(`${env.APP_URL}/`);
  });
};
