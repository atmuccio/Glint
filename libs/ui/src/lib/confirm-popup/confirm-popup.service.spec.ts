import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { OverlayModule } from '@angular/cdk/overlay';
import { GlintConfirmPopupService } from './confirm-popup.service';

describe('GlintConfirmPopupService', () => {
  let service: GlintConfirmPopupService;
  let appRef: ApplicationRef;
  let targetEl: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OverlayModule],
    });
    service = TestBed.inject(GlintConfirmPopupService);
    appRef = TestBed.inject(ApplicationRef);
    targetEl = document.createElement('button');
    targetEl.textContent = 'Trigger';
    document.body.appendChild(targetEl);
  });

  afterEach(() => {
    targetEl.remove();
    document.querySelectorAll('.cdk-overlay-container').forEach(el => {
      el.innerHTML = '';
    });
  });

  it('should open popup anchored to target element', async () => {
    service.confirm({ target: targetEl, message: 'Are you sure?' });
    await appRef.whenStable();

    const popup = document.querySelector('glint-confirm-popup');
    expect(popup).toBeTruthy();
  });

  it('should display message text', async () => {
    service.confirm({ target: targetEl, message: 'Delete this item?' });
    await appRef.whenStable();

    const message = document.querySelector('.popup-message');
    expect(message).toBeTruthy();
    expect(message?.textContent).toContain('Delete this item?');
  });

  it('should display header when provided', async () => {
    service.confirm({ target: targetEl, message: 'Are you sure?', header: 'Confirm Delete' });
    await appRef.whenStable();

    const header = document.querySelector('.popup-header');
    expect(header).toBeTruthy();
    expect(header?.textContent).toContain('Confirm Delete');
  });

  it('should call accept callback on accept button click', async () => {
    let accepted = false;
    service.confirm({
      target: targetEl,
      message: 'Confirm?',
      accept: () => { accepted = true; },
    });
    await appRef.whenStable();

    const acceptBtn = document.querySelector('.btn-accept') as HTMLButtonElement;
    expect(acceptBtn).toBeTruthy();
    acceptBtn.click();
    expect(accepted).toBe(true);
  });

  it('should call reject callback on reject button click', async () => {
    let rejected = false;
    service.confirm({
      target: targetEl,
      message: 'Confirm?',
      reject: () => { rejected = true; },
    });
    await appRef.whenStable();

    const rejectBtn = document.querySelector('.btn-reject') as HTMLButtonElement;
    expect(rejectBtn).toBeTruthy();
    rejectBtn.click();
    expect(rejected).toBe(true);
  });

  it('should close popup after accept', async () => {
    service.confirm({ target: targetEl, message: 'Confirm?' });
    await appRef.whenStable();

    const acceptBtn = document.querySelector('.btn-accept') as HTMLButtonElement;
    acceptBtn.click();
    await appRef.whenStable();

    const popup = document.querySelector('glint-confirm-popup');
    expect(popup).toBeNull();
  });

  it('should close popup after reject', async () => {
    service.confirm({ target: targetEl, message: 'Confirm?' });
    await appRef.whenStable();

    const rejectBtn = document.querySelector('.btn-reject') as HTMLButtonElement;
    rejectBtn.click();
    await appRef.whenStable();

    const popup = document.querySelector('glint-confirm-popup');
    expect(popup).toBeNull();
  });

  it('should use custom button labels', async () => {
    service.confirm({
      target: targetEl,
      message: 'Proceed?',
      acceptLabel: 'OK',
      rejectLabel: 'Cancel',
    });
    await appRef.whenStable();

    const acceptBtn = document.querySelector('.btn-accept') as HTMLButtonElement;
    const rejectBtn = document.querySelector('.btn-reject') as HTMLButtonElement;
    expect(acceptBtn.textContent?.trim()).toBe('OK');
    expect(rejectBtn.textContent?.trim()).toBe('Cancel');
  });
});
