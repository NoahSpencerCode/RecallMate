type ErrorLike = { code?: unknown; message?: unknown; name?: unknown; status?: unknown; reasons?: unknown };

function parts(error: unknown) {
  const e: ErrorLike = typeof error === 'object' && error ? (error as ErrorLike) : {};
  return {
    code: typeof e.code === 'string' ? e.code : '',
    message: typeof e.message === 'string' ? e.message : typeof error === 'string' ? error : '',
    name: typeof e.name === 'string' ? e.name : '',
    status: typeof e.status === 'number' ? e.status : 0,
    reasons: Array.isArray(e.reasons) ? e.reasons.map(String) : [],
  };
}

/** The request never got an answer: offline, flaky Wi-Fi, or blocked. */
export function isNetworkError(error: unknown): boolean {
  return /failed to fetch|network request failed|load failed|networkerror|fetch failed/i.test(parts(error).message);
}

/** The row is gone, e.g. the card was deleted on another device. */
export function isGoneError(error: unknown): boolean {
  const { code } = parts(error);
  return code === 'P0002' || code === 'PGRST116';
}

/** review_memory refused because the card isn't due, i.e. it was already reviewed elsewhere. */
export function isNotDueError(error: unknown): boolean {
  return /not due until/i.test(parts(error).message);
}

const WEAK_PASSWORD_REASONS: Record<string, string> = {
  pwned: 'That password has shown up in a data breach. Pick a different one.',
  characters: 'Mix in other kinds of characters: lowercase, uppercase, numbers and symbols.',
  length: 'Pick a longer password.',
};

const GONE_CARD = 'That card no longer exists. It may have been deleted on another device.';

/** Turns Supabase/network errors into sentences a person can act on. */
export function friendlyError(error: unknown): string {
  const { code, message, name, status, reasons } = parts(error);

  switch (code) {
    case 'invalid_credentials':
      return "That email and password don't match. Try again or reset your password.";
    case 'user_already_exists':
    case 'email_exists':
      return 'An account with this email already exists. Try signing in instead.';
    case 'weak_password':
      return (
        reasons.map((reason) => WEAK_PASSWORD_REASONS[reason]).find(Boolean) ??
        'Pick a stronger password: at least 8 characters.'
      );
    case 'email_not_confirmed':
      return 'Confirm your email first. Check your inbox (and spam) for the link.';
    case 'email_address_not_authorized':
      // Supabase's built-in mailer only emails the project's own team.
      return 'We can’t send email to that address yet. Try another address, or contact the app owner.';
    case 'over_email_send_rate_limit':
      return 'We’ve sent too many emails for now. Check your inbox and spam for the last one, or try again later.';
    case 'over_request_rate_limit':
      return 'Too many attempts. Wait a minute, then try again.';
    case 'email_address_invalid':
      return 'That email address doesn’t look right.';
    case 'validation_failed':
      // GoTrue uses this for bad emails and for passwords over 72 characters.
      if (/password/i.test(message)) {
        return /72/.test(message) ? 'Passwords can be at most 72 characters long.' : 'That password won’t work. Try another.';
      }
      if (/email/i.test(message)) return 'That email address doesn’t look right.';
      return 'Something in the form isn’t valid. Check it and try again.';
    case 'same_password':
      return 'Your new password must be different from the old one.';
    case 'otp_expired':
      return 'That link has expired or was already used. Ask for a new one.';
    case 'session_not_found':
    case 'session_expired':
    case 'refresh_token_not_found':
    case 'refresh_token_already_used':
      return 'Your session expired. Sign in again.';
    case 'signup_disabled':
      return 'New sign-ups are paused right now.';
    case 'P0002':
      if (/pack/i.test(message)) return 'That pack isn’t available anymore.';
      if (/start this profession/i.test(message)) return 'Start this profession first.';
      if (/not in your stack/i.test(message)) {
        return 'That card isn’t in your stack anymore. It may have been reset on another device.';
      }
      if (/profession/i.test(message)) return 'That profession isn’t available.';
      return GONE_CARD;
    case 'PGRST116':
      return GONE_CARD;
    case '42501':
      return 'You need to be signed in to do that.';
    default:
      break;
  }

  if (isNetworkError(error)) return 'Can’t reach the server. Check your connection and try again.';
  if (isNotDueError(error)) return 'That card was already reviewed. It isn’t due again yet.';
  if (/no cards yet/i.test(message)) return 'That part of the course isn’t ready yet.';
  if (/p_today must be/i.test(message)) {
    return 'Your device’s date looks wrong. Check its date and time settings, then try again.';
  }
  if (/error sending/i.test(message)) return 'We couldn’t send the email just now. Try again in a few minutes.';
  if (status >= 500 || name === 'AuthRetryableFetchError') return 'The server hit a snag. Try again in a moment.';
  if (__DEV__) console.warn('friendlyError: unmapped error', error);
  return 'Something went wrong. Please try again.';
}
