import { Link, router } from 'expo-router';
import { useRef, useState, type ComponentRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { Text } from '@/components/Text';
import { TextField } from '@/components/TextField';
import { AuthShell } from '@/features/auth/AuthShell';
import { rememberEmail } from '@/features/auth/emailHandoff';
import { FormError } from '@/features/auth/FormError';
import { PasswordStrength } from '@/features/auth/PasswordStrength';
import { authRedirectUrl } from '@/features/auth/redirects';
import { ResendConfirmation } from '@/features/auth/ResendConfirmation';
import { neural } from '@/features/neural/neuralBus';
import { friendlyError } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import { fonts, palette, spacing, useTheme } from '@/theme';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** form → (inbox: confirmation email sent | exists: already signed up, no email sent) */
type Stage = 'form' | 'inbox' | 'exists';

export default function SignUp() {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState<Stage>('form');
  const emailRef = useRef<ComponentRef<typeof TextInput>>(null);
  const passwordRef = useRef<ComponentRef<typeof TextInput>>(null);
  const address = email.trim();

  async function submit() {
    if (busy) return;
    if (!EMAIL.test(address)) return setError('Enter a valid email address.');
    if (password.length < 8) return setError('Use at least 8 characters for your password.');
    setError(null);
    setBusy(true);
    rememberEmail(address);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: address,
      password,
      options: {
        data: name.trim() ? { name: name.trim() } : {},
        emailRedirectTo: authRedirectUrl('/'),
      },
    });
    setBusy(false);
    // An existing, confirmed account: Supabase either says so (when email or
    // phone confirmation is off) or, to hide which addresses are registered,
    // returns a stand-in user with no identities and sends no email.
    if (signUpError?.code === 'user_already_exists' || signUpError?.code === 'email_exists') return setStage('exists');
    if (signUpError) return setError(friendlyError(signUpError));
    if (!data.session && data.user?.identities?.length === 0) return setStage('exists');
    neural.burst({ strength: 1.4 });
    // With a session they're signed in and the auth listener swaps to the app.
    // Without one, email confirmation is on and the link activates the account.
    if (!data.session) setStage('inbox');
  }

  if (stage === 'inbox') {
    return (
      <AuthShell title="Check your inbox" subtitle={`We sent a confirmation link to ${address}.`}>
        <EmptyState
          icon="email-fast-outline"
          color={palette.violet}
          title="One tap to go"
          message="Tap the link in the email to activate your account and sign in. Nothing after a minute? Check your spam folder, or send it again.">
          <ResendConfirmation email={address} />
          <Button
            title="Back to sign in"
            variant="secondary"
            onPress={() => router.replace('/sign-in')}
          />
        </EmptyState>
      </AuthShell>
    );
  }

  if (stage === 'exists') {
    return (
      <AuthShell
        title="You already have an account"
        subtitle={`${address} is already signed up, so we didn’t send another email.`}>
        <EmptyState
          icon="account-check-outline"
          color={palette.violet}
          title="Welcome back"
          message="Sign in with your password. Forgot it? We’ll email you a link to set a new one.">
          <Button
            title="Sign in"
            icon="login"
            onPress={() => router.replace('/sign-in')}
          />
          <Button
            title="Reset password"
            variant="secondary"
            icon="lock-reset"
            onPress={() => router.replace('/forgot-password')}
          />
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
          blurOnSubmit={false}
          onSubmitEditing={() => emailRef.current?.focus()}
          maxLength={40}
        />
        <TextField
          inputRef={emailRef}
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
