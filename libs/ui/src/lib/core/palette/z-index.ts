/**
 * Z-index scale for layered UI elements.
 *
 * CDK overlay components (Dialog, Tooltip, Menu) use the CDK's
 * own z-index management. These constants are for non-CDK elements
 * like Toast and Sticky headers.
 */
export const GlintZIndex = {
  /** Dropdowns and select panels */
  Dropdown: 1000,
  /** Sticky headers and footers */
  Sticky: 1020,
  /** Modal dialogs and drawers */
  Dialog: 1040,
  /** Tooltips and popovers */
  Tooltip: 1060,
  /** Toast notifications */
  Toast: 1080,
} as const;
