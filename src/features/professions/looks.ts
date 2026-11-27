import type { IconName } from '@/components/Icon';
import { personalLook, type CategoryLook } from '@/features/packs/categories';

import type { CardKind } from './api';

/** A profession's colours and icon come from the database, so a new profession needs no code. */
export function professionLook(profession?: { icon: string; accent: string; gradient: string[] } | null): CategoryLook {
  if (!profession) return personalLook;
  const [from = profession.accent, to = profession.accent] = profession.gradient;
  return { color: profession.accent, gradient: [from, to], icon: profession.icon as IconName };
}

/** The small tag on a profession card's face. */
export const KIND_LABELS: Record<CardKind, string> = {
  definition: 'Definition',
  concept: 'Concept',
  theorem: 'Theorem',
  'proof-idea': 'Proof idea',
  example: 'Example',
  counterexample: 'Counterexample',
  problem: 'Worked problem',
  formula: 'Formula',
  code: 'Code',
  numbers: 'Numbers to know',
  'trade-off': 'Trade-off',
  landmark: 'Landmark',
  misconception: 'Common trap',
};

export function kindLabel(kind: string): string {
  return KIND_LABELS[kind as CardKind] ?? 'Card';
}
