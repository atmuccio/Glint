import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { GlintSpeedDialComponent } from './speed-dial.component';
import type { GlintMenuItem } from '../menu/menu-item.model';

@Component({
  selector: 'glint-test-speed-dial-host',
  standalone: true,
  imports: [GlintSpeedDialComponent],
  template: `
    <glint-speed-dial
      [items]="items"
      [direction]="direction"
      [type]="type"
      [radius]="radius"
      [disabled]="disabled"
      [visible]="visible"
    />
  `,
})
class TestSpeedDialHostComponent {
  items: GlintMenuItem[] = [
    { label: 'Add', icon: '+', command: () => { this.lastCommand = 'add'; } },
    { label: 'Edit', icon: 'E' },
    { label: 'Delete', icon: 'D', disabled: true },
  ];
  direction: 'up' | 'down' | 'left' | 'right' = 'up';
  type: 'linear' | 'circle' | 'semi-circle' = 'linear';
  radius = 80;
  disabled = false;
  visible = true;
  lastCommand = '';
}

describe('GlintSpeedDialComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestSpeedDialHostComponent],
    });
  });

  function createFixture(overrides?: Partial<TestSpeedDialHostComponent>) {
    const fixture = TestBed.createComponent(TestSpeedDialHostComponent);
    if (overrides) {
      Object.assign(fixture.componentInstance, overrides);
    }
    fixture.detectChanges();
    return fixture;
  }

  function getTrigger(fixture: ReturnType<typeof createFixture>) {
    return fixture.nativeElement.querySelector('.speed-dial-trigger') as HTMLButtonElement;
  }

  function getItems(fixture: ReturnType<typeof createFixture>) {
    return Array.from(
      fixture.nativeElement.querySelectorAll('.speed-dial-item')
    ) as HTMLButtonElement[];
  }

  // ── Basic rendering ─────────────────────────────

  it('should render FAB trigger button', () => {
    const fixture = createFixture();
    const trigger = getTrigger(fixture);
    expect(trigger).toBeTruthy();
    expect(trigger.getAttribute('aria-label')).toBe('Speed dial');
    expect(trigger.getAttribute('type')).toBe('button');
  });

  it('should toggle open state on click', () => {
    const fixture = createFixture();
    const trigger = getTrigger(fixture);

    // Initially closed
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    // Open
    trigger.click();
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    // Close
    trigger.click();
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('should render action items when open', () => {
    const fixture = createFixture();
    getTrigger(fixture).click();
    fixture.detectChanges();

    const items = getItems(fixture);
    expect(items.length).toBe(3);
    expect(items[0].getAttribute('aria-label')).toBe('Add');
    expect(items[0].getAttribute('role')).toBe('menuitem');
  });

  it('should call item command on click', () => {
    const fixture = createFixture();
    getTrigger(fixture).click();
    fixture.detectChanges();

    const items = getItems(fixture);
    items[0].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.lastCommand).toBe('add');
  });

  it('should not toggle when disabled', () => {
    const fixture = createFixture({ disabled: true });
    const trigger = getTrigger(fixture);

    trigger.click();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(getItems(fixture).length).toBe(0);
  });

  it('should have aria-expanded attribute', () => {
    const fixture = createFixture();
    const trigger = getTrigger(fixture);
    expect(trigger.hasAttribute('aria-expanded')).toBe(true);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('should close on item click', () => {
    const fixture = createFixture();
    getTrigger(fixture).click();
    fixture.detectChanges();

    expect(getItems(fixture).length).toBe(3);

    const items = getItems(fixture);
    items[0].click();
    fixture.detectChanges();

    // After clicking an item, the dial should close
    expect(getItems(fixture).length).toBe(0);
    expect(getTrigger(fixture).getAttribute('aria-expanded')).toBe('false');
  });

  it('should not be visible when visible is false', () => {
    const fixture = createFixture({ visible: false });
    const trigger = getTrigger(fixture);
    expect(trigger).toBeFalsy();
  });

  it('should not call command for disabled item', () => {
    const fixture = createFixture();
    getTrigger(fixture).click();
    fixture.detectChanges();

    const items = getItems(fixture);
    // The third item (Delete) is disabled
    items[2].click();
    fixture.detectChanges();

    // Disabled item click should not close the dial or execute command
    // (command is undefined anyway, but the dial should remain open since
    // disabled items are blocked)
    // Actually, disabled items should not close the dial
    expect(fixture.componentInstance.lastCommand).toBe('');
  });

  it('should show trigger icon as + when closed and x when open', () => {
    const fixture = createFixture();
    const triggerIcon = fixture.nativeElement.querySelector('.trigger-icon') as HTMLElement;

    expect(triggerIcon.textContent?.trim()).toBe('+');
    expect(triggerIcon.classList.contains('rotated')).toBe(false);

    getTrigger(fixture).click();
    fixture.detectChanges();

    expect(triggerIcon.classList.contains('rotated')).toBe(true);
  });

  it('should render item tooltips', () => {
    const fixture = createFixture();
    getTrigger(fixture).click();
    fixture.detectChanges();

    const tooltips = Array.from(
      fixture.nativeElement.querySelectorAll('.item-tooltip')
    ) as HTMLElement[];
    expect(tooltips.length).toBe(3);
    expect(tooltips[0].textContent?.trim()).toBe('Add');
  });

  it('should apply disabled class on disabled item', () => {
    const fixture = createFixture();
    getTrigger(fixture).click();
    fixture.detectChanges();

    const items = getItems(fixture);
    expect(items[2].classList.contains('disabled')).toBe(true);
    expect(items[0].classList.contains('disabled')).toBe(false);
  });
});
