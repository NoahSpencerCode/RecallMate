/** Turns Supabase/network errors into sentences a person can act on. */
export function friendlyError(error: unknown): string {
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';
  const message =
    typeof error === 'object' && error && 'message' in error ? String(error.message) : String(error ?? '');

  switch (code) {
    case 'invalid_credentials':
      return "That email and password don't match. Try again or reset your password.";
    case 'user_already_exists':
    case 'email_exists':
      return 'An account with this email already exists. Try signing in instead.';
    case 'weak_password':
      return 'Pick a stronger password: at least 8 characters.';
    case 'email_not_confirmed':
      return 'Confirm your email first. Check your inbox for the link.';
    case 'over_email_send_rate_limit':
    case 'over_request_rate_limit':
      return 'Too many attempts. Wait a minute, then try again.';
    case 'validation_failed':
    case 'email_address_invalid':
      return 'That email address doesn’t look right.';
    case 'same_password':
      return 'Your new password must be different from the old one.';
    case 'session_not_found':
    case 'refresh_token_not_found':
      return 'Your session expired. Sign in again.';
    default:
      break;
  }

  if (/failed to fetch|network request failed|load failed/i.test(message)) {
    return 'Can’t reach the server. Check your connection and try again.';
  }
  if (/not due until/i.test(message)) {
    return 'That card isn’t due yet.';
  }
  return message || 'Something went wrong. Please try again.';
}
