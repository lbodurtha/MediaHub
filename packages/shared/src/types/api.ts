import type { IVideoDocument } from './video.js';

export interface VideoUploadBody {
  description?: string;
  uploaderId?: string;
}

export interface VideoDeleteBody {
  uploaderId: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type VideoResponse = IVideoDocument;
