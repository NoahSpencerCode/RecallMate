import { useEffect, useState } from 'react';

import { Button } from '@/components/Button';
import { useToast } from '@/components/Toast';
import { friendlyError } from '@/lib/errors';
import { supabase } from '@/lib/supabase';

import { authRedirectUrl } from './redirects';

/** Supabase refuses a second email to the same address within a minute. */
const COOLDOWN_SECONDS = 60;

/** "Resend email" for a sign-up confirmation link, with a countdown between sends. */
export function ResendConfirmation({ email }: { email: string }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(0);

  useEffect(() => {
    if (wait <= 0) return;
    const timer = setTimeout(() => setWait(wait - 1), 1000);
    return () => clearTimeout(timer);
  }, [wait]);

  async function resend() {
    setBusy(true);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: authRedirectUrl('/') },
    });
    setBusy(false);
    if (error) {
      toast({ message: friendlyError(error), tone: 'error' });
      return;
    }
    setWait(COOLDOWN_SECONDS);
    toast({ message: `Sent a new link to ${email}.`, tone: 'success' });
  }

  return (
    <Button
      title={wait > 0 ? `Resend email in ${wait}s` : 'Resend email'}
      variant="ghost"
      size="sm"
      icon="email-sync-outline"
      disabled={wait > 0}
      loading={busy}
      onPress={resend}
    />
  );
}
