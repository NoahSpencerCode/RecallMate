/**
 * Web-only (see useKeyboardInset.web.ts). On iOS and Android the native
 * keyboard handling (KeyboardAvoidingView, adjustResize) already keeps pinned
 * buttons visible.
 */
export function useKeyboardInset(): number {
  return 0;
}
