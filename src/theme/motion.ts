import { FadeInDown, ReduceMotion, type WithSpringConfig } from 'react-native-reanimated';

/** Spring presets. All respect the system "reduce motion" setting. */
export const springs = {
  snappy: { damping: 18, stiffness: 320, reduceMotion: ReduceMotion.System },
  bouncy: { damping: 10, stiffness: 190, reduceMotion: ReduceMotion.System },
  gentle: { damping: 20, stiffness: 140, reduceMotion: ReduceMotion.System },
} satisfies Record<string, WithSpringConfig>;

/** Staggered entrance for list/grid items: drop in with a little bounce. */
export function enterItem(index: number, baseDelay = 0) {
  return FadeInDown.delay(baseDelay + Math.min(index, 10) * 55)
    .springify()
    .damping(15)
    .stiffness(170);
}
