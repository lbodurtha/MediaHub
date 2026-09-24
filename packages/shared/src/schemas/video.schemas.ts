import { z } from 'zod';

export const videoUploadSchema = z.object({
  description: z.string().optional(),
  uploaderId: z.string().optional(),
});

export const videoDeleteSchema = z.object({
  uploaderId: z.string(),
});

export const videoIdParamSchema = z.object({
  id: z.string(),
});
