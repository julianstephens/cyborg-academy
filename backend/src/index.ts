import { pgPool } from "@/db";
import { env } from "@/env.js";
import logger from "@/logger.js";
import { errorHandler, errorLogger, notFound } from "@/middleware.js";
import router from "@/routes/auth.js";
import bodyParser from "body-parser";
import pgSimple from "connect-pg-simple";
import cors from "cors";
import express from "express";
import "express-async-errors";
import session from "express-session";
import { StatusCodes } from "http-status-codes";
import morgan from "morgan";

const app = express();
const pgSession = pgSimple(session);
const port = 8080;

app.use(morgan("combined"));
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
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
    },
    store: new pgSession({ pool: pgPool }),
  }),
);

app.get(env.API_PREFIX, (req, res) => {
  res.json({
    status: StatusCodes.OK,
    message: "healthy",
  });
});
app.use(`${env.API_PREFIX}/auth`, router);

app.use(notFound);
app.use(errorLogger);
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`server listening at: http://localhost:${port}`);
});
