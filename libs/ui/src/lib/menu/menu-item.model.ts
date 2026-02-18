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
  /** Nested child items (for submenus, tiered/panel menus) */
  items?: GlintMenuItem[];
  /** Expanded state for accordion-style menus (PanelMenu) */
  expanded?: boolean;
  /** Angular router link */
  routerLink?: string | string[];
  /** CSS style class */
  styleClass?: string;
  /** Whether this item is visible (default true) */
  visible?: boolean;
}
