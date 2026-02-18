import { Component, inject, signal } from '@angular/core';
import {
  GlintScrollTopComponent,
  GlintMeterGroupComponent,
  GlintBlockUiComponent,
  GlintOverlayBadgeComponent,
  GlintConfirmPopupService,
  GlintFileUploadComponent,
  GlintButtonComponent,
} from '@glint/ui';
import type { GlintMeterItem } from '@glint/ui';

@Component({
  selector: 'glint-utilities-demo',
  standalone: true,
  imports: [
    GlintScrollTopComponent,
    GlintMeterGroupComponent,
    GlintBlockUiComponent,
    GlintOverlayBadgeComponent,
    GlintFileUploadComponent,
    GlintButtonComponent,
  ],
  template: `
    <h2>Utilities</h2>
    <p class="page-desc">Utility components for scroll-to-top, meters, blocking UI, badges, confirmations, and file uploads.</p>

    <!-- ScrollTop -->
    <div class="demo-section">
      <h3>ScrollTop</h3>
      <p class="section-desc">A floating button appears in the bottom-right corner when you scroll down past 400px.
      Scroll this page to see it in action.</p>
      <glint-scroll-top [threshold]="400" behavior="smooth" />
      <div class="output">The scroll-to-top button is fixed at the bottom-right of the viewport.
      Scroll down to see it appear.</div>
    </div>

    <!-- MeterGroup -->
    <div class="demo-section">
      <h3>MeterGroup - Horizontal</h3>
      <p class="section-desc">Multi-segment meter with labels and automatic coloring.</p>
      <glint-meter-group [value]="diskUsage" [max]="100" labelPosition="end" />
    </div>

    <div class="demo-section">
      <h3>MeterGroup - Custom Colors</h3>
      <glint-meter-group [value]="teamAllocation" [max]="100" labelPosition="start" />
    </div>

    <!-- BlockUI -->
    <div class="demo-section">
      <h3>BlockUI - Blocking Overlay</h3>
      <p class="section-desc">Click the button to block the content area with a loading overlay.</p>
      <div class="row" style="margin-block-end: 1rem;">
        <glint-button severity="primary" variant="filled" (click)="toggleBlock()">
          {{ isBlocked() ? 'Unblock' : 'Block Content' }}
        </glint-button>
      </div>
      <glint-block-ui [blocked]="isBlocked()" message="Loading data...">
        <div class="block-demo-content">
          <h4>Dashboard Widget</h4>
          <p>Revenue this month: $42,350</p>
          <p>Active users: 1,234</p>
          <p>Pending orders: 56</p>
          <p>System uptime: 99.97%</p>
        </div>
      </glint-block-ui>
    </div>

    <!-- OverlayBadge -->
    <div class="demo-section">
      <h3>OverlayBadge</h3>
      <p class="section-desc">Position badges on top of buttons or other elements.</p>
      <div class="row">
        <glint-overlay-badge [value]="5" severity="danger">
          <glint-button severity="neutral" variant="outlined">Notifications</glint-button>
        </glint-overlay-badge>

        <glint-overlay-badge [value]="'New'" severity="success" size="large">
          <glint-button severity="neutral" variant="outlined">Messages</glint-button>
        </glint-overlay-badge>

        <glint-overlay-badge [value]="99" severity="info">
          <glint-button severity="neutral" variant="outlined">Updates</glint-button>
        </glint-overlay-badge>

        <glint-overlay-badge [value]="'!'" severity="warn" size="xlarge">
          <glint-button severity="neutral" variant="outlined">Alerts</glint-button>
        </glint-overlay-badge>
      </div>
    </div>

    <!-- ConfirmPopup -->
    <div class="demo-section">
      <h3>Confirm Popup</h3>
      <p class="section-desc">An inline confirmation popup anchored to the triggering element.</p>
      <div class="row">
        <glint-button severity="danger" variant="filled" (click)="confirmDelete($event)">Delete Record</glint-button>
        <glint-button severity="primary" variant="outlined" (click)="confirmArchive($event)">Archive Item</glint-button>
      </div>
      @if (confirmPopupOutput) {
        <div class="output">{{ confirmPopupOutput }}</div>
      }
    </div>

    <!-- FileUpload -->
    <div class="demo-section">
      <h3>FileUpload - Single File</h3>
      <glint-file-upload
        accept="image/*,.pdf"
        [maxFileSize]="5242880"
        chooseLabel="Choose File"
        (selectFiles)="onSingleFileSelect($event)"
      />
      @if (singleFileOutput) {
        <div class="output">{{ singleFileOutput }}</div>
      }
    </div>

    <div class="demo-section">
      <h3>FileUpload - Multiple Files</h3>
      <p class="section-desc">Drag and drop files or click to browse. Max 10MB per file.</p>
      <glint-file-upload
        [multiple]="true"
        accept="image/*,.pdf,.doc,.docx"
        [maxFileSize]="10485760"
        chooseLabel="Browse Files"
        (selectFiles)="onMultiFileSelect($event)"
        (removeFile)="onFileRemoved($event)"
        (clear)="onFilesClear()"
      />
      @if (multiFileOutput) {
        <div class="output">{{ multiFileOutput }}</div>
      }
    </div>
  `,
  styles: `
    :host { display: block; }
    h2 { margin-block: 0 0.25rem; font-size: 1.75rem; font-weight: 600; color: #1e293b; }
    .page-desc { color: #64748b; margin-block: 0 2rem; font-size: 1.25rem; }
    .demo-section {
      background: white; border: 1px solid #e2e8f0; border-radius: 0.625rem;
      padding: 2rem; margin-block-end: 1.5rem;
    }
    .demo-section h3 { margin-block: 0 1rem; font-size: 1rem; font-weight: 600; color: #334155; }
    .row { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; }
    .stack { display: flex; flex-direction: column; gap: 1rem; }
    .output { margin-block-start: 1rem; padding: 0.75rem 1rem; background: #f8fafc;
      border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.875rem; color: #64748b; }
    .section-desc { color: #64748b; margin-block: 0 1rem; font-size: 0.875rem; }

    p { color: #475569; margin-block: 0.25rem; line-height: 1.5; }

    .block-demo-content {
      padding: 1.5rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      background: #f8fafc;
      min-height: 120px;
    }
    .block-demo-content h4 { margin-block: 0 0.5rem; color: #334155; }
    .block-demo-content p { margin-block: 0.25rem; font-size: 0.875rem; }
  `,
})
export class UtilitiesDemoComponent {
  private confirmPopup = inject(GlintConfirmPopupService);

  diskUsage: GlintMeterItem[] = [
    { label: 'Documents', value: 25, color: 'oklch(0.59 0.2 255)' },
    { label: 'Photos', value: 15, color: 'oklch(0.64 0.2 145)' },
    { label: 'Music', value: 10, color: 'oklch(0.7 0.18 55)' },
    { label: 'Videos', value: 20, color: 'oklch(0.55 0.22 305)' },
    { label: 'Free Space', value: 30, color: 'oklch(0.85 0.02 250)' },
  ];

  teamAllocation: GlintMeterItem[] = [
    { label: 'Frontend', value: 35, color: '#3b82f6' },
    { label: 'Backend', value: 25, color: '#10b981' },
    { label: 'DevOps', value: 15, color: '#f59e0b' },
    { label: 'QA', value: 15, color: '#8b5cf6' },
    { label: 'Design', value: 10, color: '#ec4899' },
  ];

  isBlocked = signal(false);
  confirmPopupOutput = '';
  singleFileOutput = '';
  multiFileOutput = '';

  toggleBlock(): void {
    this.isBlocked.update(v => !v);
    if (this.isBlocked()) {
      // Auto-unblock after 3 seconds for demo purposes
      setTimeout(() => this.isBlocked.set(false), 3000);
    }
  }

  confirmDelete(event: MouseEvent): void {
    this.confirmPopup.confirm({
      target: event.target as HTMLElement,
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete this record? This action cannot be undone.',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      accept: () => {
        this.confirmPopupOutput = 'Record deleted successfully.';
      },
      reject: () => {
        this.confirmPopupOutput = 'Deletion cancelled.';
      },
    });
  }

  confirmArchive(event: MouseEvent): void {
    this.confirmPopup.confirm({
      target: event.target as HTMLElement,
      header: 'Archive Item',
      message: 'Archive this item? It can be restored later from the archive.',
      acceptLabel: 'Archive',
      rejectLabel: 'Cancel',
      accept: () => {
        this.confirmPopupOutput = 'Item archived.';
      },
      reject: () => {
        this.confirmPopupOutput = 'Archive cancelled.';
      },
    });
  }

  onSingleFileSelect(files: File[]): void {
    if (files.length > 0) {
      const file = files[0];
      this.singleFileOutput = `Selected: ${file.name} (${this.formatBytes(file.size)})`;
    }
  }

  onMultiFileSelect(files: File[]): void {
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    this.multiFileOutput = `${files.length} file(s) selected, total: ${this.formatBytes(totalSize)}`;
  }

  onFileRemoved(file: File): void {
    this.multiFileOutput = `Removed: ${file.name}`;
  }

  onFilesClear(): void {
    this.multiFileOutput = 'All files cleared.';
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = bytes / Math.pow(k, i);
    return `${size % 1 === 0 ? size : size.toFixed(1)} ${units[i]}`;
  }
}
