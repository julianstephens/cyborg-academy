import { pgPool } from "@/db";
import { env } from "@/env.js";
import logger from "@/logger.js";
import { errorHandler, errorLogger, notFound } from "@/middleware.js";
import authRouter from "@/routes/auth.js";
import seminarRouter from "@/routes/seminar";
import sessionRouter from "@/routes/seminarSession";
import bodyParser from "body-parser";
import pgSimple from "connect-pg-simple";
import cors from "cors";
import csurf from "csurf";
import express from "express";
import "express-async-errors";
import session from "express-session";
import helmet from "helmet";
import hpp from "hpp";
import { StatusCodes } from "http-status-codes";
import morgan from "morgan";

const app = express();
const pgSession = pgSimple(session);
const port = 8080;

app.use(morgan("combined"));
app.use(helmet());
app.use(hpp());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(
  session({
    secret: env.AUTH_SECRET,
    resave: false,
    cookie: {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
    store: new pgSession({ pool: pgPool }),
  }),
);
app.use(csurf());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

app.get(env.API_PREFIX, (req, res) => {
  res.json({
    status: StatusCodes.OK,
    message: "healthy",
  });
});
app.use(`${env.API_PREFIX}/auth`, authRouter);
app.use(`${env.API_PREFIX}/seminars`, seminarRouter);
app.use(`${env.API_PREFIX}/sessions`, sessionRouter);

app.use(notFound);
app.use(errorLogger);
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`server listening at: http://localhost:${port}`);
});
