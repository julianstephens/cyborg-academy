/* eslint @typescript-eslint/no-unused-vars: 1 */
import logger from "@/logger";
import { doLogout, getUser, IDError } from "@/utils";
import { apiErrorSchema, type APIError } from "cyborg-utils";
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

  if (err instanceof IDError) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "invalid resource id",
    } as APIError);
  }

  const apiErr: z.SafeParseReturnType<
    unknown,
    APIError<unknown>
  > = apiErrorSchema.safeParse(err);
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
      doLogout(req, res);
    }
  }

  doLogout(req, res);
};

export const validateBody = (schema: z.ZodType<unknown>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: unknown) {
      next({
        status: StatusCodes.BAD_REQUEST,
        message: "invalid request body",
        detail: (err as z.ZodError).errors,
      } as APIError);
    }
  };
};
