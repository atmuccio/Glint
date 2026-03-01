import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GlintGalleriaComponent, GlintGalleriaImage } from './galleria.component';

const TEST_IMAGES: GlintGalleriaImage[] = [
  { src: 'img1.jpg', alt: 'Image 1', thumbnailSrc: 'thumb1.jpg' },
  { src: 'img2.jpg', alt: 'Image 2', thumbnailSrc: 'thumb2.jpg' },
  { src: 'img3.jpg', alt: 'Image 3' },
];

@Component({
  selector: 'glint-test-galleria-host',
  standalone: true,
  imports: [GlintGalleriaComponent],
  template: `
    <glint-galleria
      [images]="images"
      [showThumbnails]="showThumbnails"
      [showIndicators]="showIndicators"
      [showNavigators]="showNavigators"
      [circular]="circular"
      [fullscreen]="fullscreen"
      [thumbnailsPosition]="thumbnailsPosition"
      (activeIndexChange)="onIndexChange($event)"
    />
  `,
})
class TestGalleriaHostComponent {
  images = TEST_IMAGES;
  showThumbnails = true;
  showIndicators = false;
  showNavigators = true;
  circular = false;
  fullscreen = false;
  thumbnailsPosition: 'bottom' | 'top' | 'left' | 'right' = 'bottom';
  lastIndex: number | null = null;
  onIndexChange(index: number): void {
    this.lastIndex = index;
  }
}

describe('GlintGalleriaComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestGalleriaHostComponent],
    });
  });

  afterEach(() => {
    // Clean up any overlays
    const overlays = document.querySelectorAll('.cdk-overlay-container');
    overlays.forEach(el => {
      el.innerHTML = '';
    });
  });

  it('should render the main image', () => {
    const fixture = TestBed.createComponent(TestGalleriaHostComponent);
    fixture.detectChanges();
    const mainImg = fixture.nativeElement.querySelector('.main-image') as HTMLImageElement;
    expect(mainImg).toBeTruthy();
    expect(mainImg.src).toContain('img1.jpg');
    expect(mainImg.alt).toBe('Image 1');
  });

  it('should render thumbnails', () => {
    const fixture = TestBed.createComponent(TestGalleriaHostComponent);
    fixture.detectChanges();
    const thumbnails = fixture.nativeElement.querySelectorAll('.thumbnail');
    expect(thumbnails.length).toBe(3);
    // First thumbnail uses thumbnailSrc
    const firstImg = thumbnails[0].querySelector('img') as HTMLImageElement;
    expect(firstImg.src).toContain('thumb1.jpg');
    // Third thumbnail falls back to src
    const thirdImg = thumbnails[2].querySelector('img') as HTMLImageElement;
    expect(thirdImg.src).toContain('img3.jpg');
  });

  it('should hide thumbnails when showThumbnails is false', () => {
    const fixture = TestBed.createComponent(TestGalleriaHostComponent);
    fixture.componentInstance.showThumbnails = false;
    fixture.detectChanges();
    const strip = fixture.nativeElement.querySelector('.thumbnail-strip');
    expect(strip).toBeFalsy();
  });

  it('should show navigator buttons', () => {
    const fixture = TestBed.createComponent(TestGalleriaHostComponent);
    fixture.detectChanges();
    const navBtns = fixture.nativeElement.querySelectorAll('.nav');
    expect(navBtns.length).toBe(2);
    expect(navBtns[0].getAttribute('aria-label')).toBe('Previous image');
    expect(navBtns[1].getAttribute('aria-label')).toBe('Next image');
  });

  it('should hide navigator buttons when showNavigators is false', () => {
    const fixture = TestBed.createComponent(TestGalleriaHostComponent);
    fixture.componentInstance.showNavigators = false;
    fixture.detectChanges();
    const navBtns = fixture.nativeElement.querySelectorAll('.nav');
    expect(navBtns.length).toBe(0);
  });

  it('should navigate to next image on next click', () => {
    const fixture = TestBed.createComponent(TestGalleriaHostComponent);
    fixture.detectChanges();
    const nextBtn = fixture.nativeElement.querySelector('.nav.next') as HTMLButtonElement;
    nextBtn.click();
    fixture.detectChanges();
    const mainImg = fixture.nativeElement.querySelector('.main-image') as HTMLImageElement;
    expect(mainImg.src).toContain('img2.jpg');
    expect(fixture.componentInstance.lastIndex).toBe(1);
  });

  it('should navigate to previous image on prev click', () => {
    const fixture = TestBed.createComponent(TestGalleriaHostComponent);
    fixture.detectChanges();
    // Go to image 2 first
    const nextBtn = fixture.nativeElement.querySelector('.nav.next') as HTMLButtonElement;
    nextBtn.click();
    fixture.detectChanges();
    // Now go back
    const prevBtn = fixture.nativeElement.querySelector('.nav.prev') as HTMLButtonElement;
    prevBtn.click();
    fixture.detectChanges();
    const mainImg = fixture.nativeElement.querySelector('.main-image') as HTMLImageElement;
    expect(mainImg.src).toContain('img1.jpg');
    expect(fixture.componentInstance.lastIndex).toBe(0);
  });

  it('should navigate via thumbnail click', () => {
    const fixture = TestBed.createComponent(TestGalleriaHostComponent);
    fixture.detectChanges();
    const thumbnails = fixture.nativeElement.querySelectorAll('.thumbnail') as NodeListOf<HTMLButtonElement>;
    thumbnails[2].click();
    fixture.detectChanges();
    const mainImg = fixture.nativeElement.querySelector('.main-image') as HTMLImageElement;
    expect(mainImg.src).toContain('img3.jpg');
    expect(fixture.componentInstance.lastIndex).toBe(2);
  });

  it('should mark active thumbnail with active class', () => {
    const fixture = TestBed.createComponent(TestGalleriaHostComponent);
    fixture.detectChanges();
    let thumbnails = fixture.nativeElement.querySelectorAll('.thumbnail');
    expect(thumbnails[0].classList.contains('active')).toBe(true);
    expect(thumbnails[1].classList.contains('active')).toBe(false);
    // Navigate to second image
    thumbnails[1].click();
    fixture.detectChanges();
    thumbnails = fixture.nativeElement.querySelectorAll('.thumbnail');
    expect(thumbnails[0].classList.contains('active')).toBe(false);
    expect(thumbnails[1].classList.contains('active')).toBe(true);
  });

  it('should show fullscreen button when fullscreen input is true', () => {
    const fixture = TestBed.createComponent(TestGalleriaHostComponent);
    fixture.componentInstance.fullscreen = true;
    fixture.detectChanges();
    const fsBtn = fixture.nativeElement.querySelector('.fullscreen-btn');
    expect(fsBtn).toBeTruthy();
    expect(fsBtn.getAttribute('aria-label')).toBe('Fullscreen');
  });

  it('should not show fullscreen button when fullscreen is false', () => {
    const fixture = TestBed.createComponent(TestGalleriaHostComponent);
    fixture.detectChanges();
    const fsBtn = fixture.nativeElement.querySelector('.fullscreen-btn');
    expect(fsBtn).toBeFalsy();
  });

  it('should show indicators when showIndicators is true', () => {
    const fixture = TestBed.createComponent(TestGalleriaHostComponent);
    fixture.componentInstance.showIndicators = true;
    fixture.detectChanges();
    const indicators = fixture.nativeElement.querySelectorAll('.indicator');
    expect(indicators.length).toBe(3);
  });

  it('should not wrap around when circular is false and at the end', () => {
    const fixture = TestBed.createComponent(TestGalleriaHostComponent);
    fixture.detectChanges();
    const nextBtn = fixture.nativeElement.querySelector('.nav.next') as HTMLButtonElement;
    // Navigate to last
    nextBtn.click();
    fixture.detectChanges();
    nextBtn.click();
    fixture.detectChanges();
    // Try to go past end
    nextBtn.click();
    fixture.detectChanges();
    const mainImg = fixture.nativeElement.querySelector('.main-image') as HTMLImageElement;
    expect(mainImg.src).toContain('img3.jpg');
  });

  it('should wrap around when circular is true', () => {
    const fixture = TestBed.createComponent(TestGalleriaHostComponent);
    fixture.componentInstance.circular = true;
    fixture.detectChanges();
    const nextBtn = fixture.nativeElement.querySelector('.nav.next') as HTMLButtonElement;
    // Navigate past the last image
    nextBtn.click(); // -> 1
    fixture.detectChanges();
    nextBtn.click(); // -> 2
    fixture.detectChanges();
    nextBtn.click(); // -> 0 (circular)
    fixture.detectChanges();
    const mainImg = fixture.nativeElement.querySelector('.main-image') as HTMLImageElement;
    expect(mainImg.src).toContain('img1.jpg');
    expect(fixture.componentInstance.lastIndex).toBe(0);
  });

  it('should open fullscreen overlay', async () => {
    const fixture = TestBed.createComponent(TestGalleriaHostComponent);
    fixture.componentInstance.fullscreen = true;
    fixture.detectChanges();
    const fsBtn = fixture.nativeElement.querySelector('.fullscreen-btn') as HTMLButtonElement;
    fsBtn.click();
    fixture.detectChanges();
    await fixture.whenStable();
    const fsOverlay = document.querySelector('.galleria-fullscreen');
    expect(fsOverlay).toBeTruthy();
  });
});
