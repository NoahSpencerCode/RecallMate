import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'react-native-reanimated';

import { Text, type TextProps } from './Text';

type AnimatedNumberProps = Omit<TextProps, 'children'> & {
  value: number;
  duration?: number;
  format?: (value: number) => string;
};

/** Counts up (or down) to `value` with an ease-out. */
export function AnimatedNumber({
  value,
  duration = 900,
  format = (n) => String(Math.round(n)),
  ...textProps
}: AnimatedNumberProps) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    if (reduceMotion) {
      fromRef.current = value;
      return;
    }
    const from = fromRef.current;
    const start = Date.now();
    let frame = 0;
    const tick = () => {
      const t = Math.min(1, (Date.now() - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from + (value - from) * eased;
      setDisplay(next);
      fromRef.current = next;
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, reduceMotion, value]);

  // With reduced motion, skip the count-up and show the final number.
  return <Text {...textProps}>{format(reduceMotion ? value : display)}</Text>;
}
