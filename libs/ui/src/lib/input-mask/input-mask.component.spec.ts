import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GlintInputMaskComponent } from './input-mask.component';

@Component({
  selector: 'glint-test-mask-host',
  standalone: true,
  imports: [GlintInputMaskComponent, ReactiveFormsModule],
  template: `
    <glint-input-mask
      [mask]="mask"
      [slotChar]="slotChar"
      [autoClear]="autoClear"
      [formControl]="ctrl"
    />
  `,
})
class TestMaskHostComponent {
  ctrl = new FormControl('');
  mask = '99/99/9999';
  slotChar = '_';
  autoClear = true;
}

@Component({
  selector: 'glint-test-mask-disabled-host',
  standalone: true,
  imports: [GlintInputMaskComponent],
  template: `
    <glint-input-mask [mask]="'(999) 999-9999'" [disabled]="disabled" />
  `,
})
class TestMaskDisabledHostComponent {
  disabled = false;
}

describe('GlintInputMaskComponent', () => {
  it('should render with mask placeholder', async () => {
    TestBed.configureTestingModule({ imports: [TestMaskHostComponent] });
    const fixture = TestBed.createComponent(TestMaskHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.placeholder).toBe('__/__/____');
  });

  it('should accept valid input characters', async () => {
    TestBed.configureTestingModule({ imports: [TestMaskHostComponent] });
    const fixture = TestBed.createComponent(TestMaskHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    // Type '1' into the first slot
    input.setSelectionRange(0, 0);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: '1', bubbles: true }));
    fixture.detectChanges();

    expect(input.value.startsWith('1')).toBe(true);
  });

  it('should reject invalid characters for digit slots', async () => {
    TestBed.configureTestingModule({ imports: [TestMaskHostComponent] });
    const fixture = TestBed.createComponent(TestMaskHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    // Try typing 'a' into a digit slot (mask = 99/99/9999)
    input.setSelectionRange(0, 0);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
    fixture.detectChanges();

    // Value should still be the empty mask with slot chars
    expect(input.value).toBe('__/__/____');
  });

  it('should auto-insert literal separators', async () => {
    TestBed.configureTestingModule({ imports: [TestMaskHostComponent] });
    const fixture = TestBed.createComponent(TestMaskHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    // Type '1' then '2' — after 2nd digit, cursor should jump past '/'
    input.setSelectionRange(0, 0);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: '1', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    input.dispatchEvent(new KeyboardEvent('keydown', { key: '2', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    // Display should show 12/__/____ — the literals / are in place
    expect(input.value).toBe('12/__/____');
  });

  it('should clear incomplete value on blur when autoClear is true', async () => {
    TestBed.configureTestingModule({ imports: [TestMaskHostComponent] });
    const fixture = TestBed.createComponent(TestMaskHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    // Type partial value
    input.setSelectionRange(0, 0);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: '1', bubbles: true }));
    fixture.detectChanges();

    // Blur
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    await fixture.whenStable();

    // Value should be cleared because it's incomplete
    expect(fixture.componentInstance.ctrl.value).toBe('');
  });

  it('should work with FormControl (CVA)', async () => {
    TestBed.configureTestingModule({ imports: [TestMaskHostComponent] });
    const fixture = TestBed.createComponent(TestMaskHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    // Set value via FormControl
    fixture.componentInstance.ctrl.setValue('12/34/5678');
    fixture.detectChanges();
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('12/34/5678');
  });

  it('should not accept input when disabled', async () => {
    TestBed.configureTestingModule({ imports: [TestMaskDisabledHostComponent] });
    const fixture = TestBed.createComponent(TestMaskDisabledHostComponent);
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('glint-input-mask') as HTMLElement;
    expect(host.classList.contains('disabled')).toBe(true);
  });
});
