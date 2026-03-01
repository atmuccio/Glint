import { afterRenderEffect, inject, Injectable, Injector, Signal, Type } from '@angular/core';
import { Dialog as CdkDialog, DialogRef as CdkDialogRef } from '@angular/cdk/dialog';
import { GlobalPositionStrategy, Overlay } from '@angular/cdk/overlay';
import { ZONE_THEME } from '../core/tokens/zone-theme.token';
import { BEHAVIORAL_KEYS, THEME_TO_CSS_MAP, ZoneTheme } from '../core/tokens/zone-theme.model';
import { GlintDialogConfig, GlintDialogPosition, GLINT_DIALOG_CONFIG, GLINT_DIALOG_DATA } from './dialog.config';
import { GlintDialogRef } from './dialog-ref';
import { GlintDialogContainerComponent } from './dialog-container.component';

/**
 * Internal dialog service. Consumers should use `injectGlintDialog()` instead.
 *
 * Uses CDK Dialog internally for overlay creation, focus management, and ARIA.
 * Applies zone theme CSS vars to the overlay element for style inheritance.
 */
@Injectable({ providedIn: 'root' })
export class GlintDialogService {
  private readonly cdkDialog = inject(CdkDialog);
  private readonly overlay = inject(Overlay);

  open<T, D = unknown, R = unknown>(
    component: Type<T>,
    config: GlintDialogConfig<D> | undefined,
    callerInjector: Injector
  ): GlintDialogRef<T, R> {
    const mergedConfig: GlintDialogConfig<D> = {
      hasBackdrop: true,
      disableClose: false,
      maxWidth: '90vw',
      maxHeight: '90vh',
      position: 'center',
      ...config,
    };

    const positionStrategy = this.buildPositionStrategy(mergedConfig.position ?? 'center');

    // Create the GlintDialogRef as a deferred wrapper.
    // We initialize it without a CDK ref and wire it up after cdkDialog.open().
    const glintDialogRef = GlintDialogRef.createDeferred<T, R>();

    // Create a child injector that provides our custom tokens.
    // Both the container and content components will inherit from this injector
    // since CDK Dialog uses config.injector as parent for both.
    const dialogInjector = Injector.create({
      providers: [
        { provide: GlintDialogRef, useValue: glintDialogRef },
        { provide: GLINT_DIALOG_DATA, useValue: mergedConfig.data },
        { provide: GLINT_DIALOG_CONFIG, useValue: mergedConfig },
      ],
      parent: callerInjector,
    });

    const cdkRef = this.cdkDialog.open(component, {
      data: mergedConfig.data,
      hasBackdrop: mergedConfig.hasBackdrop,
      backdropClass: 'glint-dialog-backdrop',
      disableClose: mergedConfig.disableClose,
      width: mergedConfig.width,
      height: mergedConfig.height,
      maxWidth: mergedConfig.maxWidth,
      maxHeight: mergedConfig.maxHeight,
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      ariaLabel: mergedConfig.ariaLabel ?? undefined,
      ariaModal: true,
      role: 'dialog',
      autoFocus: 'first-tabbable',
      restoreFocus: true,
      injector: dialogInjector,
      container: GlintDialogContainerComponent,
    });

    // Wire the deferred ref to the real CDK ref
    glintDialogRef._connectCdkRef(cdkRef as CdkDialogRef<R>);

    // Set the component instance on our ref
    glintDialogRef.componentInstance = cdkRef.componentInstance as T | null;

    // Apply zone theme CSS vars to the overlay element
    this.applyZoneTheme(cdkRef as CdkDialogRef, callerInjector);

    return glintDialogRef;
  }

  /**
   * Applies zone theme CSS variables reactively to the CDK overlay element.
   * This bridges the gap between zone-scoped CSS vars and body-level overlays.
   */
  private applyZoneTheme(cdkRef: CdkDialogRef, callerInjector: Injector): void {
    const zoneTheme: Signal<ZoneTheme> = callerInjector.get(ZONE_THEME);
    const overlayEl = cdkRef.overlayRef.overlayElement;

    let previousKeys = new Set<string>();

    const effectRef = afterRenderEffect({
      write: () => {
        const theme = zoneTheme();
        if (!overlayEl) return;

        const currentKeys = new Set<string>();

        for (const [key, cssVar] of Object.entries(THEME_TO_CSS_MAP)) {
          if (BEHAVIORAL_KEYS.has(key)) continue;
          const value = (theme as unknown as Record<string, string>)[key];
          if (value) {
            overlayEl.style.setProperty(cssVar, value);
            currentKeys.add(cssVar);
          }
        }

        // Clean up stale properties from previous evaluation
        for (const cssVar of previousKeys) {
          if (!currentKeys.has(cssVar)) {
            overlayEl.style.removeProperty(cssVar);
          }
        }

        previousKeys = currentKeys;
      },
    }, { injector: callerInjector });

    // Cleanup effect when dialog closes
    cdkRef.closed.subscribe(() => {
      effectRef.destroy();
    });
  }

  private buildPositionStrategy(position: GlintDialogPosition): GlobalPositionStrategy {
    const strategy = this.overlay.position().global();
    const offset = '2rem';

    switch (position) {
      case 'top':
        return strategy.centerHorizontally().top(offset);
      case 'bottom':
        return strategy.centerHorizontally().bottom(offset);
      case 'left':
        return strategy.centerVertically().left(offset);
      case 'right':
        return strategy.centerVertically().right(offset);
      case 'top-left':
        return strategy.top(offset).left(offset);
      case 'top-right':
        return strategy.top(offset).right(offset);
      case 'bottom-left':
        return strategy.bottom(offset).left(offset);
      case 'bottom-right':
        return strategy.bottom(offset).right(offset);
      case 'center':
      default:
        return strategy.centerHorizontally().centerVertically();
    }
  }
}

/**
 * Factory function for opening dialogs. Captures the caller's injector automatically.
 *
 * Must be called in injection context (field initializer or constructor).
 *
 * @example
 * ```typescript
 * export class MyComponent {
 *   private dialog = injectGlintDialog();
 *
 *   openSettings() {
 *     const ref = this.dialog.open(SettingsComponent, {
 *       header: 'Settings',
 *       data: { userId: 1 },
 *       position: 'top',
 *     });
 *     ref.afterClosed$.subscribe(result => console.log(result));
 *   }
 * }
 * ```
 */
export function injectGlintDialog(): GlintDialog {
  const injector = inject(Injector);
  const service = inject(GlintDialogService);

  return {
    open<T, D = unknown, R = unknown>(
      component: Type<T>,
      config?: GlintDialogConfig<D>
    ): GlintDialogRef<T, R> {
      return service.open<T, D, R>(component, config, injector);
    },
  };
}

/**
 * Public dialog API returned by `injectGlintDialog()`.
 */
export interface GlintDialog {
  open<T, D = unknown, R = unknown>(
    component: Type<T>,
    config?: GlintDialogConfig<D>
  ): GlintDialogRef<T, R>;
}
