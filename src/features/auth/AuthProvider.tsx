import type { Session, User } from '@supabase/supabase-js';
import { createContext, use, useEffect, useState, type ReactNode } from 'react';

import { queryClient } from '@/lib/queryClient';
import { supabase } from '@/lib/supabase';

type AuthState = {
  session: Session | null;
  user: User | null;
  /** True until the stored session has been restored. */
  initializing: boolean;
  /** True after arriving from a password-reset email link. */
  recovering: boolean;
  finishRecovery: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

const DEAD_SESSION_CODES = new Set(['user_not_found', 'session_not_found', 'bad_jwt', 'refresh_token_not_found']);

/** Signs out locally if the server rejects the stored session (not on network errors). */
async function dropDeadSession() {
  const { error } = await supabase.auth.getUser();
  if (!error) return;
  const rejected = error.status === 401 || error.status === 403 || DEAD_SESSION_CODES.has(error.code ?? '');
  if (rejected) await supabase.auth.signOut({ scope: 'local' });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [recovering, setRecovering] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        setSession(data.session);
        // A stored session can outlive its account (deleted, or revoked on
        // another device). Check with the server and drop it if it's dead.
        if (data.session) void dropDeadSession();
      })
      .finally(() => {
        if (active) setInitializing(false);
      });

    const { data } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next);
      if (event === 'PASSWORD_RECOVERY') setRecovering(true);
      // Never let one account's cached data leak into the next.
      if (event === 'SIGNED_OUT') queryClient.clear();
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext
      value={{
        session,
        user: session?.user ?? null,
        initializing,
        recovering,
        finishRecovery: () => setRecovering(false),
      }}>
      {children}
    </AuthContext>
  );
}

export function useAuth(): AuthState {
  const value = use(AuthContext);
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>');
  return value;
}

/** The name they gave at sign-up, else a guess from their email. */
export function displayName(user: User | null): string {
  const given = user?.user_metadata?.name;
  if (typeof given === 'string' && given.trim()) return given.trim().split(/\s+/)[0];
  return firstNameFromEmail(user?.email);
}

/** "noah.spencer@x.com" → "Noah". */
export function firstNameFromEmail(email?: string | null): string {
  const local = (email ?? '').split('@')[0] ?? '';
  const word = local.split(/[._+-]/)[0] ?? '';
  const letters = word.replace(/[^a-zA-Z]/g, '');
  if (!letters) return 'there';
  return letters.charAt(0).toUpperCase() + letters.slice(1).toLowerCase();
}
