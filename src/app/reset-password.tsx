import { router } from 'expo-router';
import { useState } from 'react';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { useToast } from '@/components/Toast';
import { TextField } from '@/components/TextField';
import { AuthShell } from '@/features/auth/AuthShell';
import { useAuth } from '@/features/auth/AuthProvider';
import { FormError } from '@/features/auth/FormError';
import { PasswordStrength } from '@/features/auth/PasswordStrength';
import { friendlyError } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import { palette } from '@/theme';

export default function ResetPassword() {
  const { session, finishRecovery } = useAuth();
  const toast = useToast();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!session) {
    return (
      <AuthShell title="Link expired" subtitle="Reset links work once and only for a short time." showBack={false}>
        <EmptyState
          icon="link-variant-off"
          color={palette.pink}
          title="Let’s get you a fresh one"
          message="Request a new reset link and open it from the same device.">
          <Button title="Request a new link" onPress={() => router.replace('/forgot-password')} />
        </EmptyState>
      </AuthShell>
    );
  }

  async function submit() {
    if (password.length < 8) return setError('Use at least 8 characters.');
    setError(null);
    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (updateError) return setError(friendlyError(updateError));
    finishRecovery();
    toast({ message: 'Password updated. You’re all set!', tone: 'success' });
    router.replace('/');
  }

  return (
    <AuthShell title="Choose a new password" subtitle={`For ${session.user.email ?? 'your account'}`} showBack={false}>
      <TextField
        label="New password"
        icon="lock-outline"
        placeholder="At least 8 characters"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setError(null);
        }}
        secureToggle
        autoCapitalize="none"
        autoComplete="new-password"
        returnKeyType="go"
        onSubmitEditing={submit}
      />
      <PasswordStrength password={password} />
      <FormError message={error} />
      <Button title="Save password" icon="check" fullWidth loading={busy} onPress={submit} />
    </AuthShell>
  );
}
