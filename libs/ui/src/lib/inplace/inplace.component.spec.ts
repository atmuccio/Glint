import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import {
  GlintInplaceComponent,
  GlintInplaceDisplayDirective,
  GlintInplaceContentDirective,
} from './inplace.component';

@Component({
  selector: 'glint-test-inplace-host',
  standalone: true,
  imports: [
    GlintInplaceComponent,
    GlintInplaceDisplayDirective,
    GlintInplaceContentDirective,
  ],
  template: `
    <glint-inplace
      [(active)]="active"
      [disabled]="disabled"
      [closable]="closable"
      (activate)="activated = true"
      (deactivate)="deactivated = true"
    >
      <span glintInplaceDisplay>Click to edit</span>
      <input glintInplaceContent type="text" value="Hello" />
    </glint-inplace>
  `,
})
class TestInplaceHostComponent {
  active = signal(false);
  disabled = false;
  closable = false;
  activated = false;
  deactivated = false;
}

describe('GlintInplaceComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestInplaceHostComponent] });
  });

  it('should show display content by default', () => {
    const fixture = TestBed.createComponent(TestInplaceHostComponent);
    fixture.detectChanges();
    const display = fixture.nativeElement.querySelector('.display');
    expect(display).toBeTruthy();
    expect(display.textContent).toContain('Click to edit');
    expect(fixture.nativeElement.querySelector('.content')).toBeNull();
  });

  it('should switch to edit content on click', () => {
    const fixture = TestBed.createComponent(TestInplaceHostComponent);
    fixture.detectChanges();

    const display = fixture.nativeElement.querySelector('.display') as HTMLElement;
    display.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.display')).toBeNull();
    const content = fixture.nativeElement.querySelector('.content');
    expect(content).toBeTruthy();
    expect(content.querySelector('input')).toBeTruthy();
  });

  it('should emit activate event', () => {
    const fixture = TestBed.createComponent(TestInplaceHostComponent);
    fixture.detectChanges();

    const display = fixture.nativeElement.querySelector('.display') as HTMLElement;
    display.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.activated).toBe(true);
  });

  it('should show close button when closable', () => {
    const fixture = TestBed.createComponent(TestInplaceHostComponent);
    fixture.componentInstance.closable = true;
    fixture.componentInstance.active.set(true);
    fixture.detectChanges();

    const closeBtn = fixture.nativeElement.querySelector('.close-btn');
    expect(closeBtn).toBeTruthy();
  });

  it('should switch back on close button click', () => {
    const fixture = TestBed.createComponent(TestInplaceHostComponent);
    fixture.componentInstance.closable = true;
    fixture.componentInstance.active.set(true);
    fixture.detectChanges();

    const closeBtn = fixture.nativeElement.querySelector('.close-btn') as HTMLButtonElement;
    closeBtn.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.display')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.content')).toBeNull();
    expect(fixture.componentInstance.deactivated).toBe(true);
  });

  it('should not activate when disabled', () => {
    const fixture = TestBed.createComponent(TestInplaceHostComponent);
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    const display = fixture.nativeElement.querySelector('.display') as HTMLElement;
    display.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.display')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.content')).toBeNull();
    expect(fixture.componentInstance.activated).toBe(false);
  });
});
