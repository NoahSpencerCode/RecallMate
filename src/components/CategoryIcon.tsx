import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

import type { CategoryLook } from '@/features/packs/categories';

import { Icon } from './Icon';

/** Rounded gradient tile with the category's icon. */
export function CategoryIcon({ look, size = 44 }: { look: CategoryLook; size?: number }) {
  return (
    <LinearGradient
      colors={look.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.tile, { width: size, height: size, borderRadius: size * 0.32 }]}>
      <Icon name={look.icon} size={size * 0.55} color="#FFFFFF" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  tile: { alignItems: 'center', justifyContent: 'center' },
});
