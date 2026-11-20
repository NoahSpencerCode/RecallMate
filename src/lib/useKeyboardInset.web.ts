import { useEffect, useState } from 'react';

/**
 * How much of the page the on-screen keyboard covers. Phone browsers don't
 * shrink the page when the keyboard opens (and KeyboardAvoidingView does
 * nothing on the web), so buttons pinned to the bottom end up underneath it.
 */
export function useKeyboardInset(): number {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const update = () => {
      // Pinch-zoom also shrinks the visual viewport; only count the keyboard.
      const zoomed = Math.abs(viewport.scale - 1) > 0.01;
      const covered = window.innerHeight - viewport.height - viewport.offsetTop;
      setInset(!zoomed && covered > 80 ? Math.round(covered) : 0);
    };
    viewport.addEventListener('resize', update);
    viewport.addEventListener('scroll', update);
    return () => {
      viewport.removeEventListener('resize', update);
      viewport.removeEventListener('scroll', update);
    };
  }, []);

  return inset;
}
