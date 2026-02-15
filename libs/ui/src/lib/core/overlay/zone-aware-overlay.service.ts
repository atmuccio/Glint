import {
  effect,
  inject,
  Injectable,
  Injector,
  Signal,
  untracked,
} from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ZONE_THEME } from '../tokens/zone-theme.token';
import { BEHAVIORAL_KEYS, THEME_TO_CSS_MAP, ZoneTheme } from '../tokens/zone-theme.model';

export interface ZoneAwareOverlayResult {
  overlayRef: OverlayRef;
  injector: Injector;
}

/**
 * Creates CDK overlays that inherit zone theme tokens.
 *
 * CDK overlays render at body level, breaking CSS cascade from zones.
 * This service captures the caller's ZONE_THEME signal and:
 * 1. Applies CSS variables to the individual overlayRef.overlayElement
 * 2. Creates a child Injector providing the captured theme
 *
 * CRITICAL: Never set --glint-* on cdk-overlay-container (shared element).
 */
@Injectable({ providedIn: 'root' })
export class ZoneAwareOverlayService {
  private overlay = inject(Overlay);

  /**
   * Creates an overlay that inherits zone theme from the caller's injector.
   *
   * @param config CDK OverlayConfig
   * @param callerInjector Injector from the calling component (captures ZONE_THEME)
   */
  createZoneAwareOverlay(
    config: OverlayConfig,
    callerInjector: Injector
  ): ZoneAwareOverlayResult {
    const overlayRef = this.overlay.create(config);

    // Capture the zone theme signal from the caller's context
    const zoneTheme: Signal<ZoneTheme> = callerInjector.get(ZONE_THEME);

    // Create a child injector that provides the captured theme
    const childInjector = Injector.create({
      providers: [
        { provide: ZONE_THEME, useValue: zoneTheme },
      ],
      parent: callerInjector,
    });

    // Apply CSS variables reactively to the overlay pane
    const effectRef = effect(() => {
      const theme = zoneTheme();
      const el = untracked(() => overlayRef.overlayElement);
      if (!el) return;

      for (const [key, cssVar] of Object.entries(THEME_TO_CSS_MAP)) {
        if (BEHAVIORAL_KEYS.has(key)) continue;
        const value = (theme as unknown as Record<string, string>)[key];
        if (value) {
          el.style.setProperty(cssVar, value);
        }
      }
    }, { injector: callerInjector });

    // Clean up effect when overlay is disposed
    overlayRef.detachments().subscribe(() => {
      effectRef.destroy();
    });

    return { overlayRef, injector: childInjector };
  }
}
