import { Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { injectGlintDialog, GlintDialog } from './dialog.service';
import { GLINT_DIALOG_DATA } from './dialog.config';
import { GlintDialogRef } from './dialog-ref';
import { cleanupOverlays } from '../testing/test-utils';

@Component({
  selector: 'glint-test-dialog-content',
  standalone: true,
  template: `<p>Dialog content: {{ data }}</p>`,
})
class TestDialogContentComponent {
  data = inject(GLINT_DIALOG_DATA);
  dialogRef = inject(GlintDialogRef);
}

@Component({
  selector: 'glint-test-dialog-host',
  standalone: true,
  template: `<button (click)="open()">Open Dialog</button>`,
})
class TestDialogHostComponent {
  dialog: GlintDialog = injectGlintDialog();
  lastRef: GlintDialogRef<TestDialogContentComponent, string> | null = null;

  open(): void {
    this.lastRef = this.dialog.open(TestDialogContentComponent, {
      data: 'hello world',
    });
  }
}

describe('GlintDialogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestDialogHostComponent],
    });
  });

  afterEach(() => {
    // Clean up any open dialogs
    const containers = document.querySelectorAll('glint-dialog-container');
    containers.forEach(el => el.remove());
    cleanupOverlays();
  });

  it('should open a dialog with content component', async () => {
    const fixture = TestBed.createComponent(TestDialogHostComponent);
    fixture.detectChanges();

    fixture.componentInstance.open();
    fixture.detectChanges();
    await fixture.whenStable();

    const dialog = document.querySelector('glint-dialog-container') as HTMLElement;
    expect(dialog).toBeTruthy();
    expect(dialog.getAttribute('role')).toBe('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
  });

  it('should pass data to dialog content', async () => {
    const fixture = TestBed.createComponent(TestDialogHostComponent);
    fixture.detectChanges();

    fixture.componentInstance.open();
    fixture.detectChanges();
    await fixture.whenStable();

    const content = document.querySelector('glint-test-dialog-content') as HTMLElement;
    expect(content).toBeTruthy();
    expect(content.textContent).toContain('hello world');
  });

  it('should close dialog via dialogRef.close()', async () => {
    const fixture = TestBed.createComponent(TestDialogHostComponent);
    fixture.detectChanges();

    fixture.componentInstance.open();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.querySelector('glint-dialog-container')).toBeTruthy();

    fixture.componentInstance.lastRef?.close('result');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.querySelector('glint-dialog-container')).toBeFalsy();
  });

  it('should emit result on afterClosed$', async () => {
    const fixture = TestBed.createComponent(TestDialogHostComponent);
    fixture.detectChanges();

    fixture.componentInstance.open();
    fixture.detectChanges();

    let result: string | undefined;
    fixture.componentInstance.lastRef?.afterClosed$.subscribe(r => result = r);

    fixture.componentInstance.lastRef?.close('test-result');

    expect(result).toBe('test-result');
  });

  it('should close dialog on Escape key', async () => {
    const fixture = TestBed.createComponent(TestDialogHostComponent);
    fixture.detectChanges();

    fixture.componentInstance.open();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.querySelector('glint-dialog-container')).toBeTruthy();

    // CDK OverlayKeyboardDispatcher listens on body for keydown
    // CDK Dialog checks event.keyCode === 27 (ESCAPE)
    document.body.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Escape',
      keyCode: 27,
      code: 'Escape',
      bubbles: true,
    }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.querySelector('glint-dialog-container')).toBeFalsy();
  });

  it('should have dialog role and aria-modal on container', async () => {
    const fixture = TestBed.createComponent(TestDialogHostComponent);
    fixture.detectChanges();

    fixture.componentInstance.open();
    fixture.detectChanges();
    await fixture.whenStable();

    const container = document.querySelector('glint-dialog-container') as HTMLElement;
    expect(container.getAttribute('role')).toBe('dialog');
    expect(container.getAttribute('aria-modal')).toBe('true');

    fixture.componentInstance.lastRef?.close();
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should provide GlintDialogRef to dialog content', async () => {
    const fixture = TestBed.createComponent(TestDialogHostComponent);
    fixture.detectChanges();

    fixture.componentInstance.open();
    fixture.detectChanges();
    await fixture.whenStable();

    // The dialog ref should be accessible in the content component
    const ref = fixture.componentInstance.lastRef;
    expect(ref).toBeTruthy();
    expect(ref?.componentInstance).toBeTruthy();

    // Close via the content component's ref
    ref?.close();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.querySelector('glint-dialog-container')).toBeFalsy();
  });
});
