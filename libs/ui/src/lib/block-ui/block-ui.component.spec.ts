import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { GlintBlockUiComponent } from './block-ui.component';

@Component({
  selector: 'glint-test-block-ui-host',
  standalone: true,
  imports: [GlintBlockUiComponent],
  template: `
    <glint-block-ui [blocked]="blocked()" [message]="message()">
      <p class="projected">Projected content</p>
    </glint-block-ui>
  `,
})
class TestBlockUiHostComponent {
  blocked = signal(false);
  message = signal('');
}

describe('GlintBlockUiComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestBlockUiHostComponent] });
  });

  it('should render projected content', () => {
    const fixture = TestBed.createComponent(TestBlockUiHostComponent);
    fixture.detectChanges();
    const projected = fixture.nativeElement.querySelector('.projected');
    expect(projected).toBeTruthy();
    expect(projected.textContent).toContain('Projected content');
  });

  it('should not show mask when blocked is false', () => {
    const fixture = TestBed.createComponent(TestBlockUiHostComponent);
    fixture.detectChanges();
    const mask = fixture.nativeElement.querySelector('.block-ui-mask');
    expect(mask).toBeNull();
  });

  it('should show mask when blocked is true', () => {
    const fixture = TestBed.createComponent(TestBlockUiHostComponent);
    fixture.componentInstance.blocked.set(true);
    fixture.detectChanges();
    const mask = fixture.nativeElement.querySelector('.block-ui-mask');
    expect(mask).toBeTruthy();
  });

  it('should display message on mask', () => {
    const fixture = TestBed.createComponent(TestBlockUiHostComponent);
    fixture.componentInstance.blocked.set(true);
    fixture.componentInstance.message.set('Loading...');
    fixture.detectChanges();
    const message = fixture.nativeElement.querySelector('.block-ui-message');
    expect(message).toBeTruthy();
    expect(message.textContent).toContain('Loading...');
  });

  it('should hide mask when blocked changes to false', () => {
    const fixture = TestBed.createComponent(TestBlockUiHostComponent);
    fixture.componentInstance.blocked.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.block-ui-mask')).toBeTruthy();

    fixture.componentInstance.blocked.set(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.block-ui-mask')).toBeNull();
  });

  it('should apply position relative to container', () => {
    const fixture = TestBed.createComponent(TestBlockUiHostComponent);
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('.block-ui-container') as HTMLElement;
    const styles = getComputedStyle(container);
    expect(styles.position).toBe('relative');
  });
});
