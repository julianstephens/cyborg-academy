import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    ALLOWED_ORIGINS: z
      .string()
      .transform((value) => value.split(","))
      .pipe(z.string().array()),
    APP_URL: z.string().url(),
    AUTH_SECRET: z.string(),
    AUTH_DISCORD_ID: z.string(),
    AUTH_DISCORD_SECRET: z.string(),
    BASE_URL: z.string().url(),
    DB_URL: z.string().url(),
    DISCORD_API_URL: z.string().url(),
    DISCORD_GUILD_ID: z.string(),
    LOG_LEVEL: z.string().optional(),
    PORT: z.coerce.number(),
  },
  emptyStringAsUndefined: true,
  runtimeEnv: process.env,
});
