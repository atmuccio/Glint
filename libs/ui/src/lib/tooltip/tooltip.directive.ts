import {
  ComponentRef,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  Injector,
  input,
  signal,
} from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { ZoneAwareOverlayService } from '../core/overlay/zone-aware-overlay.service';
import { createTooltipOverlayConfig } from '../core/overlay/overlay-config-factory';
import { GlintTooltipPanelComponent } from './tooltip.component';

/**
 * Tooltip directive that shows a text tooltip on hover/focus.
 * Inherits zone theme for overlay content styling.
 *
 * @example
 * ```html
 * <glint-button glintTooltip="Save changes">Save</glint-button>
 * <glint-button [glintTooltip]="'Delete item'" [glintTooltipDisabled]="!canDelete">Delete</glint-button>
 * ```
 */
@Directive({
  selector: '[glintTooltip]',
  standalone: true,
  host: {
    '(mouseenter)': 'scheduleShow()',
    '(mouseleave)': 'scheduleHide()',
    '(focus)': 'scheduleShow()',
    '(blur)': 'scheduleHide()',
    '(keydown.escape)': 'hide()',
    '[attr.aria-describedby]': 'isVisible() ? tooltipId : null',
  },
})
export class GlintTooltipDirective {
  /** Tooltip message text */
  glintTooltip = input.required<string>();
  /** Disable tooltip display */
  glintTooltipDisabled = input(false);
  /** Delay in ms before showing the tooltip */
  glintTooltipShowDelay = input(0);
  /** Delay in ms before hiding the tooltip */
  glintTooltipHideDelay = input(0);

  readonly tooltipId = `glint-tooltip-${nextTooltipId++}`;
  /** Whether the tooltip is currently visible */
  protected readonly isVisible = signal(false);

  private overlayService = inject(ZoneAwareOverlayService);
  private elRef = inject(ElementRef<HTMLElement>);
  private injector = inject(Injector);
  private destroyRef = inject(DestroyRef);
  private panelRef: ComponentRef<GlintTooltipPanelComponent> | null = null;
  private overlayRef: import('@angular/cdk/overlay').OverlayRef | null = null;
  private showTimer: ReturnType<typeof setTimeout> | null = null;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.clearTimers();
      this.hide();
    });
  }

  scheduleShow(): void {
    this.clearTimers();
    const delay = this.glintTooltipShowDelay();
    if (delay > 0) {
      this.showTimer = setTimeout(() => this.show(), delay);
    } else {
      this.show();
    }
  }

  scheduleHide(): void {
    this.clearTimers();
    const delay = this.glintTooltipHideDelay();
    if (delay > 0) {
      this.hideTimer = setTimeout(() => this.hide(), delay);
    } else {
      this.hide();
    }
  }

  private clearTimers(): void {
    if (this.showTimer) {
      clearTimeout(this.showTimer);
      this.showTimer = null;
    }
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
  }

  show(): void {
    if (this.glintTooltipDisabled() || !this.glintTooltip() || this.overlayRef) return;

    const config = createTooltipOverlayConfig(this.overlayService, this.elRef);

    const { overlayRef, injector } = this.overlayService.createZoneAwareOverlay(
      config,
      this.injector
    );

    this.overlayRef = overlayRef;
    this.isVisible.set(true);

    const portal = new ComponentPortal(GlintTooltipPanelComponent, null, injector);
    this.panelRef = overlayRef.attach(portal);
    this.panelRef.instance.message = this.glintTooltip();

    // Set the tooltip ID for aria-describedby
    overlayRef.overlayElement.setAttribute('id', this.tooltipId);
    overlayRef.overlayElement.setAttribute('role', 'tooltip');
  }

  hide(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
      this.panelRef = null;
      this.isVisible.set(false);
    }
  }
}

let nextTooltipId = 0;
