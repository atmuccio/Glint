import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GlintTextareaComponent } from './textarea.component';
import { GlintStyleZoneComponent } from '../core/style-zone/style-zone.component';

@Component({
  selector: 'glint-test-textarea-host',
  standalone: true,
  imports: [GlintTextareaComponent, GlintStyleZoneComponent, ReactiveFormsModule],
  template: `
    <glint-style-zone>
      <glint-textarea
        [label]="label"
        [placeholder]="placeholder"
        [variant]="variant"
        [invalid]="invalid"
        [errorMessage]="errorMessage"
        [rows]="rows"
        [formControl]="ctrl"
      />
    </glint-style-zone>
  `,
})
class TestTextareaHostComponent {
  ctrl = new FormControl('');
  label = 'Comments';
  placeholder = 'Enter text...';
  variant: 'outline' | 'filled' = 'outline';
  invalid = false;
  errorMessage = '';
  rows = 3;
}

describe('GlintTextareaComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestTextareaHostComponent],
    });
  });

  it('should render with label', async () => {
    const fixture = TestBed.createComponent(TestTextareaHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const label = fixture.nativeElement.querySelector('.label') as HTMLElement;
    expect(label.textContent).toContain('Comments');
  });

  it('should render textarea with placeholder', async () => {
    const fixture = TestBed.createComponent(TestTextareaHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.placeholder).toBe('Enter text...');
  });

  it('should sync with FormControl', async () => {
    const fixture = TestBed.createComponent(TestTextareaHostComponent);
    fixture.componentInstance.ctrl.setValue('Hello world');
    fixture.detectChanges();
    await fixture.whenStable();

    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.value).toBe('Hello world');
  });

  it('should emit value changes', async () => {
    const fixture = TestBed.createComponent(TestTextareaHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    textarea.value = 'New text';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.ctrl.value).toBe('New text');
  });

  it('should show error message when invalid', async () => {
    const fixture = TestBed.createComponent(TestTextareaHostComponent);
    fixture.componentInstance.invalid = true;
    fixture.componentInstance.errorMessage = 'Required field';
    fixture.detectChanges();
    await fixture.whenStable();

    const error = fixture.nativeElement.querySelector('.error') as HTMLElement;
    expect(error).toBeTruthy();
    expect(error.textContent).toContain('Required field');
    expect(error.getAttribute('role')).toBe('alert');
  });

  it('should respect rows input', async () => {
    const fixture = TestBed.createComponent(TestTextareaHostComponent);
    fixture.componentInstance.rows = 5;
    fixture.detectChanges();
    await fixture.whenStable();

    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.rows).toBe(5);
  });

  it('should use outline variant by default', async () => {
    const fixture = TestBed.createComponent(TestTextareaHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('glint-textarea') as HTMLElement;
    expect(host.getAttribute('data-variant')).toBe('outline');
  });
});
