import { Component, inject, viewChild } from '@angular/core';
import {
  GlintDrawerComponent,
  GlintPopoverComponent,
  GlintToolbarComponent,
  GlintFieldsetComponent,
  GlintButtonComponent,
  GlintConfirmDialogService,
} from '@glint-ng/core';

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
  host: { class: 'demo-page' },
  styles: `
    :host { display: block; }
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
