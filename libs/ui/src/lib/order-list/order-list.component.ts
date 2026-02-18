import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { resolveItemLabel } from '../core/utils/label-resolver';
import { filterByLabel } from '../core/utils/filter-utils';

/**
 * Reorderable list with drag-and-drop support and move buttons.
 *
 * @example
 * ```html
 * <glint-order-list
 *   [value]="cities"
 *   header="Cities"
 *   field="name"
 *   filterBy="name"
 *   (reorder)="onReorder($event)"
 *   (selectionChange)="onSelect($event)"
 * />
 * ```
 */
@Component({
  selector: 'glint-order-list',
  standalone: true,
  imports: [CdkDropList, CdkDrag],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.disabled]': 'disabled()',
  },
  styles: `
    :host {
      display: flex;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      color: var(--glint-color-text);
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      overflow: hidden;
    }

    :host(.disabled) {
      opacity: 0.6;
      pointer-events: none;
    }

    .controls {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: var(--glint-spacing-xs);
      padding: var(--glint-spacing-sm);
      background: var(--glint-color-surface-variant);
      border-inline-end: 1px solid var(--glint-color-border);
    }

    .controls button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-inline-size: 2rem;
      block-size: 2rem;
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      background: var(--glint-color-surface);
      color: var(--glint-color-text);
      font: inherit;
      font-size: 0.875rem;
      cursor: pointer;
      transition:
        background-color var(--glint-duration-fast) var(--glint-easing),
        border-color var(--glint-duration-fast) var(--glint-easing);
    }

    .controls button:hover:not(:disabled) {
      background: color-mix(in oklch, var(--glint-color-primary), white 85%);
      border-color: var(--glint-color-primary);
      color: var(--glint-color-primary);
    }

    .controls button:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: -2px;
    }

    .controls button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .list-container {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-inline-size: 0;
    }

    .header {
      padding-block: var(--glint-spacing-sm);
      padding-inline: var(--glint-spacing-md);
      font-weight: 600;
      background: var(--glint-color-surface-variant);
      border-block-end: 1px solid var(--glint-color-border);
    }

    .filter-container {
      padding: var(--glint-spacing-sm);
      border-block-end: 1px solid var(--glint-color-border);
    }

    .filter-input {
      inline-size: 100%;
      box-sizing: border-box;
      padding-block: var(--glint-spacing-xs);
      padding-inline: var(--glint-spacing-sm);
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      font: inherit;
      font-size: 0.875rem;
      color: var(--glint-color-text);
      background: var(--glint-color-surface);
      outline: none;
      transition: border-color var(--glint-duration-fast) var(--glint-easing);
    }

    .filter-input:focus {
      border-color: var(--glint-color-primary);
    }

    .list {
      list-style: none;
      margin: 0;
      padding: 0;
      overflow-y: auto;
      min-block-size: 12rem;
    }

    .list-item {
      padding-block: var(--glint-spacing-sm);
      padding-inline: var(--glint-spacing-md);
      cursor: pointer;
      border-block-end: 1px solid color-mix(in oklch, var(--glint-color-border), transparent 50%);
      user-select: none;
      transition: background-color var(--glint-duration-fast) var(--glint-easing);
    }

    .list-item:hover {
      background: var(--glint-color-surface-variant);
    }

    .list-item.selected {
      background: color-mix(in oklch, var(--glint-color-primary), white 85%);
      color: var(--glint-color-primary);
    }

    .list-item.cdk-drag-placeholder {
      background: var(--glint-color-surface-variant);
      opacity: 0.5;
    }

    .list-item.cdk-drag-preview {
      background: var(--glint-color-surface);
      border: 1px solid var(--glint-color-primary);
      border-radius: var(--glint-border-radius);
      box-shadow: 0 4px 12px rgb(0 0 0 / 0.15);
      padding-block: var(--glint-spacing-sm);
      padding-inline: var(--glint-spacing-md);
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
    }

    .cdk-drag-animating {
      transition: transform var(--glint-duration-normal) var(--glint-easing);
    }

    .cdk-drop-list-dragging .list-item:not(.cdk-drag-placeholder) {
      transition: transform var(--glint-duration-normal) var(--glint-easing);
    }
  `,
  template: `
    <div class="controls">
      <button
        type="button"
        aria-label="Move to top"
        [disabled]="!canMoveUp()"
        (click)="moveToTop()"
      >&#8648;</button>
      <button
        type="button"
        aria-label="Move up"
        [disabled]="!canMoveUp()"
        (click)="moveUp()"
      >&#9650;</button>
      <button
        type="button"
        aria-label="Move down"
        [disabled]="!canMoveDown()"
        (click)="moveDown()"
      >&#9660;</button>
      <button
        type="button"
        aria-label="Move to bottom"
        [disabled]="!canMoveDown()"
        (click)="moveToBottom()"
      >&#8650;</button>
    </div>
    <div class="list-container">
      @if (header()) {
        <div class="header">{{ header() }}</div>
      }
      @if (filterBy()) {
        <div class="filter-container">
          <input
            class="filter-input"
            type="text"
            [placeholder]="filterPlaceholder()"
            [value]="filterText()"
            (input)="onFilterInput($event)"
          />
        </div>
      }
      <ul
        class="list"
        cdkDropList
        role="listbox"
        aria-label="Reorderable list"
        [cdkDropListData]="value()"
        [cdkDropListDisabled]="disabled()"
        (cdkDropListDropped)="onDrop($event)"
      >
        @for (item of filteredItems(); track itemIdentity(item)) {
          <li
            class="list-item"
            cdkDrag
            role="option"
            tabindex="0"
            [attr.aria-selected]="isSelected(item)"
            [class.selected]="isSelected(item)"
            (click)="onItemClick(item, $event)"
            (keydown.enter)="onItemClick(item, $any($event))"
            (keydown.space)="onItemClick(item, $any($event))"
          >{{ getLabel(item) }}</li>
        }
      </ul>
    </div>
  `,
})
export class GlintOrderListComponent {
  /** The list items */
  value = input.required<unknown[]>();
  /** Optional header text */
  header = input('');
  /** Field name for displaying object items */
  field = input('');
  /** Field to filter by (enables filter when non-empty) */
  filterBy = input('');
  /** Placeholder for filter input */
  filterPlaceholder = input('Filter');
  /** Disabled state */
  disabled = input(false);

  /** Emits the full reordered array after any change */
  reorder = output<unknown[]>();
  /** Emits selected items */
  selectionChange = output<unknown[]>();

  protected selection = signal<unknown[]>([]);
  protected filterText = signal('');

  protected filteredItems = computed(() => {
    const filterField = this.filterBy();
    if (!filterField) return this.value();
    return filterByLabel(this.value(), this.filterText(), item =>
      String(this.getFieldValue(item, filterField))
    );
  });

  protected canMoveUp = computed(() => {
    const sel = this.selection();
    if (sel.length === 0) return false;
    const items = this.value();
    // Can move up if any selected item is not already at the top
    const selectedIndices = sel.map(s => items.indexOf(s)).filter(i => i >= 0).sort((a, b) => a - b);
    return selectedIndices.length > 0 && selectedIndices[0] > 0;
  });

  protected canMoveDown = computed(() => {
    const sel = this.selection();
    if (sel.length === 0) return false;
    const items = this.value();
    const selectedIndices = sel.map(s => items.indexOf(s)).filter(i => i >= 0).sort((a, b) => a - b);
    return selectedIndices.length > 0 && selectedIndices[selectedIndices.length - 1] < items.length - 1;
  });

  protected getLabel(item: unknown): string {
    return resolveItemLabel(item, this.field());
  }

  protected getFieldValue(item: unknown, fieldName: string): unknown {
    if (item != null && typeof item === 'object') {
      return (item as Record<string, unknown>)[fieldName];
    }
    return item;
  }

  protected itemIdentity(item: unknown): unknown {
    return item;
  }

  protected isSelected(item: unknown): boolean {
    return this.selection().includes(item);
  }

  protected onItemClick(item: unknown, event: MouseEvent | KeyboardEvent): void {
    if (this.disabled()) return;

    const current = this.selection();
    if (event.ctrlKey || event.metaKey) {
      // Toggle selection
      if (current.includes(item)) {
        this.selection.set(current.filter(i => i !== item));
      } else {
        this.selection.set([...current, item]);
      }
    } else {
      // Single select
      if (current.length === 1 && current[0] === item) {
        this.selection.set([]);
      } else {
        this.selection.set([item]);
      }
    }
    this.selectionChange.emit(this.selection());
  }

  protected onDrop(event: CdkDragDrop<unknown[]>): void {
    const items = [...this.value()];
    moveItemInArray(items, event.previousIndex, event.currentIndex);
    this.emitReorder(items);
  }

  protected onFilterInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.filterText.set(target.value);
  }

  moveToTop(): void {
    const items = [...this.value()];
    const sel = this.selection();
    const selectedIndices = sel.map(s => items.indexOf(s)).filter(i => i >= 0).sort((a, b) => a - b);

    let insertAt = 0;
    for (const idx of selectedIndices) {
      const item = items.splice(idx, 1)[0];
      items.splice(insertAt, 0, item);
      insertAt++;
    }

    this.emitReorder(items);
  }

  moveUp(): void {
    const items = [...this.value()];
    const sel = this.selection();
    const selectedIndices = sel.map(s => items.indexOf(s)).filter(i => i >= 0).sort((a, b) => a - b);

    for (const idx of selectedIndices) {
      if (idx > 0 && !sel.includes(items[idx - 1])) {
        const temp = items[idx];
        items[idx] = items[idx - 1];
        items[idx - 1] = temp;
      }
    }

    this.emitReorder(items);
  }

  moveDown(): void {
    const items = [...this.value()];
    const sel = this.selection();
    const selectedIndices = sel.map(s => items.indexOf(s)).filter(i => i >= 0).sort((a, b) => b - a);

    for (const idx of selectedIndices) {
      if (idx < items.length - 1 && !sel.includes(items[idx + 1])) {
        const temp = items[idx];
        items[idx] = items[idx + 1];
        items[idx + 1] = temp;
      }
    }

    this.emitReorder(items);
  }

  moveToBottom(): void {
    const items = [...this.value()];
    const sel = this.selection();
    const selectedIndices = sel.map(s => items.indexOf(s)).filter(i => i >= 0).sort((a, b) => b - a);

    let insertAt = items.length;
    for (const idx of selectedIndices) {
      const item = items.splice(idx, 1)[0];
      insertAt--;
      items.splice(insertAt, 0, item);
    }

    this.emitReorder(items);
  }

  private emitReorder(items: unknown[]): void {
    this.reorder.emit(items);
  }
}
