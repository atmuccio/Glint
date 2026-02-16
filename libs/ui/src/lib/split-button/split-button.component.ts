import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  input,
  output,
  signal,
} from '@angular/core';
import { ConnectedPosition, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ZoneAwareOverlayService } from '../core/overlay/zone-aware-overlay.service';
import { GlintMenuPanelComponent } from '../menu/menu-panel.component';
import type { GlintMenuItem } from '../menu/menu-item.model';

const POSITIONS: ConnectedPosition[] = [
  { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 4 },
  { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -4 },
];

/**
 * Split button with a primary action and a dropdown menu.
 *
 * @example
 * ```html
 * <glint-split-button label="Save" [items]="saveOptions" (primaryClick)="onSave()" />
 * ```
 */
@Component({
  selector: 'glint-split-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-severity]': 'severity()',
  },
  styles: `
    :host {
      display: inline-flex;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
    }

    .primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--glint-color-primary);
      background: var(--glint-color-primary);
      color: var(--glint-color-primary-contrast);
      padding-block: var(--glint-spacing-sm);
      padding-inline: var(--glint-spacing-md);
      font: inherit;
      font-weight: 500;
      cursor: pointer;
      border-start-start-radius: var(--glint-border-radius);
      border-end-start-radius: var(--glint-border-radius);
      transition: background-color var(--glint-duration-fast) var(--glint-easing);
    }
    .primary:hover {
      background: color-mix(in oklch, var(--glint-color-primary), white 15%);
    }
    .primary:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: 2px;
    }

    .dropdown {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--glint-color-primary);
      border-inline-start: 1px solid color-mix(in oklch, var(--glint-color-primary), white 30%);
      background: var(--glint-color-primary);
      color: var(--glint-color-primary-contrast);
      padding-inline: var(--glint-spacing-sm);
      font: inherit;
      cursor: pointer;
      border-start-end-radius: var(--glint-border-radius);
      border-end-end-radius: var(--glint-border-radius);
      transition: background-color var(--glint-duration-fast) var(--glint-easing);
    }
    .dropdown:hover {
      background: color-mix(in oklch, var(--glint-color-primary), white 15%);
    }
    .dropdown:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: 2px;
    }

    .chevron {
      font-size: 0.625rem;
    }
  `,
  template: `
    <button class="primary" type="button" (click)="primaryClick.emit()">{{ label() }}</button>
    <button class="dropdown" type="button" (click)="toggleMenu()" aria-label="More options" aria-haspopup="true">
      <span class="chevron">&#9660;</span>
    </button>
  `,
})
export class GlintSplitButtonComponent {
  /** Primary button label */
  label = input.required<string>();
  /** Menu items for the dropdown */
  items = input.required<GlintMenuItem[]>();
  /** Severity */
  severity = input<'primary' | 'secondary' | 'success' | 'danger'>('primary');
  /** Emitted when primary button is clicked */
  primaryClick = output<void>();

  private overlay = inject(ZoneAwareOverlayService);
  private injector = inject(Injector);
  private elRef = inject(ElementRef);
  private destroyRef = inject(DestroyRef);
  private menuRef: import('@angular/cdk/overlay').OverlayRef | null = null;
  private isOpen = signal(false);

  constructor() {
    this.destroyRef.onDestroy(() => this.closeMenu());
  }

  toggleMenu(): void {
    this.isOpen() ? this.closeMenu() : this.openMenu();
  }

  private openMenu(): void {
    if (this.isOpen()) return;

    const config = new OverlayConfig({
      positionStrategy: this.overlay.position()
        .flexibleConnectedTo(this.elRef)
        .withPositions(POSITIONS),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });

    const { overlayRef, injector } = this.overlay.createZoneAwareOverlay(config, this.injector);
    this.menuRef = overlayRef;

    const portal = new ComponentPortal(GlintMenuPanelComponent, null, injector);
    const ref = overlayRef.attach(portal);
    ref.instance.items.set(this.items());
    ref.instance.itemSelected.subscribe((item: GlintMenuItem) => {
      item.command?.();
      this.closeMenu();
    });

    overlayRef.backdropClick().subscribe(() => this.closeMenu());
    overlayRef.keydownEvents().subscribe((e: KeyboardEvent) => {
      if (e.key === 'Escape') this.closeMenu();
    });

    this.isOpen.set(true);
  }

  private closeMenu(): void {
    if (this.menuRef) {
      this.menuRef.dispose();
      this.menuRef = null;
    }
    this.isOpen.set(false);
  }
}
