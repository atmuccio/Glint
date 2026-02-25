import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { GlintShellSidebarComponent } from './shell-sidebar.component';

/**
 * Top-level app layout container using CSS Grid.
 * Arranges sidebar, header, and content in a responsive grid.
 *
 * @example
 * ```html
 * <glint-shell>
 *   <glint-style-zone [theme]="DARK_ZONE">
 *     <glint-shell-sidebar [(collapsed)]="sidebarCollapsed">
 *       <glint-panel-menu [items]="navItems" />
 *     </glint-shell-sidebar>
 *   </glint-style-zone>
 *   <glint-shell-header>
 *     <span>App Title</span>
 *   </glint-shell-header>
 *   <glint-shell-content>
 *     <router-outlet />
 *   </glint-shell-content>
 * </glint-shell>
 * ```
 */
@Component({
  selector: 'glint-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--_sidebar-width]': 'sidebarWidth()',
  },
  styles: `
    :host {
      display: grid;
      grid-template-columns: var(--_sidebar-width, 0px) 1fr;
      grid-template-rows: auto 1fr;
      min-block-size: 100vh;
      min-block-size: 100dvh;
      transition: grid-template-columns var(--glint-duration-normal) var(--glint-easing);
    }
  `,
  template: `
    <ng-content select="glint-shell-sidebar, glint-style-zone" />
    <ng-content select="glint-shell-header" />
    <ng-content select="glint-shell-content" />
  `,
})
export class GlintShellComponent {
  /** Viewport width (px) below which sidebar auto-collapses. 0 to disable. */
  breakpointCollapse = input(1024);

  private sidebarChild = contentChild(GlintShellSidebarComponent, { descendants: true });
  private destroyRef = inject(DestroyRef);
  private isCollapseMode = signal(false);
  private cleanupListener: (() => void) | null = null;

  /** Computed sidebar width for grid-template-columns */
  sidebarWidth = computed(() => {
    const sidebar = this.sidebarChild();
    if (!sidebar) return '0px';
    const autoCollapsed = this.isCollapseMode();
    const manualCollapsed = sidebar.collapsed();
    return (autoCollapsed || manualCollapsed)
      ? sidebar.collapsedWidth()
      : sidebar.width();
  });

  constructor() {
    afterNextRender(() => {
      this.setupBreakpointListener();
    });
    this.destroyRef.onDestroy(() => this.cleanupListener?.());
  }

  private setupBreakpointListener(): void {
    const bp = this.breakpointCollapse();
    if (bp <= 0) return;

    const mql = window.matchMedia(`(max-width: ${bp}px)`);
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      this.isCollapseMode.set(e.matches);
    };
    handler(mql);
    mql.addEventListener('change', handler as EventListener);
    this.cleanupListener = () => mql.removeEventListener('change', handler as EventListener);
  }
}
