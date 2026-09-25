import type { z } from 'zod';
import type { videoUploadSchema, videoDeleteSchema } from '../schemas/video.schemas.js';
import type { IVideoDocument } from './video.js';

export type VideoUploadBody = z.infer<typeof videoUploadSchema>;

export type VideoDeleteBody = z.infer<typeof videoDeleteSchema>;

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type VideoResponse = IVideoDocument;
