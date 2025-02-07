import { z } from "zod";

export const responseWithMessage = z.object({
  message: z.string(),
});

export const responseWithData = responseWithMessage.extend({
  data: z.unknown().optional(),
});

export const responseObject = responseWithMessage.or(responseWithData);

export const apiError = responseWithMessage.extend({
  status: z.number(),
  detail: z.unknown().optional(),
});
