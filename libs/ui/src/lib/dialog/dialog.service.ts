import { inject, Injectable, Injector, Type } from '@angular/core';
import { GlobalPositionStrategy, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { takeUntil } from 'rxjs';
import { ZoneAwareOverlayService } from '../core/overlay/zone-aware-overlay.service';
import { GlintDialogConfig, GlintDialogPosition, GLINT_DIALOG_CONFIG, GLINT_DIALOG_DATA } from './dialog.config';
import { GlintDialogRef } from './dialog-ref';
import { GlintDialogContainerComponent } from './dialog-container.component';

/**
 * Internal dialog service. Consumers should use `injectGlintDialog()` instead.
 */
@Injectable({ providedIn: 'root' })
export class GlintDialogService {
  private overlayService = inject(ZoneAwareOverlayService);

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

    const overlayConfig = new OverlayConfig({
      hasBackdrop: mergedConfig.hasBackdrop,
      backdropClass: 'glint-dialog-backdrop',
      positionStrategy,
      scrollStrategy: this.overlayService.scrollStrategies.block(),
      width: mergedConfig.width,
      height: mergedConfig.height,
      maxWidth: mergedConfig.maxWidth,
      maxHeight: mergedConfig.maxHeight,
    });

    const { overlayRef, injector: zoneInjector } = this.overlayService.createZoneAwareOverlay(
      overlayConfig,
      callerInjector
    );

    const dialogRef = new GlintDialogRef<T, R>(overlayRef);

    // Create injector with dialog-specific providers
    const dialogInjector = Injector.create({
      providers: [
        { provide: GlintDialogRef, useValue: dialogRef },
        { provide: GLINT_DIALOG_DATA, useValue: mergedConfig.data },
        { provide: GLINT_DIALOG_CONFIG, useValue: mergedConfig },
      ],
      parent: zoneInjector,
    });

    // Attach container
    const containerPortal = new ComponentPortal(
      GlintDialogContainerComponent,
      null,
      dialogInjector
    );
    const containerRef = overlayRef.attach(containerPortal);

    if (mergedConfig.ariaLabel) {
      containerRef.location.nativeElement.setAttribute('aria-label', mergedConfig.ariaLabel);
    }

    // Create the user component inside the container
    const componentRef = containerRef.instance.outlet().createComponent(component, {
      injector: dialogInjector,
    });
    dialogRef.componentInstance = componentRef.instance;

    // Handle backdrop click
    if (!mergedConfig.disableClose) {
      overlayRef.backdropClick().pipe(takeUntil(overlayRef.detachments())).subscribe(() => dialogRef.close());
      overlayRef.keydownEvents().pipe(takeUntil(overlayRef.detachments())).subscribe((event) => {
        if (event.key === 'Escape') {
          dialogRef.close();
        }
      });
    }

    return dialogRef;
  }

  private buildPositionStrategy(position: GlintDialogPosition): GlobalPositionStrategy {
    const strategy = this.overlayService.position().global();
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
