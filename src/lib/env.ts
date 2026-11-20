/**
 * Public runtime configuration. Expo inlines EXPO_PUBLIC_* variables at build
 * time, so they must be read with static property access (no destructuring).
 * See .env.example for the values to provide.
 */
export const env = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  supabaseKey: process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '',
  /** Where password-reset emails send people back to (the web app). */
  siteUrl: process.env.EXPO_PUBLIC_SITE_URL ?? '',
};

export const missingEnv = [
  !env.supabaseUrl && 'EXPO_PUBLIC_SUPABASE_URL',
  !env.supabaseKey && 'EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
].filter((name): name is string => Boolean(name));
