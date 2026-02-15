import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  Signal,
  untracked,
} from '@angular/core';
import {
  BEHAVIORAL_KEYS,
  DEFAULT_ZONE_THEME,
  THEME_TO_CSS_MAP,
  ZoneTheme,
} from '../tokens/zone-theme.model';
import { ZONE_THEME } from '../tokens/zone-theme.token';
import { ZONE_INHERIT } from '../tokens/zone-inherit';
import { registerGlintTokens } from '../tokens/register-tokens';
import { validateThemeValue } from '../utils/dev-validation';

/**
 * Style Zone component providing cascading theme customization.
 *
 * Wraps content and provides theme tokens via:
 * 1. CSS custom properties on the host element (visual styling)
 * 2. Signal<ZoneTheme> via DI (behavioral properties)
 *
 * Zones nest — inner zones inherit from outer zones and override selectively.
 *
 * @example
 * ```html
 * <glint-style-zone [theme]="{ colorPrimary: GlintColor.Blue.S500 }">
 *   <glint-button severity="primary">Blue button</glint-button>
 *
 *   <glint-style-zone [theme]="{ colorPrimary: GlintColor.Green.S500 }">
 *     <glint-button severity="primary">Green button</glint-button>
 *   </glint-style-zone>
 * </glint-style-zone>
 * ```
 */
@Component({
  selector: 'glint-style-zone',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'style': 'display: contents',
  },
  providers: [
    {
      provide: ZONE_THEME,
      useFactory: () => inject(GlintStyleZoneComponent).resolvedTheme,
    },
  ],
  template: `<ng-content />`,
})
export class GlintStyleZoneComponent {
  /** Partial theme overrides for this zone */
  theme = input<Partial<ZoneTheme>>({});

  /** Parent zone's theme signal (if nested) */
  private parentTheme: Signal<ZoneTheme> | null = inject(ZONE_THEME, {
    optional: true,
    skipSelf: true,
  });

  private el = inject(ElementRef<HTMLElement>);

  /**
   * Resolved theme merging parent + local overrides.
   * ZONE_INHERIT values are filtered out so CSS falls back to ancestor.
   */
  resolvedTheme: Signal<ZoneTheme> = computed(() => {
    const parent = this.parentTheme?.() ?? DEFAULT_ZONE_THEME;
    const local = this.theme();
    const merged = { ...parent };

    for (const [key, value] of Object.entries(local)) {
      if (value === ZONE_INHERIT) {
        delete (merged as Record<string, unknown>)[key];
      } else {
        (merged as Record<string, unknown>)[key] = value;
      }
    }

    return merged as ZoneTheme;
  });

  /**
   * Pre-computed CSS changes signal. Computes the exact set/remove operations
   * needed based on the current local theme, and tracks which properties
   * were previously set for cleanup.
   */
  private cssOps = (() => {
    let previousKeys = new Set<string>();

    return computed(() => {
      const local = this.theme();
      const toSet: Array<[string, string]> = [];
      const toRemove: string[] = [];
      const currentKeys = new Set<string>();

      for (const [key, cssVar] of Object.entries(THEME_TO_CSS_MAP)) {
        if (BEHAVIORAL_KEYS.has(key)) continue;

        const value = (local as Record<string, unknown>)[key];

        if (value === ZONE_INHERIT) {
          toRemove.push(cssVar);
        } else if (value !== undefined) {
          validateThemeValue(key, value);
          toSet.push([cssVar, value as string]);
          currentKeys.add(cssVar);
        }
      }

      // Clean up properties from previous render that are no longer set
      for (const cssVar of previousKeys) {
        if (!currentKeys.has(cssVar)) {
          toRemove.push(cssVar);
        }
      }

      previousKeys = currentKeys;
      return { toSet, toRemove };
    });
  })();

  constructor() {
    registerGlintTokens();

    // Sync CSS custom properties to host element reactively
    effect(() => {
      const ops = this.cssOps();
      const host = untracked(() => this.el.nativeElement);

      for (const [cssVar, value] of ops.toSet) {
        host.style.setProperty(cssVar, value);
      }
      for (const cssVar of ops.toRemove) {
        host.style.removeProperty(cssVar);
      }
    });
  }
}
