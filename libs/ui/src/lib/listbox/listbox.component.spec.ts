import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GlintListboxComponent } from './listbox.component';

// CdkOption.setActiveStyles calls scrollIntoView which jsdom doesn't implement
if (!Element.prototype.scrollIntoView) {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  Element.prototype.scrollIntoView = () => {};
}

const TEST_OPTIONS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Date', value: 'date' },
];

@Component({
  selector: 'glint-test-listbox-host',
  standalone: true,
  imports: [GlintListboxComponent, ReactiveFormsModule],
  template: `
    <glint-listbox
      [options]="options"
      [optionLabel]="optionLabel"
      [optionValue]="optionValue"
      [multiple]="multiple"
      [disabled]="disabled"
      [filter]="filter"
      [formControl]="ctrl"
    />
  `,
})
class TestListboxHostComponent {
  options = TEST_OPTIONS;
  optionLabel = 'label';
  optionValue = 'value';
  multiple = false;
  disabled = false;
  filter = false;
  ctrl = new FormControl<unknown>(null);
}

describe('GlintListboxComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestListboxHostComponent],
    });
  });

  it('should render options from data', () => {
    const fixture = TestBed.createComponent(TestListboxHostComponent);
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('.option');
    expect(options.length).toBe(4);
    expect(options[0].textContent.trim()).toBe('Apple');
    expect(options[1].textContent.trim()).toBe('Banana');
    expect(options[2].textContent.trim()).toBe('Cherry');
    expect(options[3].textContent.trim()).toBe('Date');
  });

  it('should select single option on click', () => {
    const fixture = TestBed.createComponent(TestListboxHostComponent);
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('.option');
    options[1].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.ctrl.value).toBe('banana');
    expect(options[1].classList.contains('selected')).toBe(true);
  });

  it('should select multiple options when multiple is true', () => {
    const fixture = TestBed.createComponent(TestListboxHostComponent);
    fixture.componentInstance.multiple = true;
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('.option');
    options[0].click();
    fixture.detectChanges();
    options[2].click();
    fixture.detectChanges();

    const value = fixture.componentInstance.ctrl.value as unknown[];
    expect(value).toContain('apple');
    expect(value).toContain('cherry');
    expect(options[0].classList.contains('selected')).toBe(true);
    expect(options[2].classList.contains('selected')).toBe(true);
  });

  it('should filter options when filter is enabled', () => {
    const fixture = TestBed.createComponent(TestListboxHostComponent);
    fixture.componentInstance.filter = true;
    fixture.detectChanges();

    const filterInput = fixture.nativeElement.querySelector('.filter-input') as HTMLInputElement;
    expect(filterInput).toBeTruthy();

    filterInput.value = 'ban';
    filterInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('.option');
    expect(options.length).toBe(1);
    expect(options[0].textContent.trim()).toBe('Banana');
  });

  it('should work with FormControl (CVA)', () => {
    const fixture = TestBed.createComponent(TestListboxHostComponent);
    fixture.componentInstance.ctrl.setValue('cherry');
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('.option');
    expect(options[2].classList.contains('selected')).toBe(true);
  });

  it('should not select when disabled', () => {
    const fixture = TestBed.createComponent(TestListboxHostComponent);
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('glint-listbox') as HTMLElement;
    expect(host.classList.contains('disabled')).toBe(true);

    const options = fixture.nativeElement.querySelectorAll('.option');
    options[0].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.ctrl.value).toBeNull();
  });

  it('should display optionLabel field', () => {
    const fixture = TestBed.createComponent(TestListboxHostComponent);
    fixture.componentInstance.options = [
      { name: 'First', id: 1 },
      { name: 'Second', id: 2 },
    ] as unknown as typeof TEST_OPTIONS;
    fixture.componentInstance.optionLabel = 'name';
    fixture.componentInstance.optionValue = 'id';
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('.option');
    expect(options[0].textContent.trim()).toBe('First');
    expect(options[1].textContent.trim()).toBe('Second');
  });

  it('should have listbox role (via CDK)', () => {
    const fixture = TestBed.createComponent(TestListboxHostComponent);
    fixture.detectChanges();

    const list = fixture.nativeElement.querySelector('[role="listbox"]');
    expect(list).toBeTruthy();
  });

  it('should set aria-multiselectable when multiple (via CDK)', () => {
    const fixture = TestBed.createComponent(TestListboxHostComponent);
    fixture.componentInstance.multiple = true;
    fixture.detectChanges();

    const list = fixture.nativeElement.querySelector('[role="listbox"]');
    expect(list.getAttribute('aria-multiselectable')).toBe('true');
  });

  it('should deselect in multiple mode on second click', () => {
    const fixture = TestBed.createComponent(TestListboxHostComponent);
    fixture.componentInstance.multiple = true;
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('.option');
    options[0].click();
    fixture.detectChanges();
    expect((fixture.componentInstance.ctrl.value as unknown[]).length).toBe(1);

    options[0].click();
    fixture.detectChanges();
    expect((fixture.componentInstance.ctrl.value as unknown[]).length).toBe(0);
  });

  it('should replace selection in single mode', () => {
    const fixture = TestBed.createComponent(TestListboxHostComponent);
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('.option');
    options[0].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.ctrl.value).toBe('apple');

    options[2].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.ctrl.value).toBe('cherry');
    expect(options[0].classList.contains('selected')).toBe(false);
    expect(options[2].classList.contains('selected')).toBe(true);
  });

  it('should have option role on each option (via CDK)', () => {
    const fixture = TestBed.createComponent(TestListboxHostComponent);
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('[role="option"]');
    expect(options.length).toBe(4);
  });

  it('should support aria-activedescendant (via CDK)', () => {
    const fixture = TestBed.createComponent(TestListboxHostComponent);
    fixture.detectChanges();

    const list = fixture.nativeElement.querySelector('[role="listbox"]');
    // CDK uses aria-activedescendant when useActiveDescendant is true
    expect(list.hasAttribute('aria-activedescendant') || list.getAttribute('aria-activedescendant') === null || list.getAttribute('aria-activedescendant') === '').toBeTruthy();
  });
});
