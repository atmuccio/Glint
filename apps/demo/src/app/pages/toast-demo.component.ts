import { Component, inject } from '@angular/core';
import {
  GlintToastComponent,
  GlintToastService,
  GlintButtonComponent,
} from '@glint/ui';

@Component({
  selector: 'glint-toast-demo',
  standalone: true,
  imports: [GlintToastComponent, GlintButtonComponent],
  template: `
    <h2>Toast</h2>
    <p class="page-desc">Toast notifications for transient feedback messages.</p>

    <glint-toast />

    <div class="demo-section">
      <h3>Severities</h3>
      <div class="row">
        <glint-button severity="success" variant="filled" (click)="showSuccess()">Success</glint-button>
        <glint-button severity="primary" variant="filled" (click)="showInfo()">Info</glint-button>
        <glint-button severity="warning" variant="filled" (click)="showWarning()">Warning</glint-button>
        <glint-button severity="danger" variant="filled" (click)="showDanger()">Danger</glint-button>
      </div>
    </div>

    <div class="demo-section">
      <h3>Sticky Toast</h3>
      <div class="row">
        <glint-button severity="secondary" variant="outlined" (click)="showSticky()">Show Sticky</glint-button>
      </div>
      <p class="hint">Sticky toasts remain visible until manually dismissed (duration = 0).</p>
    </div>

    <div class="demo-section">
      <h3>Clear All</h3>
      <div class="row">
        <glint-button severity="neutral" variant="filled" (click)="clearAll()">Clear All</glint-button>
      </div>
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
    .hint { margin-block-start: 1rem; color: #64748b; font-size: 0.875rem; }
  `,
})
export class ToastDemoComponent {
  private toast = inject(GlintToastService);

  showSuccess(): void {
    this.toast.show({ severity: 'success', summary: 'Success', detail: 'Operation completed successfully.' });
  }

  showInfo(): void {
    this.toast.show({ severity: 'info', summary: 'Info', detail: 'Here is some useful information.' });
  }

  showWarning(): void {
    this.toast.show({ severity: 'warning', summary: 'Warning', detail: 'Please review before proceeding.' });
  }

  showDanger(): void {
    this.toast.show({ severity: 'danger', summary: 'Error', detail: 'An unexpected error occurred.' });
  }

  showSticky(): void {
    this.toast.show({ severity: 'info', summary: 'Sticky', detail: 'This toast will not auto-dismiss.', duration: 0 });
  }

  clearAll(): void {
    this.toast.clear();
  }
}
