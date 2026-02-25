import { InjectionToken, Provider } from '@angular/core';

/**
 * Hierarchical icon registry.
 *
 * Each `provideGlintIcons()` call adds a `Record<string, string>` to
 * the `multi: true` array. The component flattens them with a single
 * `reduce()` — later entries override earlier ones, and child injectors
 * naturally override parent injectors via Angular's DI hierarchy.
 */
export const GLINT_ICON_REGISTRY = new InjectionToken<
  Record<string, string>[]
>('GLINT_ICON_REGISTRY');

/**
 * Register SVG icon strings for `<glint-icon>` lookup.
 *
 * Can be called multiple times at the same injector level —
 * later calls override earlier ones for duplicate names.
 *
 * @example
 * ```typescript
 * // Raw SVG strings
 * provideGlintIcons({ logo: '<svg>...</svg>' })
 *
 * // With Lucide icons
 * import { Home, Users } from 'lucide';
 * import { mapIcons, lucideToSvg } from '@glint/ui';
 * provideGlintIcons(mapIcons({ home: Home, users: Users }, lucideToSvg))
 * ```
 */
export function provideGlintIcons(
  icons: Record<string, string>,
): Provider[] {
  return [
    {
      provide: GLINT_ICON_REGISTRY,
      multi: true,
      useValue: icons,
    },
  ];
}
