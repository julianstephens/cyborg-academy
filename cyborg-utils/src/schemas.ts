import { z } from "zod";

export const responseWithMessageSchema = z.object({
  message: z.string(),
});

export const responseWithDataSchema = responseWithMessageSchema.extend({
  data: z.unknown().optional(),
});

export const responseObjectSchema = responseWithMessageSchema.or(
  responseWithDataSchema,
);

export const apiErrorSchema = responseWithMessageSchema.extend({
  status: z.number(),
  detail: z.unknown().optional(),
});

export const newSeminarSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  inProgress: z.boolean(),
  completed: z.boolean(),
});

export const seminarUpdateSchema = newSeminarSchema.partial();

export const newSeminarSessionSchema = z.object({
  title: z.string(),
  seminarId: z.string(),
  description: z.string().optional(),
  locked: z.boolean().default(true),
  order: z.number().int(),
  readings: z.string().array(),
  notes: z.string().array(),
});

export const seminarSessionUpdateSchema = newSeminarSessionSchema.partial();
