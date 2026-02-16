import { Component, viewChild } from '@angular/core';
import {
  GlintBreadcrumbComponent,
  GlintMenuComponent,
  GlintSplitButtonComponent,
  GlintButtonComponent,
} from '@glint/ui';
import type { GlintMenuItem, GlintBreadcrumbItem } from '@glint/ui';

@Component({
  selector: 'glint-navigation-demo',
  standalone: true,
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
    h2 { margin-block: 0 0.25rem; font-size: 1.75rem; font-weight: 600; color: #1e293b; }
    .page-desc { color: #64748b; margin-block: 0 2rem; font-size: 1.25rem; }
    .demo-section {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 0.625rem;
      padding: 2rem;
      margin-block-end: 1.5rem;
    }
    .demo-section h3 { margin-block: 0 1rem; font-size: 1rem; font-weight: 600; color: #334155; }
    .row { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; }
    .stack { display: flex; flex-direction: column; gap: 1rem; }
    .output { margin-block-start: 1rem; padding: 0.75rem 1rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.875rem; color: #64748b; }
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
