import { describe, it, expect } from 'vitest';
import { videoUploadSchema, videoDeleteSchema, videoIdParamSchema } from './video.schemas.js';

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
