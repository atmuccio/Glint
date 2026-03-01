import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injectable,
  Injector,
  signal,
} from '@angular/core';
import { ConnectedPosition, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ZoneAwareOverlayService } from '../core/overlay/zone-aware-overlay.service';
import { createPopoverOverlayConfig } from '../core/overlay/overlay-config-factory';

/** Configuration for a confirm popup */
export interface GlintConfirmPopupConfig {
  /** Element to anchor the popup to */
  target: HTMLElement;
  /** Confirmation message */
  message?: string;
  /** Optional header */
  header?: string;
  /** Accept button label (default 'Yes') */
  acceptLabel?: string;
  /** Reject button label (default 'No') */
  rejectLabel?: string;
  /** Called on accept */
  accept?: () => void;
  /** Called on reject */
  reject?: () => void;
}

const POSITIONS: ConnectedPosition[] = [
  { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 8 },
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -8 },
  { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 8 },
  { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -8 },
];

/**
 * Internal popup component rendered inside the overlay.
 * Not exported from the public API.
 */
@Component({
  selector: 'glint-confirm-popup',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      color: var(--glint-color-text);
    }

    .popup-panel {
      background: var(--glint-color-surface);
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      box-shadow: var(--glint-shadow);
      padding: var(--glint-spacing-md);
      max-inline-size: 20rem;
    }

    .popup-header {
      font-weight: 600;
      margin-block-end: var(--glint-spacing-xs);
    }

    .popup-message {
      margin-block-end: var(--glint-spacing-md);
      line-height: 1.5;
    }

    .popup-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--glint-spacing-sm);
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      padding-block: var(--glint-spacing-xs);
      padding-inline: var(--glint-spacing-md);
      font: inherit;
      cursor: pointer;
      transition:
        background-color var(--glint-duration-fast) var(--glint-easing),
        border-color var(--glint-duration-fast) var(--glint-easing);
    }

    .btn:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: 2px;
    }

    .btn-reject {
      background: var(--glint-color-surface);
      color: var(--glint-color-text);
    }
    .btn-reject:hover {
      background: var(--glint-color-surface-variant);
    }

    .btn-accept {
      background: var(--glint-color-primary);
      color: var(--glint-color-primary-contrast);
      border-color: var(--glint-color-primary);
    }
    .btn-accept:hover {
      background: color-mix(in oklch, var(--glint-color-primary), white 15%);
    }
  `,
  template: `
    <div class="popup-panel" role="alertdialog">
      @if (header()) {
        <div class="popup-header">{{ header() }}</div>
      }
      @if (message()) {
        <div class="popup-message">{{ message() }}</div>
      }
      <div class="popup-actions">
        <button class="btn btn-reject" type="button" (click)="onReject()">{{ rejectLabel() }}</button>
        <button class="btn btn-accept" type="button" (click)="onAccept()">{{ acceptLabel() }}</button>
      </div>
    </div>
  `,
})
export class GlintConfirmPopupComponent {
  readonly message = signal('');
  readonly header = signal('');
  readonly acceptLabel = signal('Yes');
  readonly rejectLabel = signal('No');

  /** Internal event hooks — set by the service */
  onAccept: () => void = () => { /* noop */ };
  onReject: () => void = () => { /* noop */ };
}

/**
 * Service for showing confirm popups anchored to a target element.
 *
 * @example
 * ```typescript
 * const confirmPopup = inject(GlintConfirmPopupService);
 * confirmPopup.confirm({
 *   target: event.target as HTMLElement,
 *   message: 'Are you sure?',
 *   accept: () => deleteItem(),
 * });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class GlintConfirmPopupService {
  private overlay = inject(ZoneAwareOverlayService);
  private injector = inject(Injector);
  private overlayRef: OverlayRef | null = null;

  confirm(config: GlintConfirmPopupConfig): void {
    // Close any existing popup
    this.close();

    const overlayConfig = createPopoverOverlayConfig(this.overlay, config.target, {
      positions: POSITIONS,
    });

    const { overlayRef } = this.overlay.createZoneAwareOverlay(overlayConfig, this.injector);
    this.overlayRef = overlayRef;

    const portal = new ComponentPortal(GlintConfirmPopupComponent);
    const componentRef = overlayRef.attach(portal);
    const instance = componentRef.instance;

    instance.message.set(config.message ?? '');
    instance.header.set(config.header ?? '');
    instance.acceptLabel.set(config.acceptLabel ?? 'Yes');
    instance.rejectLabel.set(config.rejectLabel ?? 'No');

    instance.onAccept = () => {
      config.accept?.();
      this.close();
    };

    instance.onReject = () => {
      config.reject?.();
      this.close();
    };

    overlayRef.backdropClick().subscribe(() => {
      config.reject?.();
      this.close();
    });

    overlayRef.keydownEvents().subscribe((e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        config.reject?.();
        this.close();
      }
    });
  }

  private close(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }
}
