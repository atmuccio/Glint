import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { GlintSearchComponent } from './search.component';

@Component({
  selector: 'glint-test-search-host',
  standalone: true,
  imports: [GlintSearchComponent],
  template: `
    <glint-search
      [(value)]="query"
      [placeholder]="placeholder"
      [variant]="variant"
    />
  `,
})
class TestSearchHostComponent {
  query = signal('');
  placeholder = 'Search...';
  variant: 'filled' | 'outline' | 'ghost' = 'filled';
}

describe('GlintSearchComponent', () => {
  async function setup(overrides?: Partial<TestSearchHostComponent>) {
    TestBed.configureTestingModule({ imports: [TestSearchHostComponent] });
    const fixture = TestBed.createComponent(TestSearchHostComponent);
    if (overrides) Object.assign(fixture.componentInstance, overrides);
    fixture.detectChanges();
    await fixture.whenStable();
    return {
      fixture,
      host: fixture.componentInstance,
      el: fixture.nativeElement as HTMLElement,
      search: fixture.nativeElement.querySelector('glint-search') as HTMLElement,
    };
  }

  it('should render with default placeholder', async () => {
    const { search } = await setup();
    const input = search.querySelector('input') as HTMLInputElement;
    expect(input.placeholder).toBe('Search...');
  });

  it('should accept custom placeholder', async () => {
    const { search } = await setup({ placeholder: 'Find items...' });
    const input = search.querySelector('input') as HTMLInputElement;
    expect(input.placeholder).toBe('Find items...');
  });

  it('should set data-variant attribute', async () => {
    const { search } = await setup({ variant: 'outline' });
    expect(search.getAttribute('data-variant')).toBe('outline');
  });

  it('should default to filled variant', async () => {
    const { search } = await setup();
    expect(search.getAttribute('data-variant')).toBe('filled');
  });

  it('should two-way bind value', async () => {
    const { host, search, fixture } = await setup();
    const input = search.querySelector('input') as HTMLInputElement;

    // Type into the input
    input.value = 'hello';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(host.query()).toBe('hello');
  });

  it('should show clear button when value is non-empty', async () => {
    const { search, fixture, host } = await setup();

    // Initially no clear button
    expect(search.querySelector('.clear-btn')).toBeNull();

    // Set a value
    host.query.set('test');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(search.querySelector('.clear-btn')).toBeTruthy();
  });

  it('should clear value on clear button click', async () => {
    const { search, fixture, host } = await setup();

    host.query.set('some text');
    fixture.detectChanges();
    await fixture.whenStable();

    const clearBtn = search.querySelector('.clear-btn') as HTMLButtonElement;
    expect(clearBtn).toBeTruthy();

    clearBtn.click();
    fixture.detectChanges();

    expect(host.query()).toBe('');
  });

  it('should have aria-label on clear button', async () => {
    const { search, fixture, host } = await setup();

    host.query.set('x');
    fixture.detectChanges();
    await fixture.whenStable();

    const clearBtn = search.querySelector('.clear-btn') as HTMLButtonElement;
    expect(clearBtn.getAttribute('aria-label')).toBe('Clear search');
  });

  it('should set has-value class when value is non-empty', async () => {
    const { search, fixture, host } = await setup();

    expect(search.classList.contains('has-value')).toBe(false);

    host.query.set('abc');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(search.classList.contains('has-value')).toBe(true);
  });

  it('should have a search icon', async () => {
    const { search } = await setup();
    const icon = search.querySelector('.search-icon');
    expect(icon).toBeTruthy();
    expect(icon!.getAttribute('aria-hidden')).toBe('true');
  });

  it('should support ghost variant', async () => {
    const { search } = await setup({ variant: 'ghost' });
    expect(search.getAttribute('data-variant')).toBe('ghost');
  });

  it('should have role="search" on host', async () => {
    const { search } = await setup();
    expect(search.getAttribute('role')).toBe('search');
  });

  it('should use type="search" on input', async () => {
    const { search } = await setup();
    const input = search.querySelector('input') as HTMLInputElement;
    expect(input.type).toBe('search');
  });

  it('should set aria-label on input from placeholder', async () => {
    const { search } = await setup({ placeholder: 'Find items...' });
    const input = search.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('aria-label')).toBe('Find items...');
  });
});
