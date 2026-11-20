import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

import type { Database } from './database.types';
import { env } from './env';

const isWeb = Platform.OS === 'web';

// Placeholder values keep createClient from throwing when env vars are
// missing; the root layout shows a setup screen in that case instead.
export const supabase = createClient<Database>(
  env.supabaseUrl || 'http://127.0.0.1:54321',
  env.supabaseKey || 'missing-key',
  {
    auth: {
      // Web uses localStorage by default; native needs an explicit store so
      // sessions survive app restarts (the old app logged you out on reload).
      ...(isWeb ? {} : { storage: AsyncStorage }),
      autoRefreshToken: true,
      persistSession: true,
      // Password-reset links land on the web app with tokens in the URL.
      detectSessionInUrl: isWeb,
    },
  },
);

// On native, only refresh tokens while the app is in the foreground.
if (!isWeb) {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
