import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import { GLINT_SHELL_SIDEBAR, GlintShellSidebarHost } from './shell.model';

/**
 * Sidebar area within a shell layout. Houses navigation
 * (typically a `<glint-panel-menu>`) and supports collapse/expand.
 *
 * Provides `GLINT_SHELL_SIDEBAR` so child components (e.g., PanelMenu)
 * can detect collapsed state via DI.
 *
 * @example
 * ```html
 * <glint-shell-sidebar [(collapsed)]="sidebarCollapsed">
 *   <img src="logo.svg" class="sidebar-logo" />
 *   <glint-panel-menu [items]="navItems" />
 * </glint-shell-sidebar>
 * ```
 */
@Component({
  selector: 'glint-shell-sidebar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: GLINT_SHELL_SIDEBAR, useExisting: GlintShellSidebarComponent },
  ],
  host: {
    'role': 'navigation',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.data-collapsed]': 'collapsed() || null',
  },
  styles: `
    :host {
      grid-column: 1;
      grid-row: 1 / -1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: var(--glint-color-surface);
      border-inline-end: 1px solid var(--glint-color-border);
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      color: var(--glint-color-text);
      transition:
        background-color var(--glint-duration-normal) var(--glint-easing),
        color var(--glint-duration-normal) var(--glint-easing),
        border-color var(--glint-duration-normal) var(--glint-easing);
    }

    .sidebar-inner {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
    }
  `,
  template: `
    <div class="sidebar-inner">
      <ng-content />
    </div>
  `,
})
export class GlintShellSidebarComponent implements GlintShellSidebarHost {
  /** Whether the sidebar is collapsed (two-way bindable) */
  collapsed = model(false);
  /** Sidebar expanded width */
  width = input('260px');
  /** Sidebar collapsed width */
  collapsedWidth = input('64px');
  /** ARIA label for the sidebar navigation landmark */
  ariaLabel = input('Main navigation');

  /** Toggle collapsed state */
  toggle(): void {
    this.collapsed.update(v => !v);
  }
}
