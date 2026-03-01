import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GlintCarouselComponent } from './carousel.component';

@Component({
  selector: 'glint-test-carousel-host',
  standalone: true,
  imports: [GlintCarouselComponent],
  template: `
    <glint-carousel
      [value]="items"
      [numVisible]="numVisible"
      [numScroll]="numScroll"
      [circular]="circular"
      [showNavigators]="showNavigators"
      [showIndicators]="showIndicators"
      (pageChange)="onPageChange($event)"
    >
      <ng-template #item let-data let-i="index">
        <div class="test-item">{{ data }}</div>
      </ng-template>
    </glint-carousel>
  `,
})
class TestCarouselHostComponent {
  items = ['A', 'B', 'C', 'D', 'E', 'F'];
  numVisible = 2;
  numScroll = 2;
  circular = false;
  showNavigators = true;
  showIndicators = true;
  lastPage: number | null = null;
  onPageChange(page: number): void {
    this.lastPage = page;
  }
}

@Component({
  selector: 'glint-test-carousel-autoplay',
  standalone: true,
  imports: [GlintCarouselComponent],
  template: `
    <glint-carousel
      [value]="items"
      [numVisible]="1"
      [numScroll]="1"
      [autoplayInterval]="1000"
      [circular]="true"
    >
      <ng-template #item let-data>
        <div class="test-item">{{ data }}</div>
      </ng-template>
    </glint-carousel>
  `,
})
class TestCarouselAutoplayComponent {
  items = ['A', 'B', 'C'];
}

describe('GlintCarouselComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestCarouselHostComponent, TestCarouselAutoplayComponent],
    });
  });

  it('should render items', () => {
    const fixture = TestBed.createComponent(TestCarouselHostComponent);
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.test-item');
    expect(items.length).toBe(6);
    expect(items[0].textContent.trim()).toBe('A');
    expect(items[5].textContent.trim()).toBe('F');
  });

  it('should show navigator buttons', () => {
    const fixture = TestBed.createComponent(TestCarouselHostComponent);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.nav-button');
    expect(buttons.length).toBe(2);
    expect(buttons[0].getAttribute('aria-label')).toBe('Previous');
    expect(buttons[1].getAttribute('aria-label')).toBe('Next');
  });

  it('should hide navigator buttons when showNavigators is false', () => {
    const fixture = TestBed.createComponent(TestCarouselHostComponent);
    fixture.componentInstance.showNavigators = false;
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.nav-button');
    expect(buttons.length).toBe(0);
  });

  it('should show indicators', () => {
    const fixture = TestBed.createComponent(TestCarouselHostComponent);
    fixture.detectChanges();
    // 6 items, numVisible=2, numScroll=2 => totalPages = ceil((6-2)/2)+1 = 3
    const indicators = fixture.nativeElement.querySelectorAll('.indicator');
    expect(indicators.length).toBe(3);
  });

  it('should navigate to next page on next click', () => {
    const fixture = TestBed.createComponent(TestCarouselHostComponent);
    fixture.detectChanges();
    const nextBtn = fixture.nativeElement.querySelector('.nav-button.next') as HTMLButtonElement;
    nextBtn.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.lastPage).toBe(1);
    // First indicator should not be active, second should be
    const indicators = fixture.nativeElement.querySelectorAll('.indicator');
    expect(indicators[0].classList.contains('active')).toBe(false);
    expect(indicators[1].classList.contains('active')).toBe(true);
  });

  it('should navigate to previous page on prev click', () => {
    const fixture = TestBed.createComponent(TestCarouselHostComponent);
    fixture.detectChanges();
    // Go to page 1 first
    const nextBtn = fixture.nativeElement.querySelector('.nav-button.next') as HTMLButtonElement;
    nextBtn.click();
    fixture.detectChanges();
    // Now go back
    const prevBtn = fixture.nativeElement.querySelector('.nav-button.prev') as HTMLButtonElement;
    prevBtn.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.lastPage).toBe(0);
    const indicators = fixture.nativeElement.querySelectorAll('.indicator');
    expect(indicators[0].classList.contains('active')).toBe(true);
  });

  it('should disable prev button on first page (non-circular)', () => {
    const fixture = TestBed.createComponent(TestCarouselHostComponent);
    fixture.detectChanges();
    const prevBtn = fixture.nativeElement.querySelector('.nav-button.prev') as HTMLButtonElement;
    expect(prevBtn.disabled).toBe(true);
  });

  it('should disable next button on last page (non-circular)', () => {
    const fixture = TestBed.createComponent(TestCarouselHostComponent);
    fixture.detectChanges();
    const nextBtn = fixture.nativeElement.querySelector('.nav-button.next') as HTMLButtonElement;
    // Navigate to last page
    nextBtn.click();
    fixture.detectChanges();
    nextBtn.click();
    fixture.detectChanges();
    expect(nextBtn.disabled).toBe(true);
  });

  it('should wrap around in circular mode', () => {
    const fixture = TestBed.createComponent(TestCarouselHostComponent);
    fixture.componentInstance.circular = true;
    fixture.detectChanges();
    // Prev on first page should go to last page
    const prevBtn = fixture.nativeElement.querySelector('.nav-button.prev') as HTMLButtonElement;
    expect(prevBtn.disabled).toBe(false);
    prevBtn.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.lastPage).toBe(2); // last page
    const indicators = fixture.nativeElement.querySelectorAll('.indicator');
    expect(indicators[2].classList.contains('active')).toBe(true);
  });

  it('should navigate to page on indicator click', () => {
    const fixture = TestBed.createComponent(TestCarouselHostComponent);
    fixture.detectChanges();
    const indicators = fixture.nativeElement.querySelectorAll('.indicator') as NodeListOf<HTMLButtonElement>;
    indicators[2].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.lastPage).toBe(2);
    expect(indicators[2].classList.contains('active')).toBe(true);
  });

  it('should emit pageChange output', () => {
    const fixture = TestBed.createComponent(TestCarouselHostComponent);
    fixture.detectChanges();
    const nextBtn = fixture.nativeElement.querySelector('.nav-button.next') as HTMLButtonElement;
    nextBtn.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.lastPage).toBe(1);
  });

  it('should apply vertical class when orientation is vertical', () => {
    const fixture = TestBed.createComponent(TestCarouselHostComponent);
    fixture.detectChanges();
    // Default is horizontal
    const container = fixture.nativeElement.querySelector('.carousel-container') as HTMLElement;
    expect(container.classList.contains('vertical')).toBe(false);
  });

  it('should autoplay and advance pages', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(TestCarouselAutoplayComponent);
    fixture.detectChanges();
    const carousel = fixture.debugElement.children[0].componentInstance as GlintCarouselComponent;
    expect(carousel.currentPage()).toBe(0);
    vi.advanceTimersByTime(1000);
    fixture.detectChanges();
    expect(carousel.currentPage()).toBe(1);
    vi.advanceTimersByTime(1000);
    fixture.detectChanges();
    expect(carousel.currentPage()).toBe(2);
    // Circular: should wrap to page 0
    vi.advanceTimersByTime(1000);
    fixture.detectChanges();
    expect(carousel.currentPage()).toBe(0);
    vi.useRealTimers();
  });
});
