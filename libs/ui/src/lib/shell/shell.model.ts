import { InjectionToken, Signal } from '@angular/core';

/**
 * Injection token for the parent shell sidebar.
 * Used by children (e.g., PanelMenu) to detect collapsed state.
 */
export const GLINT_SHELL_SIDEBAR = new InjectionToken<GlintShellSidebarHost>('GLINT_SHELL_SIDEBAR');

/**
 * Interface that the sidebar component implements.
 * Consumed by child components via the GLINT_SHELL_SIDEBAR token.
 */
export interface GlintShellSidebarHost {
  /** Whether the sidebar is currently collapsed */
  collapsed: Signal<boolean>;
  /** The expanded width */
  width: Signal<string>;
  /** The collapsed width */
  collapsedWidth: Signal<string>;
}
