import { Component, viewChild } from '@angular/core';
import {
  GlintBreadcrumbComponent,
  GlintMenuComponent,
  GlintSplitButtonComponent,
  GlintButtonComponent,
} from '@glint-ng/core';
import type { GlintMenuItem, GlintBreadcrumbItem } from '@glint-ng/core';

@Component({
  selector: 'glint-navigation-demo',
  standalone: true,
  host: { class: 'demo-page' },
  imports: [
    GlintBreadcrumbComponent,
    GlintMenuComponent,
    GlintSplitButtonComponent,
    GlintButtonComponent,
  ],
  template: `
    <h2>Navigation</h2>
    <p class="page-desc">Components for navigating and triggering contextual actions.</p>

    <div class="demo-section">
      <h3>Breadcrumb</h3>
      <glint-breadcrumb [items]="breadcrumbItems" />
    </div>

    <div class="demo-section">
      <h3>Menu</h3>
      <div class="row">
        <glint-button severity="primary" variant="outlined" (click)="toggleMenu()">Actions</glint-button>
        <glint-menu #menu [items]="menuItems" />
      </div>
      @if (lastMenuAction) {
        <div class="output">Last action: {{ lastMenuAction }}</div>
      }
    </div>

    <div class="demo-section">
      <h3>Split Button</h3>
      <div class="row">
        <glint-split-button label="Save" [items]="splitItems" (primaryClick)="onSplitPrimary()" />
      </div>
      @if (lastSplitAction) {
        <div class="output">Last action: {{ lastSplitAction }}</div>
      }
    </div>
  `,
  styles: `
    :host { display: block; }
  `,
})
export class NavigationDemoComponent {
  private menu = viewChild.required<GlintMenuComponent>('menu');

  breadcrumbItems: GlintBreadcrumbItem[] = [
    { label: 'Home' },
    { label: 'Products' },
    { label: 'Detail' },
  ];

  lastMenuAction = '';
  lastSplitAction = '';

  menuItems: GlintMenuItem[] = [
    { label: 'Edit', command: () => { this.lastMenuAction = 'Edit'; } },
    { label: 'Duplicate', command: () => { this.lastMenuAction = 'Duplicate'; } },
    { label: 'Archive', command: () => { this.lastMenuAction = 'Archive'; } },
    { label: 'Delete', command: () => { this.lastMenuAction = 'Delete'; } },
  ];

  splitItems: GlintMenuItem[] = [
    { label: 'Save as Draft', command: () => { this.lastSplitAction = 'Saved as draft'; } },
    { label: 'Save & Close', command: () => { this.lastSplitAction = 'Saved and closed'; } },
    { label: 'Save & New', command: () => { this.lastSplitAction = 'Saved and new'; } },
  ];

  toggleMenu(): void {
    this.menu().toggle();
  }

  onSplitPrimary(): void {
    this.lastSplitAction = 'Primary save';
  }
}
