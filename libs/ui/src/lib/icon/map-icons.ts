/**
 * Generic icon mapping utilities.
 *
 * `mapIcons<T>()` is library-agnostic — users plug in any icon format
 * with their own converter function.
 *
 * `lucideToSvg()` is exported as a convenience since `lucide` is a
 * peer dependency of `@glint/ui`.
 */

/** Apply a transform function to convert icons from any format to SVG strings. */
export function mapIcons<T>(
  icons: Record<string, T>,
  transform: (icon: T, name: string) => string,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(icons).map(([name, icon]) => [name, transform(icon, name)]),
  );
}

/**
 * Convert a Lucide `IconNode` to a complete SVG string.
 *
 * Lucide icons are exported as `[tag, attrs][]` tuples (the `IconNode` type).
 * This function renders them into self-contained SVG markup that sizes
 * itself to 100% of the host `<glint-icon>` element.
 *
 * Stroke width is driven by the `--glint-icon-stroke-width` CSS custom
 * property, defaulting to `2`.
 */
export function lucideToSvg(
  node: [string, Record<string, string | number | undefined>][],
): string {
  const children = node
    .map(([tag, attrs]) => {
      const a = Object.entries(attrs)
        .filter(([, v]) => v != null)
        .map(([k, v]) => `${k}="${v}"`)
        .join(' ');
      return `<${tag} ${a}/>`;
    })
    .join('');

  return (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ' +
    'width="100%" height="100%" fill="none" stroke="currentColor" ' +
    'style="stroke-width:var(--glint-icon-stroke-width, 2)" ' +
    'stroke-linecap="round" stroke-linejoin="round">' +
    children +
    '</svg>'
  );
}
