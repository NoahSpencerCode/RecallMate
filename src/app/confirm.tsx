import type { EmailOtpType } from '@supabase/supabase-js';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { useToast } from '@/components/Toast';
import { useAuth } from '@/features/auth/AuthProvider';
import { AuthShell } from '@/features/auth/AuthShell';
import { FormError } from '@/features/auth/FormError';
import { neural } from '@/features/neural/neuralBus';
import { friendlyError } from '@/lib/errors';
import { haptics } from '@/lib/haptics';
import { supabase } from '@/lib/supabase';
import { palette } from '@/theme';

const LINK_TYPES = new Set<string>(['email', 'signup', 'recovery', 'invite', 'magiclink', 'email_change']);

/**
 * Where links in auth emails land (see supabase/templates). Mail scanners such
 * as Outlook Safe Links and campus gateways open every link in an email to
 * check it; if the link itself spent the one-time token, the student would
 * find it "already used" before tapping it. So the link only opens this page,
 * and the token is spent when a person presses the button.
 */
export default function ConfirmFromEmail() {
  const params = useLocalSearchParams<{ token_hash?: string; type?: string }>();
  const toast = useToast();
  const { session } = useAuth();
  const tokenHash = params.token_hash ?? '';
  const type = params.type && LINK_TYPES.has(params.type) ? (params.type as EmailOtpType) : null;
  const recovery = type === 'recovery';
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);

  async function confirm() {
    if (busy || !type) return;
    setBusy(true);
    setError(null);
    const { error: verifyError } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    setBusy(false);
    if (verifyError) {
      if (verifyError.code === 'otp_expired' || verifyError.status === 403) setExpired(true);
      else setError(friendlyError(verifyError));
      return;
    }
    haptics.success();
    if (recovery) {
      // The PASSWORD_RECOVERY event routes here too; going now avoids a flash of the app.
      router.replace('/reset-password');
      return;
    }
    neural.burst({ strength: 1.4 });
    toast({ tone: 'success', message: 'Email confirmed. Welcome to RecallMate!' });
    router.replace('/');
  }

  if (!tokenHash || !type) {
    return (
      <AuthShell title="This link isn’t complete" subtitle="Part of it may have been cut off on the way." showBack={false}>
        <EmptyState
          icon="link-variant-off"
          color={palette.pink}
          title="Try the link again"
          message="Open the email and tap the button in it, or copy the whole link. You can also ask for a new email.">
          <Button title="Go to sign in" onPress={() => router.replace('/sign-in')} />
        </EmptyState>
      </AuthShell>
    );
  }

  if (expired) {
    return (
      <AuthShell title="Link expired" subtitle="Email links work once and only for a short time." showBack={false}>
        <EmptyState
          icon="link-variant-off"
          color={palette.pink}
          title="Let’s get you a fresh one"
          message={
            recovery
              ? 'Ask for a new reset link and open the newest email.'
              : session
                ? 'You’re signed in, so there’s nothing more to do here.'
                : 'If you already confirmed, just sign in. If not, sign in and we’ll offer to send a new link.'
          }>
          {recovery ? (
            <Button title="Send a new reset link" onPress={() => router.replace('/forgot-password')} />
          ) : session ? (
            <Button title="Open RecallMate" icon="home-variant" onPress={() => router.replace('/')} />
          ) : (
            <Button title="Go to sign in" onPress={() => router.replace('/sign-in')} />
          )}
        </EmptyState>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={recovery ? 'Reset your password' : 'Confirm your email'}
      subtitle={recovery ? 'One tap, then choose a new password.' : 'One tap and your account is ready.'}
      showBack={false}>
      <FormError message={error} />
      <Button
        title={recovery ? 'Choose a new password' : 'Confirm my email'}
        icon={recovery ? 'lock-reset' : 'check-bold'}
        fullWidth
        loading={busy}
        onPress={confirm}
      />
    </AuthShell>
  );
}
