import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GlintRatingComponent } from './rating.component';

@Component({
  selector: 'glint-test-rating-host',
  standalone: true,
  imports: [GlintRatingComponent, ReactiveFormsModule],
  template: `
    <glint-rating
      [formControl]="ctrl"
      [stars]="stars"
      [disabled]="disabled"
      [readonly]="isReadonly"
      [cancel]="cancel"
    />
  `,
})
class TestRatingHostComponent {
  ctrl = new FormControl(0);
  stars = 5;
  disabled = false;
  isReadonly = false;
  cancel = true;
}

describe('GlintRatingComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestRatingHostComponent],
    });
  });

  it('should render 5 stars by default', () => {
    const fixture = TestBed.createComponent(TestRatingHostComponent);
    fixture.detectChanges();

    const stars = fixture.nativeElement.querySelectorAll('.star');
    expect(stars.length).toBe(5);
  });

  it('should render custom number of stars', () => {
    const fixture = TestBed.createComponent(TestRatingHostComponent);
    fixture.componentInstance.stars = 10;
    fixture.detectChanges();

    const stars = fixture.nativeElement.querySelectorAll('.star');
    expect(stars.length).toBe(10);
  });

  it('should set value on click', () => {
    const fixture = TestBed.createComponent(TestRatingHostComponent);
    fixture.detectChanges();

    const stars = fixture.nativeElement.querySelectorAll('.star');
    (stars[2] as HTMLElement).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.ctrl.value).toBe(3);
  });

  it('should not change value when disabled', () => {
    const fixture = TestBed.createComponent(TestRatingHostComponent);
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    const stars = fixture.nativeElement.querySelectorAll('.star');
    (stars[2] as HTMLElement).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.ctrl.value).toBe(0);
  });

  it('should not change value when readonly', () => {
    const fixture = TestBed.createComponent(TestRatingHostComponent);
    fixture.componentInstance.isReadonly = true;
    fixture.componentInstance.ctrl.setValue(3);
    fixture.detectChanges();

    const stars = fixture.nativeElement.querySelectorAll('.star');
    (stars[4] as HTMLElement).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.ctrl.value).toBe(3);
  });

  it('should work with FormControl (CVA)', () => {
    const fixture = TestBed.createComponent(TestRatingHostComponent);
    fixture.detectChanges();

    // Set value via FormControl
    fixture.componentInstance.ctrl.setValue(4);
    fixture.detectChanges();

    const filledStars = fixture.nativeElement.querySelectorAll('.star.filled');
    expect(filledStars.length).toBe(4);

    // Click a star to update FormControl
    const stars = fixture.nativeElement.querySelectorAll('.star');
    (stars[1] as HTMLElement).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.ctrl.value).toBe(2);
  });

  it('should show cancel icon when cancel is true', () => {
    const fixture = TestBed.createComponent(TestRatingHostComponent);
    fixture.detectChanges();

    const cancelBtn = fixture.nativeElement.querySelector('.cancel-icon');
    expect(cancelBtn).toBeTruthy();
  });

  it('should hide cancel icon when cancel is false', () => {
    const fixture = TestBed.createComponent(TestRatingHostComponent);
    fixture.componentInstance.cancel = false;
    fixture.detectChanges();

    const cancelBtn = fixture.nativeElement.querySelector('.cancel-icon');
    expect(cancelBtn).toBeFalsy();
  });

  it('should clear value when cancel icon is clicked', () => {
    const fixture = TestBed.createComponent(TestRatingHostComponent);
    fixture.componentInstance.ctrl.setValue(3);
    fixture.detectChanges();

    const cancelBtn = fixture.nativeElement.querySelector('.cancel-icon') as HTMLButtonElement;
    cancelBtn.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.ctrl.value).toBe(0);
  });

  it('should have correct ARIA attributes', () => {
    const fixture = TestBed.createComponent(TestRatingHostComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('glint-rating') as HTMLElement;
    expect(host.getAttribute('role')).toBe('radiogroup');
    expect(host.getAttribute('aria-label')).toBe('Rating');

    const stars = fixture.nativeElement.querySelectorAll('.star');
    expect(stars[0].getAttribute('role')).toBe('radio');
    expect(stars[0].getAttribute('aria-checked')).toBe('false');
  });

  it('should display filled stars based on value', () => {
    const fixture = TestBed.createComponent(TestRatingHostComponent);
    fixture.componentInstance.ctrl.setValue(3);
    fixture.detectChanges();

    const filledStars = fixture.nativeElement.querySelectorAll('.star.filled');
    const emptyStars = fixture.nativeElement.querySelectorAll('.star.empty');
    expect(filledStars.length).toBe(3);
    expect(emptyStars.length).toBe(2);
  });
});
