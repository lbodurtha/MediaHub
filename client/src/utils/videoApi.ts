import { env } from '../config/env';

export interface Video {
  _id: string;
  title: string;
  description: string;
  videoPath: string;
  thumbnailPath: string;
  uploaderId: string;
  duration: number;
  views: number;
  uploadDate: string;
}

export interface ApiResult<T = Record<string, unknown>> {
  message: string;
  data?: T;
}

// GetTokenFn matches Clerk's useAuth().getToken signature. Kept narrow here
// so this module does not need to import Clerk types directly; callers pass
// the getToken function they already hold.
export type GetTokenFn = () => Promise<string | null>;

const API_BASE_URL = env.VITE_BACKEND_URI;

// authorizedHeaders builds request headers with a Clerk-issued Bearer token
// when getToken yields one. Throws if the caller is unauthenticated so a
// mutation cannot be silently sent without credentials — the fix for the
// original Express backend which trusted a client-generated uploaderId.
async function authorizedHeaders(getToken: GetTokenFn): Promise<HeadersInit> {
  const token = await getToken();
  if (!token) {
    throw new Error('Not authenticated: Clerk getToken returned null');
  }
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export const videoApi = {
  incrementViews: async (videoId: string): Promise<ApiResult | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/videos/${videoId}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to increment view count');
      }

      return await response.json();
    } catch (error) {
      console.error('Error incrementing view count:', error);
      return null;
    }
  },

  getVideoMetadata: async (videoId: string): Promise<Video | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/videos/${videoId}`);

      if (!response.ok) {
        throw new Error('Failed to get video metadata');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching video metadata:', error);
      return null;
    }
  },

  /**
   * deleteVideo removes a video the caller owns.
   *
   * Ownership is enforced server-side against the Clerk-authenticated
   * subject decoded from the Authorization header — the client never sends
   * an uploaderId body. This closes the security gap in the Express
   * backend where any user could delete any video by claiming their id.
   */
  deleteVideo: async (videoId: string, getToken: GetTokenFn): Promise<ApiResult> => {
    const headers = await authorizedHeaders(getToken);
    const response = await fetch(`${API_BASE_URL}/videos/${videoId}`, {
      method: 'DELETE',
      headers,
    });

    let body: ApiResult | null = null;
    try {
      body = (await response.json()) as ApiResult;
    } catch {
      body = null;
    }

    if (!response.ok) {
      const message = body?.message ?? `Delete failed (HTTP ${response.status})`;
      throw new Error(message);
    }
    return body ?? { message: 'Video deleted successfully' };
  },

  extractDurationFromUrl: (videoUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      if (!videoUrl) {
        resolve('0:00');
        return;
      }

      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        const duration = Math.floor(video.duration);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        const formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        resolve(formatted);
      };

      video.onerror = () => {
        resolve('0:00');
      };
      setTimeout(() => resolve('0:00'), 5000);

      video.src = videoUrl;
    });
  },
};

export default videoApi;
