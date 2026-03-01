import { TestBed } from '@angular/core/testing';
import { Component, viewChild } from '@angular/core';
import { GlintImageComponent } from './image.component';

@Component({
  selector: 'glint-test-image-host',
  standalone: true,
  imports: [GlintImageComponent],
  template: `
    <glint-image
      #img
      src="https://example.com/photo.jpg"
      alt="Test photo"
      [width]="width"
      [height]="height"
      [preview]="preview"
      [imageClass]="imageClass"
    />
  `,
})
class TestImageHostComponent {
  img = viewChild.required<GlintImageComponent>('img');
  width: string | null = null;
  height: string | null = null;
  preview = false;
  imageClass = '';
}

describe('GlintImageComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestImageHostComponent] });
  });

  afterEach(() => {
    // Clean up any open overlays
    document.querySelectorAll('.cdk-overlay-container').forEach(el => {
      el.innerHTML = '';
    });
  });

  it('should render image with src and alt', () => {
    const fixture = TestBed.createComponent(TestImageHostComponent);
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(img).toBeTruthy();
    expect(img.src).toContain('example.com/photo.jpg');
    expect(img.alt).toBe('Test photo');
  });

  it('should apply width and height', () => {
    const fixture = TestBed.createComponent(TestImageHostComponent);
    fixture.componentInstance.width = '200px';
    fixture.componentInstance.height = '150px';
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(img.style.inlineSize).toBe('200px');
    expect(img.style.blockSize).toBe('150px');
  });

  it('should show cursor pointer when preview is true', () => {
    const fixture = TestBed.createComponent(TestImageHostComponent);
    fixture.componentInstance.preview = true;
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(img.classList.contains('previewable')).toBe(true);
  });

  it('should apply imageClass to the img element', () => {
    const fixture = TestBed.createComponent(TestImageHostComponent);
    fixture.componentInstance.imageClass = 'custom-class';
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(img.classList.contains('custom-class')).toBe(true);
  });

  it('should open fullscreen overlay on click when preview enabled', async () => {
    const fixture = TestBed.createComponent(TestImageHostComponent);
    fixture.componentInstance.preview = true;
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    img.click();
    fixture.detectChanges();
    await fixture.whenStable();
    const previewOverlay = document.querySelector('.glint-image-preview-overlay');
    expect(previewOverlay).toBeTruthy();
    const previewImg = document.querySelector('.glint-image-preview-img') as HTMLImageElement;
    expect(previewImg).toBeTruthy();
    expect(previewImg.src).toContain('example.com/photo.jpg');
    // Clean up
    fixture.componentInstance.img().closePreview();
    fixture.detectChanges();
  });

  it('should not open overlay when preview is false', async () => {
    const fixture = TestBed.createComponent(TestImageHostComponent);
    fixture.componentInstance.preview = false;
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    img.click();
    fixture.detectChanges();
    await fixture.whenStable();
    const previewOverlay = document.querySelector('.glint-image-preview-overlay');
    expect(previewOverlay).toBeNull();
  });

  it('should close overlay on close button click', async () => {
    const fixture = TestBed.createComponent(TestImageHostComponent);
    fixture.componentInstance.preview = true;
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    img.click();
    fixture.detectChanges();
    await fixture.whenStable();
    const closeBtn = document.querySelector('.glint-image-preview-close') as HTMLButtonElement;
    expect(closeBtn).toBeTruthy();
    closeBtn.click();
    fixture.detectChanges();
    await fixture.whenStable();
    const previewOverlay = document.querySelector('.glint-image-preview-overlay');
    expect(previewOverlay).toBeNull();
  });

  it('should close overlay on Escape key', async () => {
    const fixture = TestBed.createComponent(TestImageHostComponent);
    fixture.componentInstance.preview = true;
    fixture.detectChanges();
    fixture.componentInstance.img().openPreview();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(document.querySelector('.glint-image-preview-overlay')).toBeTruthy();
    // Dispatch Escape key on the document body (overlay captures keydown)
    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    document.body.dispatchEvent(event);
    fixture.detectChanges();
    await fixture.whenStable();
    const previewOverlay = document.querySelector('.glint-image-preview-overlay');
    expect(previewOverlay).toBeNull();
  });
});
