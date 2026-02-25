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
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { GlintIconComponent } from '../icon/icon.component';
import { resolveItemLabel } from '../core/utils/label-resolver';
import { filterByLabel } from '../core/utils/filter-utils';

/**
 * Two-list transfer component with drag-and-drop support.
 *
 * @example
 * ```html
 * <glint-pick-list
 *   [source]="available"
 *   [target]="selected"
 *   sourceHeader="Available"
 *   targetHeader="Selected"
 *   field="name"
 *   (moveToTarget)="onMoveToTarget($event)"
 *   (moveToSource)="onMoveToSource($event)"
 * />
 * ```
 */
@Component({
  selector: 'glint-pick-list',
  standalone: true,
  imports: [CdkDropList, CdkDrag, GlintIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.disabled]': 'disabled()',
  },
  styles: `
    :host {
      display: flex;
      align-items: stretch;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      color: var(--glint-color-text);
      gap: 0;
    }

    :host(.disabled) {
      opacity: 0.6;
      pointer-events: none;
    }

    .list-panel {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-inline-size: 0;
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      overflow: hidden;
    }

    .panel-header {
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

    .transfer-controls {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: var(--glint-spacing-xs);
      padding-inline: var(--glint-spacing-sm);
    }

    .transfer-controls button {
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

    .transfer-controls button:hover:not(:disabled) {
      background: color-mix(in oklch, var(--glint-color-primary), white 85%);
      border-color: var(--glint-color-primary);
      color: var(--glint-color-primary);
    }

    .transfer-controls button:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: -2px;
    }

    .transfer-controls button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  `,
  template: `
    <!-- Source list -->
    <div class="list-panel">
      <div class="panel-header">{{ sourceHeader() }}</div>
      @if (showSourceFilter()) {
        <div class="filter-container">
          <input
            class="filter-input"
            type="text"
            placeholder="Filter"
            [value]="sourceFilterText()"
            (input)="onSourceFilterInput($event)"
          />
        </div>
      }
      <ul
        class="list"
        cdkDropList
        #sourceList="cdkDropList"
        role="listbox"
        [attr.aria-label]="sourceHeader()"
        [cdkDropListData]="source()"
        [cdkDropListConnectedTo]="[targetList]"
        [cdkDropListDisabled]="disabled()"
        (cdkDropListDropped)="onSourceDrop($event)"
      >
        @for (item of filteredSourceItems(); track itemIdentity(item)) {
          <li
            class="list-item"
            cdkDrag
            role="option"
            tabindex="0"
            [attr.aria-selected]="isSourceSelected(item)"
            [class.selected]="isSourceSelected(item)"
            (click)="onSourceItemClick(item, $event)"
            (keydown.enter)="onSourceItemClick(item, $any($event))"
            (keydown.space)="onSourceItemClick(item, $any($event))"
          >{{ getLabel(item) }}</li>
        }
      </ul>
    </div>

    <!-- Transfer buttons -->
    <div class="transfer-controls">
      <button
        type="button"
        aria-label="Move all to target"
        [disabled]="source().length === 0"
        (click)="moveAllToTarget()"
      ><glint-icon name="chevronsRight" /></button>
      <button
        type="button"
        aria-label="Move selected to target"
        [disabled]="sourceSelection().length === 0"
        (click)="moveSelectedToTarget()"
      ><glint-icon name="arrowRight" /></button>
      <button
        type="button"
        aria-label="Move selected to source"
        [disabled]="targetSelection().length === 0"
        (click)="moveSelectedToSource()"
      ><glint-icon name="arrowLeft" /></button>
      <button
        type="button"
        aria-label="Move all to source"
        [disabled]="target().length === 0"
        (click)="moveAllToSource()"
      ><glint-icon name="chevronsLeft" /></button>
    </div>

    <!-- Target list -->
    <div class="list-panel">
      <div class="panel-header">{{ targetHeader() }}</div>
      @if (showTargetFilter()) {
        <div class="filter-container">
          <input
            class="filter-input"
            type="text"
            placeholder="Filter"
            [value]="targetFilterText()"
            (input)="onTargetFilterInput($event)"
          />
        </div>
      }
      <ul
        class="list"
        cdkDropList
        #targetList="cdkDropList"
        role="listbox"
        [attr.aria-label]="targetHeader()"
        [cdkDropListData]="target()"
        [cdkDropListConnectedTo]="[sourceList]"
        [cdkDropListDisabled]="disabled()"
        (cdkDropListDropped)="onTargetDrop($event)"
      >
        @for (item of filteredTargetItems(); track itemIdentity(item)) {
          <li
            class="list-item"
            cdkDrag
            role="option"
            tabindex="0"
            [attr.aria-selected]="isTargetSelected(item)"
            [class.selected]="isTargetSelected(item)"
            (click)="onTargetItemClick(item, $event)"
            (keydown.enter)="onTargetItemClick(item, $any($event))"
            (keydown.space)="onTargetItemClick(item, $any($event))"
          >{{ getLabel(item) }}</li>
        }
      </ul>
    </div>
  `,
})
export class GlintPickListComponent {
  /** Left list items */
  source = input.required<unknown[]>();
  /** Right list items */
  target = input.required<unknown[]>();
  /** Left list header */
  sourceHeader = input('Available');
  /** Right list header */
  targetHeader = input('Selected');
  /** Field name for display */
  field = input('');
  /** Field for filtering */
  filterBy = input('');
  /** Show source filter */
  showSourceFilter = input(false);
  /** Show target filter */
  showTargetFilter = input(false);
  /** Disabled state */
  disabled = input(false);

  /** Emits items moved to target */
  moveToTarget = output<unknown[]>();
  /** Emits items moved back to source */
  moveToSource = output<unknown[]>();
  /** Emits source after reorder */
  sourceReorder = output<unknown[]>();
  /** Emits target after reorder */
  targetReorder = output<unknown[]>();

  protected sourceSelection = signal<unknown[]>([]);
  protected targetSelection = signal<unknown[]>([]);
  protected sourceFilterText = signal('');
  protected targetFilterText = signal('');

  protected filteredSourceItems = computed(() => {
    const filterField = this.filterBy();
    if (!filterField || !this.showSourceFilter()) return this.source();
    return filterByLabel(this.source(), this.sourceFilterText(), item =>
      String(this.getFieldValue(item, filterField))
    );
  });

  protected filteredTargetItems = computed(() => {
    const filterField = this.filterBy();
    if (!filterField || !this.showTargetFilter()) return this.target();
    return filterByLabel(this.target(), this.targetFilterText(), item =>
      String(this.getFieldValue(item, filterField))
    );
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

  protected isSourceSelected(item: unknown): boolean {
    return this.sourceSelection().includes(item);
  }

  protected isTargetSelected(item: unknown): boolean {
    return this.targetSelection().includes(item);
  }

  protected onSourceItemClick(item: unknown, event: MouseEvent | KeyboardEvent): void {
    if (this.disabled()) return;
    this.toggleSelection(this.sourceSelection, item, event);
  }

  protected onTargetItemClick(item: unknown, event: MouseEvent | KeyboardEvent): void {
    if (this.disabled()) return;
    this.toggleSelection(this.targetSelection, item, event);
  }

  protected onSourceFilterInput(event: Event): void {
    this.sourceFilterText.set((event.target as HTMLInputElement).value);
  }

  protected onTargetFilterInput(event: Event): void {
    this.targetFilterText.set((event.target as HTMLInputElement).value);
  }

  protected onSourceDrop(event: CdkDragDrop<unknown[]>): void {
    if (event.previousContainer === event.container) {
      // Reorder within source
      const items = [...this.source()];
      moveItemInArray(items, event.previousIndex, event.currentIndex);
      this.sourceReorder.emit(items);
    } else {
      // Transfer from target to source
      const src = [...this.target()];
      const tgt = [...this.source()];
      transferArrayItem(src, tgt, event.previousIndex, event.currentIndex);
      const moved = [tgt[event.currentIndex]];
      this.targetSelection.update(sel => sel.filter(i => !moved.includes(i)));
      this.moveToSource.emit(moved);
    }
  }

  protected onTargetDrop(event: CdkDragDrop<unknown[]>): void {
    if (event.previousContainer === event.container) {
      // Reorder within target
      const items = [...this.target()];
      moveItemInArray(items, event.previousIndex, event.currentIndex);
      this.targetReorder.emit(items);
    } else {
      // Transfer from source to target
      const src = [...this.source()];
      const tgt = [...this.target()];
      transferArrayItem(src, tgt, event.previousIndex, event.currentIndex);
      const moved = [tgt[event.currentIndex]];
      this.sourceSelection.update(sel => sel.filter(i => !moved.includes(i)));
      this.moveToTarget.emit(moved);
    }
  }

  moveSelectedToTarget(): void {
    const sel = this.sourceSelection();
    if (sel.length === 0) return;
    this.sourceSelection.set([]);
    this.moveToTarget.emit([...sel]);
  }

  moveAllToTarget(): void {
    const items = [...this.source()];
    if (items.length === 0) return;
    this.sourceSelection.set([]);
    this.moveToTarget.emit(items);
  }

  moveSelectedToSource(): void {
    const sel = this.targetSelection();
    if (sel.length === 0) return;
    this.targetSelection.set([]);
    this.moveToSource.emit([...sel]);
  }

  moveAllToSource(): void {
    const items = [...this.target()];
    if (items.length === 0) return;
    this.targetSelection.set([]);
    this.moveToSource.emit(items);
  }

  private toggleSelection(
    selectionSignal: ReturnType<typeof signal<unknown[]>>,
    item: unknown,
    event: MouseEvent | KeyboardEvent,
  ): void {
    const current = selectionSignal();
    if (event.ctrlKey || event.metaKey) {
      if (current.includes(item)) {
        selectionSignal.set(current.filter(i => i !== item));
      } else {
        selectionSignal.set([...current, item]);
      }
    } else {
      if (current.length === 1 && current[0] === item) {
        selectionSignal.set([]);
      } else {
        selectionSignal.set([item]);
      }
    }
  }
}
