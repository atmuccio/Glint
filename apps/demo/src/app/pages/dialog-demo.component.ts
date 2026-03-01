import { Component, inject } from '@angular/core';
import { GlintButtonComponent, injectGlintDialog, GlintDialogRef, GLINT_DIALOG_DATA } from '@glint-ng/core';

@Component({
  selector: 'glint-sample-dialog',
  standalone: true,
  template: `
    <div class="dialog-header">
      <h3>Sample Dialog</h3>
    </div>
    <div class="dialog-body">
      <p>Data: {{ data }}</p>
    </div>
    <div class="dialog-footer">
      <glint-button variant="ghost" severity="neutral" (click)="dialogRef.close()">Cancel</glint-button>
      <glint-button variant="filled" severity="primary" (click)="dialogRef.close('confirmed')">Confirm</glint-button>
    </div>
  `,
  styles: `
    .dialog-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
    .dialog-header h3 { margin: 0; font-size: 1.125rem; font-weight: 600; }
    .dialog-body { margin-bottom: 1.5rem; color: #475569; line-height: 1.5; }
    .dialog-footer { display: flex; gap: 0.5rem; justify-content: flex-end; }
  `,
  imports: [GlintButtonComponent],
})
class SampleDialogComponent {
  data = inject(GLINT_DIALOG_DATA);
  dialogRef = inject(GlintDialogRef);
}

@Component({
  selector: 'glint-dialog-demo',
  standalone: true,
  imports: [GlintButtonComponent],
  template: `
    <h2>Dialog</h2>
    <p class="page-desc">Dialog displays content in an overlay panel.</p>

    <div class="demo-section">
      <h3>Basic Dialog</h3>
      <div class="row">
        <glint-button severity="primary" (click)="openDialog()">Open Dialog</glint-button>
      </div>
      @if (lastResult) {
        <div class="output">Last result: {{ lastResult }}</div>
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
    .output { margin-block-start: 1rem; padding: 0.75rem 1rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.875rem; color: #64748b; }
  `,
})
export class DialogDemoComponent {
  private dialog = injectGlintDialog();
  lastResult = '';

  openDialog(): void {
    const ref = this.dialog.open(SampleDialogComponent, {
      data: 'Hello from the demo!',
      width: '400px',
    });
    ref.afterClosed$.subscribe(result => {
      this.lastResult = String(result ?? 'dismissed');
    });
  }
}
