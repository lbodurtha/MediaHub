interface EnvConfig {
  VITE_BACKEND_URI: string;
  VITE_CLERK_PUBLISHABLE_KEY: string;
}

function getEnvVar(key: string, fallback?: string): string {
  const value = import.meta.env[key] as string | undefined;
  if (!value && fallback === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || fallback || '';
}

export const env: EnvConfig = {
  VITE_BACKEND_URI: getEnvVar('VITE_BACKEND_URI', 'http://localhost:8000'),
  VITE_CLERK_PUBLISHABLE_KEY: getEnvVar('VITE_CLERK_PUBLISHABLE_KEY'),
};
