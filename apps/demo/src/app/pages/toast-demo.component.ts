import { Component, inject } from '@angular/core';
import {
  GlintToastComponent,
  GlintToastService,
  GlintButtonComponent,
} from '@glint-ng/core';

@Component({
  selector: 'glint-toast-demo',
  standalone: true,
  imports: [GlintToastComponent, GlintButtonComponent],
  host: { class: 'demo-page' },
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
