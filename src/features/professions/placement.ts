// The placement self-check: to skip a tier, the learner flips a sample of its
// checkpoint cards and must know at least 8 in 10.

export const CARDS_PER_TIER = 10;
export const PASS_SHARE = 0.8;

/** A small seeded random generator (mulberry32), so a check doesn't reshuffle on every render. */
function seededRandom(seed: number) {
  let a = Math.floor(seed * 2 ** 32) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(items: readonly T[], random: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export type PlacementStage<C> = { tier: number; cards: C[] };

/**
 * The cards to check, tier by tier, for starting at `targetTier`: up to
 * `perTier` random checkpoint cards from each tier below it. Tiers without
 * checkpoint cards are left out (nothing to check).
 */
export function buildPlacementPlan<C extends { tier: number }>(
  cards: readonly C[],
  targetTier: number,
  seed: number,
  perTier = CARDS_PER_TIER,
): PlacementStage<C>[] {
  const random = seededRandom(seed);
  const plan: PlacementStage<C>[] = [];
  for (let tier = 0; tier < targetTier; tier++) {
    const pool = cards.filter((card) => card.tier === tier);
    if (pool.length) plan.push({ tier, cards: shuffled(pool, random).slice(0, perTier) });
  }
  return plan;
}

/** Whether `knew` out of `total` is enough to skip a tier (8 of 10). */
export function passesTier(knew: number, total: number): boolean {
  return total === 0 || knew >= Math.ceil(total * PASS_SHARE);
}
