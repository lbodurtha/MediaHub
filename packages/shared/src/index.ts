export type {
  IVideo,
  IVideoDocument,
  VideoUploadBody,
  VideoDeleteBody,
  ApiErrorResponse,
  VideoResponse,
} from './types/index.js';

export {
  videoUploadSchema,
  videoDeleteSchema,
  videoIdParamSchema,
} from './schemas/index.js';

export {
  API_PATHS,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
} from './constants/index.js';
