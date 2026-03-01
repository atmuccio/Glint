import { Component, signal } from '@angular/core';
import {
  GlintShellComponent,
  GlintShellSidebarComponent,
  GlintShellHeaderComponent,
  GlintShellContentComponent,
  GlintButtonComponent,
  GlintAvatarComponent,
  GlintPanelMenuComponent,
  GlintDividerComponent,
  GlintStyleZoneComponent,
  DARK_ZONE,
} from '@glint-ng/core';
import type { GlintMenuItem } from '@glint-ng/core';

@Component({
  selector: 'glint-shell-demo',
  standalone: true,
  imports: [
    GlintShellComponent,
    GlintShellSidebarComponent,
    GlintShellHeaderComponent,
    GlintShellContentComponent,
    GlintButtonComponent,
    GlintAvatarComponent,
    GlintPanelMenuComponent,
    GlintDividerComponent,
    GlintStyleZoneComponent,
  ],
  styles: `
    :host { display: block; }

    .shell-wrapper {
      block-size: 600px;
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      overflow: hidden;
      position: relative;
    }

    /* Override shell min-height within the demo wrapper */
    .shell-wrapper glint-shell {
      min-block-size: 100% !important;
    }

    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: var(--glint-spacing-sm);
      padding: var(--glint-spacing-md);
      font-weight: 700;
      font-size: 1.125rem;
    }

    .sidebar-logo.collapsed {
      justify-content: center;
      padding-inline: var(--glint-spacing-xs);
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: var(--glint-spacing-sm);
      inline-size: 100%;
    }

    .header-title {
      font-weight: 600;
      font-size: 1.125rem;
    }

    .header-spacer { flex: 1; }

    .demo-content {
      padding: var(--glint-spacing-lg);
    }

    .demo-content h2 {
      margin: 0 0 var(--glint-spacing-md);
      font-size: 1.25rem;
    }

    .demo-content p {
      color: var(--glint-color-text-muted);
      line-height: 1.6;
    }
  `,
  template: `
    <h2>Shell</h2>
    <p class="page-desc">App layout container with sidebar, header, and content areas.</p>

    <div class="demo-section">
      <h3>Interactive Shell</h3>
      <div class="shell-wrapper">
        <glint-shell [breakpointCollapse]="0">
          <glint-style-zone [theme]="DARK_ZONE">
            <glint-shell-sidebar [(collapsed)]="sidebarCollapsed" width="240px" collapsedWidth="56px">
              <div class="sidebar-logo" [class.collapsed]="sidebarCollapsed()">
                <span>&#9670;</span>
                @if (!sidebarCollapsed()) {
                  <span>Glint Demo</span>
                }
              </div>
              <glint-divider />
              <glint-panel-menu [items]="navItems" [multiple]="true" />
            </glint-shell-sidebar>
          </glint-style-zone>

          <glint-shell-header>
            <div class="header-content">
              <glint-button variant="ghost" size="sm" (click)="sidebarCollapsed.set(!sidebarCollapsed())">
                &#9776;
              </glint-button>
              <span class="header-title">Dashboard</span>
              <span class="header-spacer"></span>
              <glint-avatar label="JD" size="sm" />
            </div>
          </glint-shell-header>

          <glint-shell-content>
            <div class="demo-content">
              <h2>Welcome to Glint Demo</h2>
              <p>
                This is the main content area. It scrolls independently of the sidebar and header.
                The sidebar can be collapsed via the hamburger button. Try clicking it!
              </p>
              <p>
                The sidebar is wrapped in a dark style zone, demonstrating how
                &lt;glint-style-zone&gt; integrates with the shell components.
              </p>
            </div>
          </glint-shell-content>
        </glint-shell>
      </div>
    </div>
  `,
})
export class ShellDemoComponent {
  protected readonly DARK_ZONE = DARK_ZONE;
  protected sidebarCollapsed = signal(false);

  protected navItems: GlintMenuItem[] = [
    {
      label: 'Dashboard',
      icon: '&#9670;',
      items: [
        { label: 'Overview' },
        { label: 'Analytics' },
      ],
    },
    {
      label: 'Products',
      icon: '&#9783;',
      items: [
        { label: 'Catalog' },
        { label: 'Inventory' },
        { label: 'Pricing' },
      ],
    },
    {
      label: 'Orders',
      icon: '&#9993;',
      items: [
        { label: 'All Orders' },
        { label: 'Returns' },
      ],
    },
    {
      label: 'Reports',
      icon: '&#9776;',
      command: () => {},
    },
    {
      label: 'Settings',
      icon: '&#9881;',
      items: [
        { label: 'General' },
        { label: 'Users' },
      ],
    },
  ];
}
