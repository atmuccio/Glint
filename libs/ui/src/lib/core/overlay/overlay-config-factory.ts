import { OverlayConfig, ConnectedPosition } from '@angular/cdk/overlay';
import { ZoneAwareOverlayService } from './zone-aware-overlay.service';
import {
  DROPDOWN_POSITIONS,
  TOOLTIP_POSITIONS,
  POPOVER_POSITIONS,
} from './overlay-positions';

/**
 * Options for configuring a dropdown overlay.
 */
export interface DropdownOverlayOptions {
  /** Fixed width for the overlay (e.g. trigger element width) */
  width?: number | string;
  /** Minimum width for the overlay (ensures panel is at least as wide as trigger) */
  minWidth?: number | string;
  /** Override default positions */
  positions?: ConnectedPosition[];
  /** Whether to show a backdrop (default: true) */
  hasBackdrop?: boolean;
  /** Backdrop CSS class (default: 'cdk-overlay-transparent-backdrop') */
  backdropClass?: string;
  /** Whether to push the overlay on-screen when it would go off (default: true) */
  withPush?: boolean;
}

/**
 * Creates an overlay config for dropdown-style overlays.
 *
 * Used by: Select, MultiSelect, Autocomplete, CascadeSelect,
 * Datepicker, ColorPicker, TreeSelect, Menu, SplitButton.
 *
 * @param overlayService Zone-aware overlay service
 * @param targetEl Element to attach the overlay to
 * @param options Additional configuration
 */
export function createDropdownOverlayConfig(
  overlayService: ZoneAwareOverlayService,
  targetEl: HTMLElement | import('@angular/core').ElementRef,
  options?: DropdownOverlayOptions,
): OverlayConfig {
  const positions = options?.positions ?? DROPDOWN_POSITIONS;
  const positionStrategy = overlayService
    .position()
    .flexibleConnectedTo(targetEl)
    .withPositions(positions);

  if (options?.withPush !== false) {
    positionStrategy.withPush(true);
  }

  return new OverlayConfig({
    positionStrategy,
    scrollStrategy: overlayService.scrollStrategies.reposition(),
    hasBackdrop: options?.hasBackdrop ?? true,
    backdropClass: options?.backdropClass ?? 'cdk-overlay-transparent-backdrop',
    width: options?.width,
    minWidth: options?.minWidth,
  });
}

/**
 * Options for configuring a tooltip overlay.
 */
export interface TooltipOverlayOptions {
  /** Override default positions */
  positions?: ConnectedPosition[];
}

/**
 * Creates an overlay config for tooltip overlays.
 *
 * Used by: GlintTooltipDirective.
 *
 * @param overlayService Zone-aware overlay service
 * @param targetEl Element to attach the tooltip to
 * @param options Additional configuration
 */
export function createTooltipOverlayConfig(
  overlayService: ZoneAwareOverlayService,
  targetEl: HTMLElement | import('@angular/core').ElementRef,
  options?: TooltipOverlayOptions,
): OverlayConfig {
  return new OverlayConfig({
    positionStrategy: overlayService
      .position()
      .flexibleConnectedTo(targetEl)
      .withPositions(options?.positions ?? TOOLTIP_POSITIONS),
    scrollStrategy: overlayService.scrollStrategies.reposition(),
  });
}

/**
 * Options for configuring a popover overlay.
 */
export interface PopoverOverlayOptions {
  /** Override default positions */
  positions?: ConnectedPosition[];
  /** Whether to show a backdrop (default: true) */
  hasBackdrop?: boolean;
  /** Backdrop CSS class (default: 'cdk-overlay-transparent-backdrop') */
  backdropClass?: string;
}

/**
 * Creates an overlay config for popover overlays.
 *
 * Used by: Popover, ConfirmPopup.
 *
 * @param overlayService Zone-aware overlay service
 * @param targetEl Element to attach the popover to
 * @param options Additional configuration
 */
export function createPopoverOverlayConfig(
  overlayService: ZoneAwareOverlayService,
  targetEl: HTMLElement | import('@angular/core').ElementRef,
  options?: PopoverOverlayOptions,
): OverlayConfig {
  return new OverlayConfig({
    positionStrategy: overlayService
      .position()
      .flexibleConnectedTo(targetEl)
      .withPositions(options?.positions ?? POPOVER_POSITIONS),
    scrollStrategy: overlayService.scrollStrategies.reposition(),
    hasBackdrop: options?.hasBackdrop ?? true,
    backdropClass: options?.backdropClass ?? 'cdk-overlay-transparent-backdrop',
  });
}
