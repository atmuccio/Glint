import {
  EnvironmentProviders,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { registerGlintTokens } from './tokens/register-tokens';
import { provideGlintIcons } from '../icon/icon.registry';
import { GLINT_DEFAULT_ICONS } from '../icon/default-icons';

/**
 * Provides @glint/ui configuration for an Angular application.
 *
 * - Registers CSS `@property` definitions for all design tokens
 * - Registers ~35 default Lucide icons for library components
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
    provideGlintIcons(GLINT_DEFAULT_ICONS),
  ]);
}
