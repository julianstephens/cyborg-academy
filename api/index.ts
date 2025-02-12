import { pgPool } from "@/db";
import { env } from "@/env.js";
import logger from "@/logger.js";
import {
  corsHeaders,
  errorHandler,
  errorLogger,
  notFound,
} from "@/middleware.js";
import authRouter from "@/routes/auth.js";
import seminarRouter from "@/routes/seminar";
import sessionRouter from "@/routes/seminarSession";
import bodyParser from "body-parser";
import pgSimple from "connect-pg-simple";
import csurf from "csurf";
import "dotenv/config";
import express from "express";
import "express-async-errors";
import session from "express-session";
import helmet from "helmet";
import hpp from "hpp";
import { StatusCodes } from "http-status-codes";
import morgan from "morgan";

const app = express();
const pgSession = pgSimple(session);

app.use(corsHeaders);
app.all("*", corsHeaders);
app.use(morgan("combined"));
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
    },
  }),
);
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.text());
app.use(bodyParser.json());

app.use(hpp());
app.use(
  session({
    secret: env.AUTH_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
    store: new pgSession({ pool: pgPool, errorLog: logger.error }),
  }),
);
app.use(csurf());

app.get("/", (_, res) => {
  res.json({
    status: StatusCodes.OK,
    message: "healthy",
  });
});
app.use("/auth", authRouter);
app.use("/seminars", seminarRouter);
app.use("/sessions", sessionRouter);

app.use(notFound);
app.use(errorLogger);
app.use(errorHandler);

app.listen(env.PORT, () => {
  logger.info(`server listening on port: ${env.PORT}`);
});

export default app;
