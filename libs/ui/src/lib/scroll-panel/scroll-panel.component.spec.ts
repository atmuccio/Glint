import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GlintScrollPanelComponent } from './scroll-panel.component';

@Component({
  selector: 'glint-test-scroll-panel-host',
  standalone: true,
  imports: [GlintScrollPanelComponent],
  template: `
    <glint-scroll-panel [contentStyles]="styles">
      <p class="test-content">Hello World</p>
    </glint-scroll-panel>
  `,
})
class TestScrollPanelHostComponent {
  styles = '';
}

describe('GlintScrollPanelComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestScrollPanelHostComponent] });
  });

  it('should render projected content', () => {
    const fixture = TestBed.createComponent(TestScrollPanelHostComponent);
    fixture.detectChanges();
    const content = fixture.nativeElement.querySelector('.test-content') as HTMLElement;
    expect(content).toBeTruthy();
    expect(content.textContent?.trim()).toBe('Hello World');
  });

  it('should apply custom styles to content div', () => {
    const fixture = TestBed.createComponent(TestScrollPanelHostComponent);
    fixture.componentInstance.styles = 'width: 300px; height: 200px';
    fixture.detectChanges();
    const contentDiv = fixture.nativeElement.querySelector('.scroll-panel-content') as HTMLElement;
    expect(contentDiv.style.width).toBe('300px');
    expect(contentDiv.style.height).toBe('200px');
  });

  it('should have overflow auto on content div', () => {
    const fixture = TestBed.createComponent(TestScrollPanelHostComponent);
    fixture.detectChanges();
    const contentDiv = fixture.nativeElement.querySelector('.scroll-panel-content') as HTMLElement;
    const computedStyle = getComputedStyle(contentDiv);
    expect(computedStyle.overflow).toBe('auto');
  });

  it('should set display block on host', () => {
    const fixture = TestBed.createComponent(TestScrollPanelHostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('glint-scroll-panel') as HTMLElement;
    expect(host.style.display).toBe('block');
  });
});
