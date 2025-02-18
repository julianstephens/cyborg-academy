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
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_ENDPOINT_URL_S3: z.string(),
    AWS_REGION: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    BASE_URL: z.string().url(),
    BUCKET_NAME: z.string(),
    DB_URL: z.string().url(),
    DISCORD_API_URL: z.string().url(),
    DISCORD_GUILD_ID: z.string(),
    LOG_LEVEL: z.string().optional(),
    PORT: z.coerce.number(),
  },
  emptyStringAsUndefined: true,
  runtimeEnv: process.env,
});
