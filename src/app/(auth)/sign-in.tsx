import { Link, router } from 'expo-router';
import { useRef, useState, type ComponentRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { TextField } from '@/components/TextField';
import { AuthShell } from '@/features/auth/AuthShell';
import { FormError } from '@/features/auth/FormError';
import { friendlyError } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import { fonts, spacing, useTheme } from '@/theme';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignIn() {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const passwordRef = useRef<ComponentRef<typeof TextInput>>(null);

  async function submit() {
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
    if (signInError) setError(friendlyError(signInError));
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
          onPress={() => router.push({ pathname: '/forgot-password', params: { email: email.trim() } })}
          style={styles.forgot}
        />
      </View>

      <FormError message={error} />

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
