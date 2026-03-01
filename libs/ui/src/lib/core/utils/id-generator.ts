/**
 * Global auto-incrementing ID generator for accessible component IDs.
 *
 * Replaces per-component `let nextId = 0` counters with a single shared
 * counter so every generated ID is unique across all Glint components.
 *
 * @example
 * ```ts
 * readonly inputId = glintId('glint-checkbox');
 * // => 'glint-checkbox-0', 'glint-checkbox-1', …
 * ```
 */
let counter = 0;

export function glintId(prefix: string): string {
  return `${prefix}-${counter++}`;
}
