/**
 * Carries the email someone typed from one auth screen to the next (sign up →
 * sign in → reset password) so they don't retype it. Kept in memory rather
 * than in route params, which would put the address in the URL and browser
 * history.
 */
let lastEmail = '';

export function rememberEmail(email: string) {
  lastEmail = email.trim();
}

export function rememberedEmail(): string {
  return lastEmail;
}
