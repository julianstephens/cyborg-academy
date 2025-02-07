import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    API_PREFIX: z.string(),
    APP_URL: z.string().url().default("http://localhost:5173"),
    AUTH_SECRET: z.string(),
    AUTH_DISCORD_ID: z.string(),
    AUTH_DISCORD_SECRET: z.string(),
    BASE_URL: z.string().url().default("http://localhost:8080"),
    DB_URL: z.string().url(),
    DISCORD_API_URL: z.string().url(),
    DISCORD_GUILD_ID: z.string(),
    LOG_LEVEL: z.string().optional(),
  },
  emptyStringAsUndefined: true,
  runtimeEnv: process.env,
});
