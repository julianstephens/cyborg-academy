import winston from "winston";

const options = {
  file: {
    level: "debug",
    filename: `backend-${Date.now()}.log`,
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.splat(),
      winston.format.timestamp(),
    ),
    maxsize: 100 * 1024 * 1024,
    maxFiles: 10,
  },
  console: {
    level: "debug",
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.splat(),
      winston.format.timestamp(),
    ),
  },
};

const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  transports: [
    ...(process.env.NODE_ENV === "production"
      ? [new winston.transports.File(options.file)]
      : []),
    new winston.transports.Console(options.console),
  ],
  exitOnError: false,
});

export default logger;
