const ALERT_CATEGORIES = new Set(['cat-death', 'cat-war', 'cat-disaster', 'cat-crisis']);
const GOLD_CATEGORIES = new Set(['cat-2027-election', 'cat-political', 'cat-economic', 'cat-politicians', 'cat-2026']);

/** Left-accent color per category, used on content cards instead of a
 * uniform card treatment — the color itself carries meaning (urgency
 * class of the category), not decoration. */
export function accentForCategory(categoryId: string): string {
  if (ALERT_CATEGORIES.has(categoryId)) return '#E5484D';
  if (GOLD_CATEGORIES.has(categoryId)) return '#D4A73D';
  return '#5B8DEF';
}
