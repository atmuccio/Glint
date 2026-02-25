import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  model,
  viewChild,
} from '@angular/core';

/**
 * Lightweight search input for filtering and quick-find scenarios.
 * Not a form control — uses `model()` for simple two-way binding
 * without CVA overhead.
 *
 * @example
 * ```html
 * <glint-search [(value)]="query" placeholder="Search components..." />
 * ```
 */
@Component({
  selector: 'glint-search',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'search',
    '[attr.data-variant]': 'variant()',
    '[class.has-value]': '!!value()',
  },
  styles: `
    :host {
      display: flex;
      align-items: center;
      gap: var(--glint-spacing-xs);
      padding-inline: var(--glint-spacing-sm);
      block-size: 2.25rem;
      border-radius: var(--glint-border-radius);
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      color: var(--glint-color-text);
      transition:
        background-color var(--glint-duration-fast) var(--glint-easing),
        border-color var(--glint-duration-fast) var(--glint-easing),
        box-shadow var(--glint-duration-fast) var(--glint-easing);
    }

    /* Filled (default) */
    :host([data-variant="filled"]) {
      background: color-mix(in oklch, var(--glint-color-surface-variant), var(--glint-color-border) 10%);
      border: 1px solid transparent;
    }
    :host([data-variant="filled"]:focus-within) {
      border-color: var(--glint-color-primary);
      box-shadow: 0 0 0 1px var(--glint-color-primary);
    }

    /* Outline */
    :host([data-variant="outline"]) {
      background: transparent;
      border: 1px solid var(--glint-color-border);
    }
    :host([data-variant="outline"]:focus-within) {
      border-color: var(--glint-color-primary);
      box-shadow: 0 0 0 1px var(--glint-color-primary);
    }

    /* Ghost */
    :host([data-variant="ghost"]) {
      background: transparent;
      border: 1px solid transparent;
    }
    :host([data-variant="ghost"]:focus-within) {
      background: color-mix(in oklch, var(--glint-color-surface-variant), var(--glint-color-border) 10%);
    }

    .search-icon {
      flex-shrink: 0;
      color: var(--glint-color-text-muted);
      font-size: 0.875em;
      line-height: 1;
    }

    .search-input {
      flex: 1;
      min-inline-size: 0;
      background: transparent;
      border: none;
      color: inherit;
      font: inherit;
      outline: none;
    }

    .search-input::placeholder {
      color: var(--glint-color-text-muted);
    }

    .clear-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      inline-size: 1.25rem;
      block-size: 1.25rem;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: transparent;
      color: var(--glint-color-text-muted);
      font-size: 0.75rem;
      cursor: pointer;
      transition: background-color var(--glint-duration-fast) var(--glint-easing);
    }

    .clear-btn:hover {
      background: color-mix(in oklch, var(--glint-color-text-muted), transparent 80%);
      color: var(--glint-color-text);
    }

    .clear-btn:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: 1px;
    }
  `,
  template: `
    <span class="search-icon" aria-hidden="true">&#128269;</span>
    <input #inputEl class="search-input" type="search"
           [attr.aria-label]="placeholder()"
           [placeholder]="placeholder()"
           [value]="value()"
           (input)="onInput($event)" />
    @if (value()) {
      <button class="clear-btn" type="button" aria-label="Clear search"
              (click)="clear()">&#10005;</button>
    }
  `,
})
export class GlintSearchComponent {
  /** Placeholder text */
  placeholder = input('Search...');
  /** Current search value (two-way bindable) */
  value = model('');
  /** Visual variant */
  variant = input<'filled' | 'outline' | 'ghost'>('filled');

  private inputEl = viewChild.required<ElementRef<HTMLInputElement>>('inputEl');

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }

  /** Clear the search value and re-focus the input */
  protected clear(): void {
    this.value.set('');
    this.inputEl().nativeElement.focus();
  }
}
