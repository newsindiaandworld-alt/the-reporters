const CATEGORY_ACCENTS = [
  { dot: "bg-brand-cyan", text: "text-brand-cyan" },
  { dot: "bg-brand-magenta", text: "text-brand-magenta" },
  { dot: "bg-brand-yellow", text: "text-brand-yellow" },
  { dot: "bg-brand-orange", text: "text-brand-orange" },
];

/** Deterministically maps a category/type label to one of the four brand accent colors. */
export function getCategoryAccent(category: string) {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = (hash << 5) - hash + category.charCodeAt(i);
    hash |= 0;
  }
  return CATEGORY_ACCENTS[Math.abs(hash) % CATEGORY_ACCENTS.length];
}
