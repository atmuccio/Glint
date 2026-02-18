/**
 * Case-insensitive substring filter over a list of items.
 *
 * Replaces the common pattern:
 * ```ts
 * items.filter(item => getLabel(item).toLowerCase().includes(term.toLowerCase()))
 * ```
 *
 * @param items   The full list of items to filter
 * @param term    The search term (empty/blank returns all items)
 * @param labelFn A function that extracts the searchable label from each item
 * @returns       Filtered items whose label contains the search term
 *
 * @example
 * ```ts
 * filterByLabel(options, searchText(), opt => String(opt[labelKey] ?? ''));
 * ```
 */
export function filterByLabel<T>(
  items: T[],
  term: string,
  labelFn: (item: T) => string
): T[] {
  if (!term) return items;
  const lower = term.toLowerCase();
  return items.filter(item => labelFn(item).toLowerCase().includes(lower));
}
