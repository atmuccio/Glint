import { Component, inject } from '@angular/core';
import { GlintButtonComponent, injectGlintDialog, GlintDialogRef, GLINT_DIALOG_DATA } from '@glint/ui';

@Component({
  selector: 'glint-sample-dialog',
  standalone: true,
  template: `
    <h3>Sample Dialog</h3>
    <p>Data: {{ data }}</p>
    <glint-button severity="primary" (click)="dialogRef.close('confirmed')">Confirm</glint-button>
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

    <section>
      <h3>Basic Dialog</h3>
      <div class="row">
        <glint-button severity="primary" (click)="openDialog()">Open Dialog</glint-button>
      </div>
      @if (lastResult) {
        <p>Last result: {{ lastResult }}</p>
      }
    </section>
  `,
  styles: `
    :host { display: block; }
    section { margin-block-end: 2rem; }
    .row { display: flex; gap: 0.75rem; }
    p { margin-block-start: 0.5rem; font-size: 0.875rem; color: #64748b; }
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
