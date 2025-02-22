import winston from "winston";
import { env } from "@/env.js";

const options = {
  console: {
    level: process.env.NODE_ENV === "production" ? env.LOG_LEVEL : "debug",
    handleExceptions: false,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.splat(),
      winston.format.timestamp(),
    ),
  },
};

const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  transports: [
    new winston.transports.Console(options.console),
    new winston.transports.File({ filename: "tmp/combined.log" }),
  ],
  exitOnError: false,
});

export default logger;
