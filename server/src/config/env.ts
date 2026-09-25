import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

export const envSchema = z.object({
  PORT: z.coerce.number().default(8000),
  DATABASE_URI: z.string().min(1, 'DATABASE_URI is required'),
  CLIENT_URI: z.string().default('http://localhost:5173'),
  CLOUDINARY_NAME: z.string().min(1, 'CLOUDINARY_NAME is required'),
  CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET is required'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const formatted = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
  console.error(`Environment validation failed:\n${formatted}`);
  process.exit(1);
}

export type ServerConfig = z.infer<typeof envSchema>;

export const config: Readonly<ServerConfig> = Object.freeze(parsed.data);
