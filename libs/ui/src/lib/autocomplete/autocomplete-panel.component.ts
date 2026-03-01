import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  output,
  signal,
  viewChildren,
} from '@angular/core';

/**
 * Internal autocomplete panel rendered inside the CDK overlay.
 * Not exported from the public API.
 */
@Component({
  selector: 'glint-autocomplete-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'listbox',
  },
  styles: `
    :host {
      display: block;
      min-inline-size: 12rem;
      background: var(--glint-color-surface);
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      outline: none;
      overflow: auto;
      max-block-size: 16rem;
    }

    .suggestion-item {
      display: flex;
      align-items: center;
      inline-size: 100%;
      border: none;
      background: transparent;
      color: var(--glint-color-text);
      font: inherit;
      padding-block: var(--glint-spacing-sm);
      padding-inline: var(--glint-spacing-md);
      cursor: pointer;
      text-align: start;
      transition: background-color var(--glint-duration-fast) var(--glint-easing);
    }

    .suggestion-item:hover {
      background: color-mix(in oklch, var(--glint-color-primary), transparent 90%);
    }

    .suggestion-item.highlighted {
      background: color-mix(in oklch, var(--glint-color-primary), transparent 85%);
    }

    .suggestion-item:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: -2px;
    }

    .empty-message {
      padding: var(--glint-spacing-md);
      text-align: center;
      color: var(--glint-color-text-muted);
      font-size: 0.875em;
    }
  `,
  template: `
    @for (item of suggestions(); track labelFn(item); let i = $index) {
      <div
        #itemEl
        class="suggestion-item"
        [class.highlighted]="i === highlightIndex()"
        role="option"
        tabindex="-1"
        [attr.aria-selected]="i === highlightIndex()"
        (click)="onItemClick(item)"
        (keydown.enter)="onItemClick(item)"
      >{{ labelFn(item) }}</div>
    }
    @if (suggestions().length === 0) {
      <div class="empty-message">No results found</div>
    }
  `,
})
export class AutoCompletePanelComponent {
  suggestions = signal<unknown[]>([]);
  highlightIndex = signal(-1);
  labelFn: (item: unknown) => string = (item) => String(item);

  itemSelected = output<unknown>();

  private itemEls = viewChildren<ElementRef<HTMLElement>>('itemEl');

  onItemClick(item: unknown): void {
    this.itemSelected.emit(item);
  }

  scrollHighlightedIntoView(): void {
    const els = this.itemEls();
    const idx = this.highlightIndex();
    if (idx >= 0 && idx < els.length) {
      const el = els[idx].nativeElement;
      if (typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ block: 'nearest' });
      }
    }
  }
}
