/* eslint @typescript-eslint/no-unused-vars: 1 */
import { env } from "@/env.js";
import logger from "@/logger.js";
import { doLogout, getUser, IDError } from "@/utils.js";
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
  req.session.reload(async (err) => {
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
    next({
      status: StatusCodes.UNAUTHORIZED,
      message: "user is not authenticated",
    } as APIError);
  });
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

export const corsHeaders = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (
    req.headers.origin &&
    env.ALLOWED_ORIGINS.indexOf(req.headers.origin) !== -1
  ) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
  } else {
    res.header("Access-Control-Allow-Origin", "*");
  }

  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Expose-Headers", "X-Location, X-Cache-Hit");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Credential, Accept",
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }
};
