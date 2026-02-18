/**
 * Resolve a display label from an item that may be a primitive or an object.
 *
 * Handles the common pattern used across Select, Autocomplete, Multiselect,
 * Listbox, OrderList, PickList, and CascadeSelect where an item might be a
 * plain string or an object with a configurable label field.
 *
 * @param item  The data item (string, object, or null/undefined)
 * @param field The property name to read the label from when item is an object
 * @returns     The resolved display string
 *
 * @example
 * ```ts
 * resolveItemLabel('hello', 'name');       // => 'hello'
 * resolveItemLabel({ name: 'Alice' }, 'name'); // => 'Alice'
 * resolveItemLabel(null, 'name');           // => ''
 * ```
 */
export function resolveItemLabel(item: unknown, field: string): string {
  if (item == null) return '';
  if (typeof item === 'string') return item;
  return String((item as Record<string, unknown>)[field] ?? '');
}
