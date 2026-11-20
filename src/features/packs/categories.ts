import type { IconName } from '@/components/Icon';
import { palette } from '@/theme';

export type CategoryLook = {
  color: string;
  gradient: readonly [string, string];
  icon: IconName;
};

/** Visual identity per pack category (ids match pack_categories.id). */
const looks: Record<string, CategoryLook> = {
  calculus: { color: '#7B61FF', gradient: ['#7B61FF', '#B44DFF'], icon: 'function-variant' },
  trigonometry: { color: '#2FA8FF', gradient: ['#38B6FF', '#4C6FFF'], icon: 'sine-wave' },
  biology: { color: '#14B885', gradient: ['#2ED9A3', '#12A0B8'], icon: 'dna' },
  engineering: { color: '#FF6B4A', gradient: ['#FF8A3D', '#FF4F6E'], icon: 'cogs' },
  software: { color: '#FF4FA3', gradient: ['#FF4FA3', '#9B4DFF'], icon: 'code-braces' },
  chemistry: { color: '#13B5B5', gradient: ['#16C2C2', '#38B6FF'], icon: 'flask-outline' },
  physics: { color: '#F2A900', gradient: ['#FFD23F', '#FF9F1C'], icon: 'atom' },
  statistics: { color: '#FF8A1C', gradient: ['#FFB020', '#FF6B57'], icon: 'chart-bell-curve' },
};

/** Look for cards the student wrote themselves. */
export const personalLook: CategoryLook = {
  color: palette.violet,
  gradient: [palette.violet, palette.pink],
  icon: 'lightbulb-on-outline',
};

export function categoryLook(categoryId?: string | null): CategoryLook {
  return (categoryId && looks[categoryId]) || personalLook;
}
