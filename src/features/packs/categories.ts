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
  'linear-algebra': { color: '#5B6CFF', gradient: ['#6C7BFF', '#3F51D9'], icon: 'matrix' },
  'differential-equations': { color: '#8E5CF7', gradient: ['#A86BFF', '#6C4DFF'], icon: 'chart-bell-curve-cumulative' },
  'organic-chemistry': { color: '#0FA3A3', gradient: ['#12B5A6', '#1D8FD1'], icon: 'molecule' },
  biochemistry: { color: '#2BB673', gradient: ['#3CCB7F', '#13A89E'], icon: 'test-tube' },
  'anatomy-physiology': { color: '#F0506E', gradient: ['#FF6B81', '#E8457C'], icon: 'heart-pulse' },
  microbiology: { color: '#5DAA1E', gradient: ['#7CC23A', '#2FA56A'], icon: 'bacteria-outline' },
  'discrete-math': { color: '#E0569B', gradient: ['#F06BAA', '#B24DD8'], icon: 'graph-outline' },
  'machine-learning': { color: '#3B82F6', gradient: ['#4F9BFF', '#7B61FF'], icon: 'robot-outline' },
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
