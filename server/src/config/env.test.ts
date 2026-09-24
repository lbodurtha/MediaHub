import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Re-create the env schema to test validation logic without triggering
// the module-level process.exit side effect in env.ts
const envSchema = z.object({
  PORT: z.coerce.number().default(8000),
  DATABASE_URI: z.string().min(1, 'DATABASE_URI is required'),
  CLIENT_URI: z.string().default('http://localhost:5173'),
  CLOUDINARY_NAME: z.string().min(1, 'CLOUDINARY_NAME is required'),
  CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET is required'),
});

const validEnv = {
  PORT: '3000',
  DATABASE_URI: 'mongodb://localhost:27017/mediahub',
  CLIENT_URI: 'http://localhost:3000',
  CLOUDINARY_NAME: 'my-cloud',
  CLOUDINARY_API_KEY: 'api-key-123',
  CLOUDINARY_API_SECRET: 'api-secret-456',
};

describe('env schema validation', () => {
  it('should pass with all valid env vars', () => {
    const result = envSchema.safeParse(validEnv);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.PORT).toBe(3000);
      expect(result.data.DATABASE_URI).toBe('mongodb://localhost:27017/mediahub');
      expect(result.data.CLOUDINARY_NAME).toBe('my-cloud');
    }
  });

  it('should coerce PORT from string to number', () => {
    const result = envSchema.safeParse(validEnv);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(typeof result.data.PORT).toBe('number');
      expect(result.data.PORT).toBe(3000);
    }
  });

  it('should default PORT to 8000 when not provided', () => {
    const { PORT, ...envWithoutPort } = validEnv;
    const result = envSchema.safeParse(envWithoutPort);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.PORT).toBe(8000);
    }
  });

  it('should default CLIENT_URI when not provided', () => {
    const { CLIENT_URI, ...envWithoutClientUri } = validEnv;
    const result = envSchema.safeParse(envWithoutClientUri);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.CLIENT_URI).toBe('http://localhost:5173');
    }
  });

  it('should fail when DATABASE_URI is missing', () => {
    const { DATABASE_URI, ...envWithoutDb } = validEnv;
    const result = envSchema.safeParse(envWithoutDb);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues.map((i) => i.path.join('.'));
      expect(issues).toContain('DATABASE_URI');
    }
  });

  it('should fail when DATABASE_URI is empty string', () => {
    const result = envSchema.safeParse({ ...validEnv, DATABASE_URI: '' });
    expect(result.success).toBe(false);
  });

  it('should fail when CLOUDINARY_NAME is missing', () => {
    const { CLOUDINARY_NAME, ...env } = validEnv;
    const result = envSchema.safeParse(env);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues.map((i) => i.path.join('.'));
      expect(issues).toContain('CLOUDINARY_NAME');
    }
  });

  it('should fail when CLOUDINARY_API_KEY is missing', () => {
    const { CLOUDINARY_API_KEY, ...env } = validEnv;
    const result = envSchema.safeParse(env);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues.map((i) => i.path.join('.'));
      expect(issues).toContain('CLOUDINARY_API_KEY');
    }
  });

  it('should fail when CLOUDINARY_API_SECRET is missing', () => {
    const { CLOUDINARY_API_SECRET, ...env } = validEnv;
    const result = envSchema.safeParse(env);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues.map((i) => i.path.join('.'));
      expect(issues).toContain('CLOUDINARY_API_SECRET');
    }
  });
});
