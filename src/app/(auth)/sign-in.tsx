import { Link, router } from 'expo-router';
import { useRef, useState, type ComponentRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { TextField } from '@/components/TextField';
import { AuthShell } from '@/features/auth/AuthShell';
import { rememberEmail, rememberedEmail } from '@/features/auth/emailHandoff';
import { FormError } from '@/features/auth/FormError';
import { ResendConfirmation } from '@/features/auth/ResendConfirmation';
import { friendlyError } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import { fonts, spacing, useTheme } from '@/theme';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignIn() {
  const { colors } = useTheme();
  const [email, setEmail] = useState(rememberedEmail);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [unconfirmed, setUnconfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const passwordRef = useRef<ComponentRef<typeof TextInput>>(null);

  async function submit() {
    if (busy) return;
    if (!EMAIL.test(email.trim())) return setError('Enter the email you signed up with.');
    if (!password) return setError('Enter your password.');
    setError(null);
    setBusy(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    // On success the auth listener swaps to the app automatically.
    if (signInError) {
      setError(friendlyError(signInError));
      setUnconfirmed(signInError.code === 'email_not_confirmed');
    }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Your cards missed you. Sign in to pick up your streak.">
      <View style={styles.fields}>
        <TextField
          label="Email"
          icon="email-outline"
          placeholder="you@school.edu"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError(null);
            setUnconfirmed(false);
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
          placeholder="Your password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError(null);
          }}
          secureToggle
          autoCapitalize="none"
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={submit}
        />
        <Button
          title="Forgot password?"
          variant="ghost"
          size="sm"
          onPress={() => {
            rememberEmail(email);
            router.push('/forgot-password');
          }}
          style={styles.forgot}
        />
      </View>

      <FormError message={error} />
      {error && unconfirmed ? <ResendConfirmation email={email.trim()} /> : null}

      <Button title="Sign in" iconRight="arrow-right" fullWidth loading={busy} onPress={submit} />

      <Text variant="small" tone="muted" align="center">
        New to RecallMate?{' '}
        <Link href="/sign-up" replace style={{ color: colors.primary, fontFamily: fonts.bold }}>
          Create an account
        </Link>
      </Text>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  fields: { gap: spacing.lg },
  forgot: { alignSelf: 'flex-end', marginTop: -spacing.sm },
});
