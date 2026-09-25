import { describe, it, expect } from 'vitest';
import { videoUploadSchema, videoDeleteSchema, videoIdParamSchema, videoQuerySchema } from './video.schemas.js';

describe('videoUploadSchema', () => {
  it('should accept valid input with description and uploaderId', () => {
    const result = videoUploadSchema.safeParse({
      description: 'A test video',
      uploaderId: 'user-123',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.description).toBe('A test video');
      expect(result.data.uploaderId).toBe('user-123');
    }
  });

  it('should accept input with empty description', () => {
    const result = videoUploadSchema.safeParse({
      description: '',
      uploaderId: 'user-123',
    });
    expect(result.success).toBe(true);
  });

  it('should accept input with missing description', () => {
    const result = videoUploadSchema.safeParse({
      uploaderId: 'user-123',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.description).toBeUndefined();
    }
  });

  it('should accept input with missing uploaderId', () => {
    const result = videoUploadSchema.safeParse({
      description: 'A test video',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.uploaderId).toBeUndefined();
    }
  });

  it('should accept an empty object since both fields are optional', () => {
    const result = videoUploadSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('should strip unknown fields', () => {
    const result = videoUploadSchema.safeParse({
      description: 'test',
      uploaderId: 'user-1',
      unknownField: 'should be stripped',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).not.toHaveProperty('unknownField');
    }
  });
});

describe('videoDeleteSchema', () => {
  it('should accept valid input with uploaderId', () => {
    const result = videoDeleteSchema.safeParse({
      uploaderId: 'user-123',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.uploaderId).toBe('user-123');
    }
  });

  it('should reject input with missing uploaderId', () => {
    const result = videoDeleteSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe('videoIdParamSchema', () => {
  it('should accept a valid id string', () => {
    const result = videoIdParamSchema.safeParse({ id: 'abc-123' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe('abc-123');
    }
  });

  it('should reject missing id', () => {
    const result = videoIdParamSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe('videoQuerySchema', () => {
  it('should accept valid query with all fields', () => {
    const result = videoQuerySchema.safeParse({
      page: '1',
      limit: '10',
      uploaderId: 'user-123',
      sortBy: 'uploadDate',
      order: 'desc',
    });
    expect(result.success).toBe(true);
  });

  it('should accept an empty query (all fields optional)', () => {
    const result = videoQuerySchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('should coerce page from string to number', () => {
    const result = videoQuerySchema.safeParse({ page: '3' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(3);
    }
  });

  it('should reject invalid sortBy value', () => {
    const result = videoQuerySchema.safeParse({ sortBy: 'invalid' });
    expect(result.success).toBe(false);
  });

  it('should reject limit exceeding max', () => {
    const result = videoQuerySchema.safeParse({ limit: '200' });
    expect(result.success).toBe(false);
  });
});
