import { ConnectedPosition } from '@angular/cdk/overlay';

/**
 * Standard dropdown/select overlay positions.
 *
 * Preferred: below-start, then above-start, below-end, above-end.
 * Used by: Menu, Select, Multiselect, Autocomplete, CascadeSelect,
 *          TieredMenu, Datepicker, ColorPicker, ConfirmPopup.
 */
export const DROPDOWN_POSITIONS: ConnectedPosition[] = [
  { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
  { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 4 },
  { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -4 },
];

/**
 * Tooltip overlay positions.
 *
 * Preferred: above-center, below-center, right-center, left-center.
 * Used by: Tooltip directive.
 */
export const TOOLTIP_POSITIONS: ConnectedPosition[] = [
  { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -8 },
  { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 8 },
  { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: 8 },
  { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -8 },
];

/** Named tooltip position presets — each prefers a direction with fallbacks. */
export type GlintTooltipPosition = 'auto' | 'above' | 'below' | 'before' | 'after';

export const TOOLTIP_POSITION_MAP: Record<Exclude<GlintTooltipPosition, 'auto'>, ConnectedPosition[]> = {
  above:  [TOOLTIP_POSITIONS[0], TOOLTIP_POSITIONS[1], TOOLTIP_POSITIONS[2], TOOLTIP_POSITIONS[3]],
  below:  [TOOLTIP_POSITIONS[1], TOOLTIP_POSITIONS[0], TOOLTIP_POSITIONS[2], TOOLTIP_POSITIONS[3]],
  after:  [TOOLTIP_POSITIONS[2], TOOLTIP_POSITIONS[3], TOOLTIP_POSITIONS[0], TOOLTIP_POSITIONS[1]],
  before: [TOOLTIP_POSITIONS[3], TOOLTIP_POSITIONS[2], TOOLTIP_POSITIONS[0], TOOLTIP_POSITIONS[1]],
};

/**
 * Popover overlay positions.
 *
 * Preferred: below-center, above-center, right-center, left-center.
 * Used by: Popover, ConfirmPopup.
 */
export const POPOVER_POSITIONS: ConnectedPosition[] = [
  { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 8 },
  { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -8 },
  { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: 8 },
  { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -8 },
];

/**
 * End-aligned dropdown positions (right-aligned).
 *
 * Preferred: below-end, above-end.
 * Used by: SplitButton.
 */
export const DROPDOWN_END_POSITIONS: ConnectedPosition[] = [
  { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 4 },
  { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -4 },
];

/**
 * Sub-menu / cascade panel positions (opens to the side).
 *
 * Preferred: right of parent, then left of parent.
 * Used by: CascadeSelect sub-panels, TieredMenu sub-panels.
 */
export const SUBMENU_POSITIONS: ConnectedPosition[] = [
  { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: 0 },
  { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: 0 },
];
