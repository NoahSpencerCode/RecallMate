import { router } from 'expo-router';
import { useState } from 'react';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { TextField } from '@/components/TextField';
import { AuthShell } from '@/features/auth/AuthShell';
import { rememberEmail, rememberedEmail } from '@/features/auth/emailHandoff';
import { FormError } from '@/features/auth/FormError';
import { authRedirectUrl } from '@/features/auth/redirects';
import { friendlyError } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import { palette } from '@/theme';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const [email, setEmail] = useState(rememberedEmail);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit() {
    if (busy) return;
    if (!EMAIL.test(email.trim())) return setError('Enter the email you signed up with.');
    rememberEmail(email);
    setError(null);
    setBusy(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: authRedirectUrl('/reset-password'),
    });
    setBusy(false);
    if (resetError) return setError(friendlyError(resetError));
    setSent(true);
  }

  if (sent) {
    return (
      <AuthShell title="Check your email" subtitle={`If an account exists for ${email.trim()}, a reset link is on its way.`}>
        <EmptyState
          icon="email-check-outline"
          color={palette.mint}
          title="Link sent"
          message="It can take a minute. The link opens RecallMate so you can choose a new password.">
          <Button title="Back to sign in" variant="secondary" onPress={() => router.replace('/sign-in')} />
        </EmptyState>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Reset your password" subtitle="We’ll email you a link to choose a new one.">
      <TextField
        label="Email"
        icon="email-outline"
        placeholder="you@school.edu"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setError(null);
        }}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        keyboardType="email-address"
        returnKeyType="send"
        onSubmitEditing={submit}
      />
      <FormError message={error} />
      <Button title="Send reset link" icon="send" fullWidth loading={busy} onPress={submit} />
    </AuthShell>
  );
}
