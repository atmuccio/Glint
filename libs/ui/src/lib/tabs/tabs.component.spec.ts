import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { GlintTabsComponent } from './tabs.component';
import { GlintTabPanelComponent } from './tab-panel.component';

@Component({
  selector: 'glint-test-tabs-host',
  standalone: true,
  imports: [GlintTabsComponent, GlintTabPanelComponent],
  template: `
    <glint-tabs [(activeIndex)]="active">
      <glint-tab-panel label="Tab A">Content A</glint-tab-panel>
      <glint-tab-panel label="Tab B">Content B</glint-tab-panel>
      <glint-tab-panel label="Tab C" [disabled]="true">Content C</glint-tab-panel>
    </glint-tabs>
  `,
})
class TestTabsHostComponent {
  active = signal(0);
}

describe('GlintTabsComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestTabsHostComponent] });
  });

  it('should render tab buttons', () => {
    const fixture = TestBed.createComponent(TestTabsHostComponent);
    fixture.detectChanges();
    const tabs = fixture.nativeElement.querySelectorAll('[role="tab"]');
    expect(tabs.length).toBe(3);
    expect(tabs[0].textContent?.trim()).toBe('Tab A');
  });

  it('should show first panel by default', () => {
    const fixture = TestBed.createComponent(TestTabsHostComponent);
    fixture.detectChanges();
    const panel = fixture.nativeElement.querySelector('[role="tabpanel"]');
    expect(panel.textContent?.trim()).toBe('Content A');
  });

  it('should switch panels on tab click', () => {
    const fixture = TestBed.createComponent(TestTabsHostComponent);
    fixture.detectChanges();
    const tabs = fixture.nativeElement.querySelectorAll('[role="tab"]');
    tabs[1].click();
    fixture.detectChanges();
    const panel = fixture.nativeElement.querySelector('[role="tabpanel"]');
    expect(panel.textContent?.trim()).toBe('Content B');
  });

  it('should not activate disabled tab on click', () => {
    const fixture = TestBed.createComponent(TestTabsHostComponent);
    fixture.detectChanges();
    const tabs = fixture.nativeElement.querySelectorAll('[role="tab"]');
    tabs[2].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.active()).toBe(0);
  });

  it('should have correct ARIA attributes', () => {
    const fixture = TestBed.createComponent(TestTabsHostComponent);
    fixture.detectChanges();
    const tabs = fixture.nativeElement.querySelectorAll('[role="tab"]');
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].getAttribute('aria-selected')).toBe('false');
    expect(tabs[2].getAttribute('aria-disabled')).toBe('true');
  });

  it('should navigate with ArrowRight key', () => {
    const fixture = TestBed.createComponent(TestTabsHostComponent);
    fixture.detectChanges();
    const tabList = fixture.nativeElement.querySelector('[role="tablist"]');
    tabList.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.active()).toBe(1);
  });

  it('should skip disabled tab when navigating', () => {
    const fixture = TestBed.createComponent(TestTabsHostComponent);
    fixture.componentInstance.active.set(1);
    fixture.detectChanges();
    const tabList = fixture.nativeElement.querySelector('[role="tablist"]');
    tabList.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    // Tab C is disabled, so should stay on 1
    expect(fixture.componentInstance.active()).toBe(1);
  });
});
