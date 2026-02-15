import {
  EnvironmentProviders,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { registerGlintTokens } from './tokens/register-tokens';

/**
 * Provides @glint/ui configuration for an Angular application.
 *
 * Registers CSS `@property` definitions for all design tokens,
 * enabling CSS transitions, `color-mix()`, and type-safe custom properties.
 *
 * Call once in your application's `bootstrapApplication()`:
 *
 * @example
 * ```typescript
 * import { provideGlintUI } from '@glint/ui';
 *
 * bootstrapApplication(AppComponent, {
 *   providers: [provideGlintUI()],
 * });
 * ```
 */
export function provideGlintUI(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideAppInitializer(() => registerGlintTokens()),
  ]);
}
