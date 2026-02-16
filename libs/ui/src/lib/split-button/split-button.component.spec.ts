import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GlintSplitButtonComponent } from './split-button.component';
import type { GlintMenuItem } from '../menu/menu-item.model';

@Component({
  selector: 'glint-test-split-button-host',
  standalone: true,
  imports: [GlintSplitButtonComponent],
  template: `
    <glint-split-button label="Save" [items]="items" (primaryClick)="onPrimary()" />
  `,
})
class TestSplitButtonHostComponent {
  clicked = false;
  items: GlintMenuItem[] = [
    { label: 'Save as Draft' },
    { label: 'Save & Close' },
  ];
  onPrimary(): void { this.clicked = true; }
}

describe('GlintSplitButtonComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestSplitButtonHostComponent] });
  });

  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach(el => {
      el.innerHTML = '';
    });
  });

  it('should render primary button with label', () => {
    const fixture = TestBed.createComponent(TestSplitButtonHostComponent);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('.primary') as HTMLButtonElement;
    expect(btn.textContent?.trim()).toBe('Save');
  });

  it('should emit primaryClick on primary button click', () => {
    const fixture = TestBed.createComponent(TestSplitButtonHostComponent);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('.primary') as HTMLButtonElement;
    btn.click();
    expect(fixture.componentInstance.clicked).toBe(true);
  });

  it('should render dropdown button', () => {
    const fixture = TestBed.createComponent(TestSplitButtonHostComponent);
    fixture.detectChanges();
    const dropdown = fixture.nativeElement.querySelector('.dropdown');
    expect(dropdown).toBeTruthy();
  });

  it('should open menu on dropdown click', async () => {
    const fixture = TestBed.createComponent(TestSplitButtonHostComponent);
    fixture.detectChanges();
    const dropdown = fixture.nativeElement.querySelector('.dropdown') as HTMLButtonElement;
    dropdown.click();
    fixture.detectChanges();
    await fixture.whenStable();
    const items = document.querySelectorAll('[role="menuitem"]');
    expect(items.length).toBe(2);
    // Clean up
    dropdown.click();
    fixture.detectChanges();
  });
});
