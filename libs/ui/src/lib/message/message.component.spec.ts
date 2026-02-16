import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GlintMessageComponent } from './message.component';

@Component({
  selector: 'glint-test-message-host',
  standalone: true,
  imports: [GlintMessageComponent],
  template: `
    <glint-message [severity]="severity" [closable]="closable">{{ text }}</glint-message>
  `,
})
class TestMessageHostComponent {
  severity: 'success' | 'info' | 'warning' | 'danger' = 'info';
  closable = false;
  text = 'Test message';
}

describe('GlintMessageComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestMessageHostComponent] });
  });

  it('should render message text', () => {
    const fixture = TestBed.createComponent(TestMessageHostComponent);
    fixture.detectChanges();
    const msg = fixture.nativeElement.querySelector('glint-message') as HTMLElement;
    expect(msg.textContent).toContain('Test message');
  });

  it('should set severity attribute', () => {
    const fixture = TestBed.createComponent(TestMessageHostComponent);
    fixture.componentInstance.severity = 'danger';
    fixture.detectChanges();
    const msg = fixture.nativeElement.querySelector('glint-message') as HTMLElement;
    expect(msg.getAttribute('data-severity')).toBe('danger');
  });

  it('should have alert role', () => {
    const fixture = TestBed.createComponent(TestMessageHostComponent);
    fixture.detectChanges();
    const msg = fixture.nativeElement.querySelector('glint-message') as HTMLElement;
    expect(msg.getAttribute('role')).toBe('alert');
  });

  it('should show close button when closable', () => {
    const fixture = TestBed.createComponent(TestMessageHostComponent);
    fixture.componentInstance.closable = true;
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('.close');
    expect(btn).toBeTruthy();
  });

  it('should hide on close button click', () => {
    const fixture = TestBed.createComponent(TestMessageHostComponent);
    fixture.componentInstance.closable = true;
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('.close') as HTMLButtonElement;
    btn.click();
    fixture.detectChanges();
    const msg = fixture.nativeElement.querySelector('glint-message') as HTMLElement;
    expect(msg.classList.contains('closed')).toBe(true);
  });
});
