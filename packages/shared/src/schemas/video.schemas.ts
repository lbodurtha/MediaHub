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

export const videoQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  uploaderId: z.string().optional(),
  sortBy: z.enum(['uploadDate', 'title', 'views', 'duration']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
});
