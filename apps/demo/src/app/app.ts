import { Component, computed, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  GlintShellComponent,
  GlintShellSidebarComponent,
  GlintShellHeaderComponent,
  GlintShellContentComponent,
  GlintPanelMenuComponent,
  GlintDividerComponent,
  GlintButtonComponent,
  GlintStyleZoneComponent,
  GlintSearchComponent,
  DARK_ZONE,
} from '@glint/ui';
import type { GlintMenuItem } from '@glint/ui';

@Component({
  imports: [
    RouterModule,
    GlintShellComponent,
    GlintShellSidebarComponent,
    GlintShellHeaderComponent,
    GlintShellContentComponent,
    GlintPanelMenuComponent,
    GlintDividerComponent,
    GlintButtonComponent,
    GlintStyleZoneComponent,
    GlintSearchComponent,
  ],
  selector: 'glint-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly DARK_ZONE = DARK_ZONE;
  protected sidebarCollapsed = signal(false);
  protected searchQuery = signal('');

  protected filteredLinks = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return [];
    const results: { label: string; routerLink: string | string[]; group: string }[] = [];
    for (const group of this.navItems) {
      for (const child of group.items ?? []) {
        if (child.label.toLowerCase().includes(q) && child.routerLink) {
          results.push({ label: child.label, routerLink: child.routerLink, group: group.label });
        }
      }
    }
    return results;
  });

  protected clearSearch(): void {
    this.searchQuery.set('');
  }

  protected navItems: GlintMenuItem[] = [
    {
      label: 'General',
      icon: '&#9679;',
      items: [
        { label: 'Button', routerLink: '/button' },
      ],
    },
    {
      label: 'Form',
      icon: '&#9998;',
      items: [
        { label: 'Input', routerLink: '/input' },
        { label: 'Text Inputs', routerLink: '/text-inputs' },
        { label: 'Select', routerLink: '/select' },
        { label: 'Form Controls', routerLink: '/form-controls' },
        { label: 'Selection Controls', routerLink: '/selection' },
        { label: 'Advanced Inputs', routerLink: '/advanced-inputs' },
        { label: 'Advanced Selects', routerLink: '/advanced-selects' },
      ],
    },
    {
      label: 'Data Display',
      icon: '&#9638;',
      items: [
        { label: 'Card', routerLink: '/card' },
        { label: 'Data Display', routerLink: '/data-display' },
        { label: 'Table', routerLink: '/table' },
        { label: 'Tabs', routerLink: '/tabs' },
        { label: 'Accordion', routerLink: '/accordion' },
        { label: 'Trees', routerLink: '/trees' },
        { label: 'Lists & Data', routerLink: '/lists' },
        { label: 'Media', routerLink: '/media' },
      ],
    },
    {
      label: 'Feedback',
      icon: '&#9888;',
      items: [
        { label: 'Messages & Progress', routerLink: '/feedback' },
        { label: 'Toast', routerLink: '/toast' },
        { label: 'Dialog', routerLink: '/dialog' },
      ],
    },
    {
      label: 'Navigation',
      icon: '&#9776;',
      items: [
        { label: 'Menu & Breadcrumb', routerLink: '/navigation' },
        { label: 'Stepper & Timeline', routerLink: '/stepper-timeline' },
        { label: 'Advanced Menus', routerLink: '/advanced-menus' },
      ],
    },
    {
      label: 'Layout',
      icon: '&#9707;',
      items: [
        { label: 'Shell', routerLink: '/shell' },
        { label: 'Divider', routerLink: '/divider' },
        { label: 'Containers', routerLink: '/containers' },
        { label: 'Panels & Editors', routerLink: '/panels' },
        { label: 'Utilities', routerLink: '/utilities' },
      ],
    },
    {
      label: 'Overlay',
      icon: '&#9633;',
      items: [
        { label: 'Tooltip', routerLink: '/tooltip' },
      ],
    },
    {
      label: 'Theming',
      icon: '&#9788;',
      items: [
        { label: 'Theme Zones', routerLink: '/theme' },
      ],
    },
  ];
}
