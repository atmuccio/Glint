/** Menu item model */
export interface GlintMenuItem {
  /** Display label */
  label: string;
  /** Optional icon class or identifier */
  icon?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Visual separator after this item */
  separator?: boolean;
  /** Click handler */
  command?: () => void;
}
