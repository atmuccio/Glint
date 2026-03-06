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
  host: { class: 'demo-page' },
  styles: `
    :host { display: block; }
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
