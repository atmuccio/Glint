import { Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { GlintConfirmDialogService } from './confirm-dialog.service';
import { cleanupOverlays } from '../testing/test-utils';

/**
 * Host component needed so that `injectGlintDialog()` is called inside an
 * injection context (the GlintConfirmDialogService constructor runs inject()).
 */
@Component({
  selector: 'glint-test-confirm-host',
  standalone: true,
  template: ``,
})
class TestConfirmHostComponent {
  confirmService = inject(GlintConfirmDialogService);
}

describe('GlintConfirmDialogService', () => {
  let service: GlintConfirmDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestConfirmHostComponent],
    });
    const fixture = TestBed.createComponent(TestConfirmHostComponent);
    fixture.detectChanges();
    service = fixture.componentInstance.confirmService;
  });

  afterEach(() => {
    // Clean up open dialogs
    const containers = document.querySelectorAll('glint-dialog-container');
    containers.forEach(el => el.remove());
    cleanupOverlays();
  });

  it('should open a confirm dialog', async () => {
    const promise = service.confirm({ message: 'Are you sure?' });

    await delay(0);

    const dialog = document.querySelector('glint-confirm-dialog');
    expect(dialog).toBeTruthy();

    // Close via accept button to resolve the promise
    const acceptBtn = document.querySelector('.btn-accept') as HTMLButtonElement;
    acceptBtn?.click();
    const result = await promise;
    expect(result).toBe(true);
  });

  it('should display message', async () => {
    const promise = service.confirm({ message: 'Delete this item?' });
    await delay(0);

    const message = document.querySelector('.message');
    expect(message?.textContent?.trim()).toBe('Delete this item?');

    // Cleanup
    const acceptBtn = document.querySelector('.btn-accept') as HTMLButtonElement;
    acceptBtn?.click();
    await promise;
  });

  it('should display header', async () => {
    const promise = service.confirm({ message: 'Sure?', header: 'Delete Confirmation' });
    await delay(0);

    const header = document.querySelector('.glint-dialog-title');
    expect(header?.textContent?.trim()).toBe('Delete Confirmation');

    const acceptBtn = document.querySelector('.btn-accept') as HTMLButtonElement;
    acceptBtn?.click();
    await promise;
  });

  it('should resolve true on accept', async () => {
    const promise = service.confirm({ message: 'Accept test' });
    await delay(0);

    const acceptBtn = document.querySelector('.btn-accept') as HTMLButtonElement;
    expect(acceptBtn).toBeTruthy();
    acceptBtn.click();

    const result = await promise;
    expect(result).toBe(true);
  });

  it('should resolve false on reject', async () => {
    const promise = service.confirm({ message: 'Reject test' });
    await delay(0);

    const rejectBtn = document.querySelector('.btn-reject') as HTMLButtonElement;
    expect(rejectBtn).toBeTruthy();
    rejectBtn.click();

    const result = await promise;
    expect(result).toBe(false);
  });

  it('should close dialog after accept', async () => {
    const promise = service.confirm({ message: 'Close on accept' });
    await delay(0);

    expect(document.querySelector('glint-confirm-dialog')).toBeTruthy();

    const acceptBtn = document.querySelector('.btn-accept') as HTMLButtonElement;
    acceptBtn.click();
    await promise;
    await delay(0);

    expect(document.querySelector('glint-confirm-dialog')).toBeFalsy();
  });

  it('should close dialog after reject', async () => {
    const promise = service.confirm({ message: 'Close on reject' });
    await delay(0);

    expect(document.querySelector('glint-confirm-dialog')).toBeTruthy();

    const rejectBtn = document.querySelector('.btn-reject') as HTMLButtonElement;
    rejectBtn.click();
    await promise;
    await delay(0);

    expect(document.querySelector('glint-confirm-dialog')).toBeFalsy();
  });

  it('should support custom button labels', async () => {
    const promise = service.confirm({
      message: 'Custom labels',
      acceptLabel: 'Yes, delete',
      rejectLabel: 'No, keep',
    });
    await delay(0);

    const acceptBtn = document.querySelector('.btn-accept') as HTMLButtonElement;
    const rejectBtn = document.querySelector('.btn-reject') as HTMLButtonElement;
    expect(acceptBtn.textContent?.trim()).toBe('Yes, delete');
    expect(rejectBtn.textContent?.trim()).toBe('No, keep');

    acceptBtn.click();
    await promise;
  });

  it('should display severity icon when provided', async () => {
    const promise = service.confirm({
      message: 'Danger test',
      severity: 'danger',
    });
    await delay(0);

    const icon = document.querySelector('.icon.danger');
    expect(icon).toBeTruthy();

    const acceptBtn = document.querySelector('.btn-accept') as HTMLButtonElement;
    acceptBtn.click();
    await promise;
  });

  it('should use default button labels when not specified', async () => {
    const promise = service.confirm({ message: 'Default labels test' });
    await delay(0);

    const acceptBtn = document.querySelector('.btn-accept') as HTMLButtonElement;
    const rejectBtn = document.querySelector('.btn-reject') as HTMLButtonElement;
    expect(acceptBtn.textContent?.trim()).toBe('Confirm');
    expect(rejectBtn.textContent?.trim()).toBe('Cancel');

    acceptBtn.click();
    await promise;
  });

  it('should use default header "Confirm" when not specified', async () => {
    const promise = service.confirm({ message: 'Default header test' });
    await delay(0);

    const header = document.querySelector('.glint-dialog-title');
    expect(header?.textContent?.trim()).toBe('Confirm');

    const acceptBtn = document.querySelector('.btn-accept') as HTMLButtonElement;
    acceptBtn.click();
    await promise;
  });

  it('should not show severity icon when severity is not provided', async () => {
    const promise = service.confirm({ message: 'No severity' });
    await delay(0);

    const icon = document.querySelector('.icon');
    expect(icon).toBeFalsy();

    const acceptBtn = document.querySelector('.btn-accept') as HTMLButtonElement;
    acceptBtn.click();
    await promise;
  });

  it('should display warning severity icon', async () => {
    const promise = service.confirm({
      message: 'Warning test',
      severity: 'warning',
    });
    await delay(0);

    const icon = document.querySelector('.icon.warning');
    expect(icon).toBeTruthy();

    const acceptBtn = document.querySelector('.btn-accept') as HTMLButtonElement;
    acceptBtn.click();
    await promise;
  });
});

/** Small delay helper for letting CDK overlay render */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
