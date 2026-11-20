import { Link, router } from 'expo-router';
import { useRef, useState, type ComponentRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { Text } from '@/components/Text';
import { TextField } from '@/components/TextField';
import { AuthShell } from '@/features/auth/AuthShell';
import { FormError } from '@/features/auth/FormError';
import { PasswordStrength } from '@/features/auth/PasswordStrength';
import { neural } from '@/features/neural/neuralBus';
import { friendlyError } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import { fonts, palette, spacing, useTheme } from '@/theme';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUp() {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [checkInbox, setCheckInbox] = useState(false);
  const passwordRef = useRef<ComponentRef<typeof TextInput>>(null);

  async function submit() {
    if (!EMAIL.test(email.trim())) return setError('Enter a valid email address.');
    if (password.length < 8) return setError('Use at least 8 characters for your password.');
    setError(null);
    setBusy(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: name.trim() ? { name: name.trim() } : {} },
    });
    setBusy(false);
    if (signUpError) return setError(friendlyError(signUpError));
    neural.burst({ strength: 1.4 });
    // With email confirmation on, there's no session until they click the link.
    if (!data.session) setCheckInbox(true);
  }

  if (checkInbox) {
    return (
      <AuthShell title="Check your inbox" subtitle={`We sent a confirmation link to ${email.trim()}.`}>
        <EmptyState
          icon="email-fast-outline"
          color={palette.violet}
          title="One tap to go"
          message="Open the email and tap the link to activate your account, then come back and sign in.">
          <Button title="Back to sign in" variant="secondary" onPress={() => router.replace('/sign-in')} />
        </EmptyState>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Create your account" subtitle="Free forever. Your first review is one minute away.">
      <View style={styles.fields}>
        <TextField
          label="What should we call you?"
          icon="account-outline"
          placeholder="First name (optional)"
          value={name}
          onChangeText={setName}
          autoComplete="given-name"
          textContentType="givenName"
          returnKeyType="next"
          maxLength={40}
        />
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
          textContentType="emailAddress"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <TextField
          inputRef={passwordRef}
          label="Password"
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
          textContentType="newPassword"
          returnKeyType="go"
          onSubmitEditing={submit}
        />
        <PasswordStrength password={password} />
      </View>

      <FormError message={error} />

      <Button title="Create account" icon="rocket-launch" fullWidth loading={busy} onPress={submit} />

      <Text variant="small" tone="muted" align="center">
        Already have an account?{' '}
        <Link href="/sign-in" replace style={{ color: colors.primary, fontFamily: fonts.bold }}>
          Sign in
        </Link>
      </Text>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  fields: { gap: spacing.lg },
});
