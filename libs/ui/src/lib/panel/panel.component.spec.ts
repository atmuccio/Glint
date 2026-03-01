import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { GlintPanelComponent } from './panel.component';

@Component({
  selector: 'glint-test-panel-host',
  standalone: true,
  imports: [GlintPanelComponent],
  template: `
    <glint-panel [header]="header" [toggleable]="toggleable" [(collapsed)]="collapsed">
      <button glintPanelIcons>⚙</button>
      <p>Panel body content</p>
      <div glintPanelFooter>Footer here</div>
    </glint-panel>
  `,
})
class TestPanelHostComponent {
  header = 'Test Panel';
  toggleable = false;
  collapsed = signal(false);
}

describe('GlintPanelComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestPanelHostComponent] });
  });

  it('should render header text', () => {
    const fixture = TestBed.createComponent(TestPanelHostComponent);
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelector('.panel-header');
    expect(header.textContent).toContain('Test Panel');
  });

  it('should show content by default', () => {
    const fixture = TestBed.createComponent(TestPanelHostComponent);
    fixture.detectChanges();
    const content = fixture.nativeElement.querySelector('.panel-content');
    expect(content).toBeTruthy();
    expect(content.textContent).toContain('Panel body content');
  });

  it('should collapse content when toggleable and collapsed', () => {
    const fixture = TestBed.createComponent(TestPanelHostComponent);
    fixture.componentInstance.toggleable = true;
    fixture.componentInstance.collapsed.set(true);
    fixture.detectChanges();
    const content = fixture.nativeElement.querySelector('.panel-content');
    expect(content).toBeNull();
  });

  it('should toggle on header click', () => {
    const fixture = TestBed.createComponent(TestPanelHostComponent);
    fixture.componentInstance.toggleable = true;
    fixture.detectChanges();

    const toggle = fixture.nativeElement.querySelector('.panel-toggle') as HTMLButtonElement;
    expect(fixture.nativeElement.querySelector('.panel-content')).toBeTruthy();

    toggle.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.panel-content')).toBeNull();

    toggle.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.panel-content')).toBeTruthy();
  });

  it('should have aria-expanded attribute', () => {
    const fixture = TestBed.createComponent(TestPanelHostComponent);
    fixture.componentInstance.toggleable = true;
    fixture.detectChanges();

    const toggle = fixture.nativeElement.querySelector('.panel-toggle') as HTMLButtonElement;
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    toggle.click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('should project footer content', () => {
    const fixture = TestBed.createComponent(TestPanelHostComponent);
    fixture.detectChanges();
    const footer = fixture.nativeElement.querySelector('.panel-footer');
    expect(footer).toBeTruthy();
    expect(footer.textContent).toContain('Footer here');
  });

  it('should project panel icons content', () => {
    const fixture = TestBed.createComponent(TestPanelHostComponent);
    fixture.detectChanges();
    const icons = fixture.nativeElement.querySelector('.panel-icons');
    expect(icons).toBeTruthy();
    expect(icons.textContent).toContain('⚙');
  });
});
