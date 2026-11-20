import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { palette } from '@/theme';

const COLORS = [palette.pink, palette.violet, palette.yellow, palette.mint, palette.sky, palette.orange];

type Piece = {
  vx: number;
  vy: number;
  spin: number;
  width: number;
  height: number;
  round: boolean;
  color: string;
};

function makePieces(count: number, spread: number): Piece[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * spread;
    const speed = 260 + Math.random() * 320;
    const round = i % 3 === 0;
    return {
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      spin: (Math.random() - 0.5) * 1080,
      width: round ? 9 : 7 + Math.random() * 5,
      height: round ? 9 : 12 + Math.random() * 6,
      round,
      color: COLORS[i % COLORS.length],
    };
  });
}

function ConfettiPiece({ piece, progress }: { piece: Piece; progress: SharedValue<number> }) {
  const style = useAnimatedStyle(() => {
    const t = progress.get();
    const drag = 1 - (1 - t) * (1 - t);
    return {
      opacity: t < 0.75 ? 1 : (1 - t) / 0.25,
      transform: [
        { translateX: piece.vx * drag },
        { translateY: piece.vy * t + 820 * t * t },
        { rotate: `${piece.spin * t}deg` },
      ],
    };
  });
  return (
    <Animated.View
      style={[
        styles.piece,
        {
          width: piece.width,
          height: piece.height,
          borderRadius: piece.round ? piece.width / 2 : 2,
          backgroundColor: piece.color,
        },
        style,
      ]}
    />
  );
}

type ConfettiProps = {
  /** Where the burst starts, as fractions of the container (default: center). */
  originX?: number;
  originY?: number;
  count?: number;
  /** Fan width in radians. */
  spread?: number;
  duration?: number;
};

/** One celebratory burst. Re-mount (change `key`) to fire again. */
export function Confetti({
  originX = 0.5,
  originY = 0.45,
  count = 36,
  spread = Math.PI * 0.9,
  duration = 1500,
}: ConfettiProps) {
  const reduceMotion = useReducedMotion();
  const [pieces] = useState(() => makePieces(count, spread));
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.set(withTiming(1, { duration, easing: Easing.linear }));
  }, [duration, progress]);

  if (reduceMotion) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={{ position: 'absolute', left: `${originX * 100}%`, top: `${originY * 100}%` }}>
        {pieces.map((piece, index) => (
          <ConfettiPiece key={index} piece={piece} progress={progress} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  piece: { position: 'absolute' },
});
