import { Component, inject, viewChild } from '@angular/core';
import {
  GlintDrawerComponent,
  GlintPopoverComponent,
  GlintToolbarComponent,
  GlintFieldsetComponent,
  GlintButtonComponent,
  GlintConfirmDialogService,
} from '@glint/ui';

@Component({
  selector: 'glint-containers-demo',
  standalone: true,
  imports: [
    GlintDrawerComponent,
    GlintPopoverComponent,
    GlintToolbarComponent,
    GlintFieldsetComponent,
    GlintButtonComponent,
  ],
  template: `
    <h2>Containers</h2>
    <p class="page-desc">Panels, overlays, and grouping components for organizing content.</p>

    <div class="demo-section">
      <h3>Drawer</h3>
      <div class="row">
        <glint-button severity="primary" variant="filled" (click)="openDrawer()">Open Drawer</glint-button>
      </div>
      <glint-drawer #drawer header="Settings" position="right">
        <p>This is the drawer content. You can place any content here.</p>
        <p>Use the backdrop or Escape key to close.</p>
      </glint-drawer>
    </div>

    <div class="demo-section">
      <h3>Popover</h3>
      <div class="row">
        <glint-button severity="secondary" variant="outlined" (click)="togglePopover()">Show Popover</glint-button>
        <glint-popover #popover>
          <p class="popover-text">This is rich popover content with <strong>formatted text</strong> and additional detail.</p>
        </glint-popover>
      </div>
    </div>

    <div class="demo-section">
      <h3>Toolbar</h3>
      <glint-toolbar>
        <div glintToolbarStart>
          <glint-button severity="neutral" variant="ghost">Back</glint-button>
        </div>
        <div glintToolbarCenter>
          <span class="toolbar-title">Page Title</span>
        </div>
        <div glintToolbarEnd>
          <glint-button severity="primary" variant="filled">Save</glint-button>
          <glint-button severity="neutral" variant="outlined">Cancel</glint-button>
        </div>
      </glint-toolbar>
    </div>

    <div class="demo-section">
      <h3>Fieldset</h3>
      <div class="stack">
        <glint-fieldset legend="Personal Information">
          <p>Name, email, phone number and other personal details go here.</p>
        </glint-fieldset>
        <glint-fieldset legend="Toggleable Section" [toggleable]="true">
          <p>This section can be collapsed and expanded by clicking the legend.</p>
        </glint-fieldset>
      </div>
    </div>

    <div class="demo-section">
      <h3>Confirm Dialog</h3>
      <div class="row">
        <glint-button severity="danger" variant="filled" (click)="confirmDelete()">Delete Item</glint-button>
      </div>
      @if (confirmResult) {
        <div class="output">Result: {{ confirmResult }}</div>
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
    .popover-text { margin: 0; line-height: 1.5; }
    .toolbar-title { font-weight: 600; font-size: 1rem; }
    p { color: #475569; margin-block: 0.25rem; line-height: 1.5; }
  `,
})
export class ContainersDemoComponent {
  private confirmService = inject(GlintConfirmDialogService);
  private drawer = viewChild.required<GlintDrawerComponent>('drawer');
  private popover = viewChild.required<GlintPopoverComponent>('popover');

  confirmResult = '';

  openDrawer(): void {
    this.drawer().open();
  }

  togglePopover(): void {
    this.popover().toggle();
  }

  async confirmDelete(): Promise<void> {
    const result = await this.confirmService.confirm({
      header: 'Delete Item',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
      severity: 'danger',
    });
    this.confirmResult = result ? 'Confirmed — item deleted' : 'Cancelled';
  }
}
