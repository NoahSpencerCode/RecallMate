import {
  isAuthImplicitGrantRedirectError,
  isAuthRetryableFetchError,
  type Session,
  type User,
} from '@supabase/supabase-js';
import { createContext, use, useEffect, useRef, useState, type ReactNode } from 'react';
import { AppState, Platform } from 'react-native';

import { clearAllDrafts } from '@/features/memories/drafts';
import { queryClient } from '@/lib/queryClient';
import { supabase } from '@/lib/supabase';

import { rememberEmail } from './emailHandoff';

/** Something about the session to tell the person once; RootNavigator shows it as a toast. */
export type AuthNotice = 'link-expired' | 'signed-out';

type AuthState = {
  session: Session | null;
  user: User | null;
  /** True until the stored session has been restored. */
  initializing: boolean;
  /** The stored session couldn't be restored because the server was unreachable. */
  offline: boolean;
  retry: () => void;
  /** True after arriving from a password-reset email link. */
  recovering: boolean;
  finishRecovery: () => void;
  notice: AuthNotice | null;
  clearNotice: () => void;
  /** Signed out without asking (revoked, deleted, another tab); cleared by the next sign-in. */
  lostSession: boolean;
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

let signingOutOnPurpose = false;

/**
 * Signs out of this device only (other devices stay signed in). The local
 * session is cleared before the server is told, so it works offline too.
 */
export async function signOut() {
  signingOutOnPurpose = true;
  try {
    // A failed request only means the server didn't hear about it; this device is signed out either way.
    await supabase.auth.signOut({ scope: 'local' });
  } catch {
    // Same as above.
  } finally {
    signingOutOnPurpose = false;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [offline, setOffline] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [recovering, setRecovering] = useState(false);
  const [notice, setNotice] = useState<AuthNotice | null>(null);
  const [lostSession, setLostSession] = useState(false);
  const lastUser = useRef<{ id: string; email?: string } | null>(null);

  // Restore the stored session (again after "Try again" when it was offline).
  useEffect(() => {
    let active = true;
    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active) return;
        // An expired access token needs a refresh; offline, that fails and comes back as no session
        // even though the session is still stored. Say so rather than showing the sign-in pitch.
        if (!data.session && isAuthRetryableFetchError(error)) {
          setOffline(true);
          return;
        }
        setOffline(false);
        setSession(data.session);
        if (data.session) {
          // Known before the check below can sign them out (INITIAL_SESSION may arrive after that).
          lastUser.current = { id: data.session.user.id, email: data.session.user.email };
          // A stored session can outlive its account (deleted, or revoked on
          // another device). Check with the server and drop it if it's dead.
          void dropDeadSession();
        }
      })
      .finally(() => {
        if (active) setInitializing(false);
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  // An email link that was expired or already used lands with #error=… and is otherwise ignored.
  useEffect(() => {
    let active = true;
    void supabase.auth.initialize().then(({ error }) => {
      if (!active || !isAuthImplicitGrantRedirectError(error)) return;
      setNotice('link-expired');
      // Read it; don't leave the error sitting in the address bar.
      if (Platform.OS === 'web' && window.location.hash.includes('error')) {
        window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next);
      if (event === 'PASSWORD_RECOVERY') setRecovering(true);
      // The new password is saved (maybe in another tab).
      if (event === 'USER_UPDATED') setRecovering(false);

      const previous = lastUser.current;
      if (event === 'SIGNED_OUT') {
        setRecovering(false);
        // Never let one account's cached data or unsaved drafts leak into the next.
        queryClient.clear();
        clearAllDrafts();
        // Not their doing (session revoked, account deleted, signed out in another tab): tell them.
        if (!signingOutOnPurpose && previous) {
          if (previous.email) rememberEmail(previous.email);
          setNotice('signed-out');
          setLostSession(true);
        }
        lastUser.current = null;
      } else if (next) {
        // A different account signed in on this tab (its email link opened here): drop the old one's data.
        if (previous && previous.id !== next.user.id) {
          queryClient.clear();
          clearAllDrafts();
        }
        lastUser.current = { id: next.user.id, email: next.user.email };
        setLostSession(false);
      }
    });
    return () => data.subscription.unsubscribe();
  }, []);

  // Offline at launch: try again by itself once the connection is back.
  useEffect(() => {
    if (!offline) return;
    const again = () => setAttempt((n) => n + 1);
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') again();
    });
    const web = Platform.OS === 'web' && typeof window !== 'undefined';
    if (web) window.addEventListener('online', again);
    return () => {
      sub.remove();
      if (web) window.removeEventListener('online', again);
    };
  }, [offline]);

  return (
    <AuthContext
      value={{
        session,
        user: session?.user ?? null,
        initializing,
        offline,
        retry: () => {
          setInitializing(true);
          setAttempt((n) => n + 1);
        },
        recovering,
        finishRecovery: () => setRecovering(false),
        notice,
        clearNotice: () => setNotice(null),
        lostSession,
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
