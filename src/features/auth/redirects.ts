import { Platform } from 'react-native';

import { env } from '@/lib/env';

/**
 * Where links in auth emails (confirm sign-up, reset password) should land.
 *
 * On the web it's the site the person is using, so a link always opens the
 * deployment that sent it instead of whatever Supabase's Site URL says. Native
 * apps send people to the web app, which works on any device. Supabase only
 * honours URLs on the Site URL's host or matching a Redirect URL; anything else
 * silently falls back to the Site URL.
 */
export function authRedirectUrl(path: `/${string}` = '/'): string | undefined {
  const origin = Platform.OS === 'web' && typeof window !== 'undefined' ? window.location.origin : env.siteUrl;
  return origin ? `${origin.replace(/\/$/, '')}${path}` : undefined;
}
