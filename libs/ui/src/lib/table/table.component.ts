import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  Directive,
  inject,
  input,
  model,
  output,
  signal,
  TemplateRef,
} from '@angular/core';
import {
  CdkTable,
  CdkColumnDef,
  CdkHeaderCellDef,
  CdkCellDef,
  CdkHeaderRowDef,
  CdkRowDef,
  CdkHeaderRow,
  CdkRow,
  CdkHeaderCell,
  CdkCell,
  CdkNoDataRow,
} from '@angular/cdk/table';
import { NgTemplateOutlet } from '@angular/common';
import { GlintColumnDirective } from './table-column.directive';

/** Sort event */
export interface GlintSortEvent {
  field: string;
  order: 'asc' | 'desc';
}

/**
 * Directive for providing a custom empty state template to the table.
 *
 * @example
 * ```html
 * <glint-table [data]="[]">
 *   <ng-template glintTableEmpty>
 *     <p>No results found. Try adjusting your filters.</p>
 *   </ng-template>
 * </glint-table>
 * ```
 */
@Directive({
  selector: '[glintTableEmpty]',
  standalone: true,
})
export class GlintTableEmptyDirective {
  readonly template = inject(TemplateRef);
}

/**
 * Data table with column definitions, sorting, row selection, and striped rows.
 *
 * Internally uses Angular CDK Table (`CdkTable`) for efficient row rendering
 * and column management via `CdkColumnDef`, `CdkHeaderCellDef`, `CdkCellDef`,
 * `CdkHeaderRowDef`, and `CdkRowDef`. Existing `glintColumn` directive API
 * and all Glint styling are preserved.
 *
 * @example
 * ```html
 * <glint-table [data]="users" [striped]="true" trackBy="id"
 *              selectionMode="multiple" [(selection)]="selectedUsers"
 *              (rowClick)="onRowClick($event)">
 *   <ng-template glintColumn="name" header="Name" [sortable]="true" let-row>
 *     {{ row.name }}
 *   </ng-template>
 *   <ng-template glintColumn="email" header="Email" align="end" let-row>
 *     {{ row.email }}
 *   </ng-template>
 * </glint-table>
 * ```
 */
@Component({
  selector: 'glint-table',
  standalone: true,
  imports: [
    CdkTable,
    CdkColumnDef,
    CdkHeaderCellDef,
    CdkCellDef,
    CdkHeaderRowDef,
    CdkRowDef,
    CdkHeaderRow,
    CdkRow,
    CdkHeaderCell,
    CdkCell,
    CdkNoDataRow,
    NgTemplateOutlet,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      overflow-x: auto;
    }

    table {
      inline-size: 100%;
      border-collapse: collapse;
      border-spacing: 0;
    }

    :host([data-fixed-layout]) table {
      table-layout: fixed;
    }

    th {
      position: sticky;
      inset-block-start: 0;
      background: var(--glint-color-surface-variant);
      color: var(--glint-color-text);
      font-weight: 600;
      text-align: start;
      padding-block: var(--glint-spacing-sm);
      padding-inline: var(--glint-spacing-md);
      border-block-end: 2px solid var(--glint-color-border);
      white-space: nowrap;
      user-select: none;
    }

    th.sortable {
      cursor: pointer;
    }
    th.sortable:hover {
      background: color-mix(in oklch, var(--glint-color-surface-variant), var(--glint-color-border) 20%);
    }

    .sort-icon {
      font-size: 0.75em;
      margin-inline-start: var(--glint-spacing-xs);
      opacity: 0.5;
    }
    .sort-icon.active {
      opacity: 1;
      color: var(--glint-color-primary);
    }

    td {
      padding-block: var(--glint-spacing-sm);
      padding-inline: var(--glint-spacing-md);
      border-block-end: 1px solid var(--glint-color-border);
      color: var(--glint-color-text);
    }

    tr:hover td {
      background: color-mix(in oklch, var(--glint-color-primary), transparent 95%);
    }

    :host([data-striped]) tr:nth-child(even) td {
      background: color-mix(in oklch, var(--glint-color-surface-variant), var(--glint-color-border) 8%);
    }

    .empty {
      padding: var(--glint-spacing-lg);
      text-align: center;
      color: var(--glint-color-text-muted);
    }

    /* Sticky column support */
    th.sticky-start,
    td.sticky-start {
      position: sticky;
      inset-inline-start: 0;
      z-index: 1;
      background: var(--glint-color-surface-variant);
    }
    td.sticky-start {
      background: var(--glint-color-surface);
    }

    th.sticky-end,
    td.sticky-end {
      position: sticky;
      inset-inline-end: 0;
      z-index: 1;
      background: var(--glint-color-surface-variant);
    }
    td.sticky-end {
      background: var(--glint-color-surface);
    }

    /* Column alignment */
    th.align-center,
    td.align-center {
      text-align: center;
    }
    th.align-end,
    td.align-end {
      text-align: end;
    }

    /* Selection */
    th.selection-cell,
    td.selection-cell {
      inline-size: 3rem;
      text-align: center;
      padding-inline: var(--glint-spacing-xs);
    }

    :host([data-selectable]) tr {
      cursor: pointer;
    }

    tr.selected td {
      background: color-mix(in oklch, var(--glint-color-primary), transparent 90%);
    }

    tr.selected:hover td {
      background: color-mix(in oklch, var(--glint-color-primary), transparent 85%);
    }

    :host([data-striped]) tr.selected td,
    :host([data-striped]) tr.selected:hover td {
      background: color-mix(in oklch, var(--glint-color-primary), transparent 90%);
    }

    .selection-checkbox {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 1.125rem;
      block-size: 1.125rem;
      border: 2px solid var(--glint-color-border);
      border-radius: calc(var(--glint-border-radius) / 2);
      background: var(--glint-color-surface);
      cursor: pointer;
      transition:
        background-color var(--glint-duration-fast) var(--glint-easing),
        border-color var(--glint-duration-fast) var(--glint-easing);
    }

    .selection-checkbox:hover {
      border-color: var(--glint-color-primary);
    }

    .selection-checkbox:focus-visible,
    .selection-radio:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: 2px;
    }

    .selection-checkbox.checked {
      background: var(--glint-color-primary);
      border-color: var(--glint-color-primary);
      color: var(--glint-color-primary-contrast);
    }

    .selection-checkbox.indeterminate {
      background: var(--glint-color-primary);
      border-color: var(--glint-color-primary);
      color: var(--glint-color-primary-contrast);
    }

    .selection-radio {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 1.125rem;
      block-size: 1.125rem;
      border: 2px solid var(--glint-color-border);
      border-radius: 50%;
      background: var(--glint-color-surface);
      cursor: pointer;
      transition:
        background-color var(--glint-duration-fast) var(--glint-easing),
        border-color var(--glint-duration-fast) var(--glint-easing);
    }

    .selection-radio:hover {
      border-color: var(--glint-color-primary);
    }

    .selection-radio.checked {
      border-color: var(--glint-color-primary);
    }

    .selection-radio.checked::after {
      content: '';
      display: block;
      inline-size: 0.5rem;
      block-size: 0.5rem;
      border-radius: 50%;
      background: var(--glint-color-primary);
    }
  `,
  host: {
    '[attr.data-striped]': 'striped() || null',
    '[attr.data-fixed-layout]': 'fixedLayout() || null',
    '[attr.data-selectable]': 'selectionMode() || null',
  },
  template: `
    <table cdk-table [dataSource]="sortedData()" role="grid" [fixedLayout]="fixedLayout()">
      <!-- Selection column -->
      @if (selectionMode()) {
        <ng-container cdkColumnDef="__selection">
          <th cdk-header-cell *cdkHeaderCellDef class="selection-cell">
            @if (selectionMode() === 'multiple') {
              <span
                class="selection-checkbox"
                [class.checked]="allSelected()"
                [class.indeterminate]="someSelected() && !allSelected()"
                role="checkbox"
                aria-label="Select all rows"
                [attr.aria-checked]="allSelected() ? 'true' : someSelected() ? 'mixed' : 'false'"
                tabindex="0"
                (click)="toggleSelectAll()"
                (keydown.enter)="toggleSelectAll()"
                (keydown.space)="toggleSelectAll(); $event.preventDefault()"
              >@if (allSelected()) {&#10003;} @else if (someSelected()) {&#8722;}</span>
            }
          </th>
          <td cdk-cell *cdkCellDef="let row" class="selection-cell">
            @if (selectionMode() === 'multiple') {
              <span
                class="selection-checkbox"
                [class.checked]="isRowSelected(row)"
                role="checkbox"
                aria-label="Select row"
                [attr.aria-checked]="isRowSelected(row)"
                tabindex="0"
                (click)="toggleRowSelection(row); $event.stopPropagation()"
                (keydown.enter)="toggleRowSelection(row); $event.stopPropagation()"
                (keydown.space)="toggleRowSelection(row); $event.stopPropagation(); $event.preventDefault()"
              >@if (isRowSelected(row)) {&#10003;}</span>
            } @else {
              <span
                class="selection-radio"
                [class.checked]="isRowSelected(row)"
                role="radio"
                aria-label="Select row"
                [attr.aria-checked]="isRowSelected(row)"
                tabindex="0"
                (click)="toggleRowSelection(row); $event.stopPropagation()"
                (keydown.enter)="toggleRowSelection(row); $event.stopPropagation()"
                (keydown.space)="toggleRowSelection(row); $event.stopPropagation(); $event.preventDefault()"
              ></span>
            }
          </td>
        </ng-container>
      }

      @for (col of columns(); track col.field()) {
        <ng-container [cdkColumnDef]="col.field()">
          <th
            cdk-header-cell
            *cdkHeaderCellDef
            [class.sortable]="col.sortable()"
            [class.sticky-start]="col.sticky()"
            [class.sticky-end]="col.stickyEnd()"
            [class.align-center]="col.align() === 'center'"
            [class.align-end]="col.align() === 'end'"
            [style.inline-size]="col.width()"
            [attr.aria-sort]="getAriaSort(col.field())"
            (click)="col.sortable() ? toggleSort(col.field()) : null"
          >
            {{ col.header() || col.field() }}
            @if (col.sortable()) {
              <span
                class="sort-icon"
                [class.active]="sortField() === col.field()"
                aria-hidden="true"
              >{{ sortField() === col.field() ? (sortOrder() === 'asc' ? '\u25B2' : '\u25BC') : '\u21C5' }}</span>
            }
          </th>
          <td
            cdk-cell
            *cdkCellDef="let row"
            [class.sticky-start]="col.sticky()"
            [class.sticky-end]="col.stickyEnd()"
            [class.align-center]="col.align() === 'center'"
            [class.align-end]="col.align() === 'end'"
          >
            <ng-container [ngTemplateOutlet]="col.template" [ngTemplateOutletContext]="{ $implicit: row }" />
          </td>
        </ng-container>
      }

      <tr cdk-header-row *cdkHeaderRowDef="displayedColumns()"></tr>
      <tr cdk-row *cdkRowDef="let row; columns: displayedColumns()"
          [class.selected]="isRowSelected(row)"
          [attr.aria-selected]="selectionMode() ? isRowSelected(row) : null"
          (click)="onRowClick(row)"></tr>

      <ng-template cdkNoDataRow>
        <tr>
          <td class="empty" [attr.colspan]="displayedColumns().length">
            @if (emptyTemplate()) {
              <ng-container [ngTemplateOutlet]="emptyTemplate()!.template" />
            } @else {
              No data available
            }
          </td>
        </tr>
      </ng-template>
    </table>
  `,
})
export class GlintTableComponent {
  /** Data array to display */
  data = input<Record<string, unknown>[]>([]);
  /** Striped rows */
  striped = input(false);
  /** Use fixed table layout for consistent column widths */
  fixedLayout = input(false);
  /** Field name used to track row identity for efficient re-rendering */
  trackBy = input<string>();
  /** Selection mode: 'single', 'multiple', or null (disabled) */
  selectionMode = input<'single' | 'multiple' | null>(null);
  /** Selected rows (two-way bindable) */
  selection = model<Record<string, unknown>[]>([]);
  /** Emitted on sort change */
  sortChange = output<GlintSortEvent>();
  /** Emitted when a row is clicked */
  rowClick = output<Record<string, unknown>>();

  columns = contentChildren(GlintColumnDirective);
  emptyTemplate = contentChild(GlintTableEmptyDirective);

  protected sortField = signal('');
  protected sortOrder = signal<'asc' | 'desc'>('asc');

  /** Column names for CdkTable's displayedColumns */
  protected displayedColumns = computed(() => {
    const cols = this.columns().map(col => col.field());
    if (this.selectionMode()) {
      return ['__selection', ...cols];
    }
    return cols;
  });

  /** Whether all rows are selected */
  protected allSelected = computed(() => {
    const data = this.sortedData();
    const sel = this.selection();
    return data.length > 0 && sel.length === data.length;
  });

  /** Whether some (but not all) rows are selected */
  protected someSelected = computed(() => {
    const sel = this.selection();
    return sel.length > 0 && !this.allSelected();
  });

  /** Returns a stable identity for a data row based on trackBy field or object reference */
  protected rowIdentity(row: Record<string, unknown>): unknown {
    const field = this.trackBy();
    return field ? row[field] : row;
  }

  protected sortedData = computed(() => {
    const data = [...this.data()];
    const field = this.sortField();
    const order = this.sortOrder();

    if (!field) return data;

    return data.sort((a, b) => {
      const va = a[field];
      const vb = b[field];
      if (va == null && vb == null) return 0;
      if (va == null) return order === 'asc' ? -1 : 1;
      if (vb == null) return order === 'asc' ? 1 : -1;
      if (va < vb) return order === 'asc' ? -1 : 1;
      if (va > vb) return order === 'asc' ? 1 : -1;
      return 0;
    });
  });

  /** Check if a row is currently selected */
  protected isRowSelected(row: Record<string, unknown>): boolean {
    const trackField = this.trackBy();
    if (trackField) {
      return this.selection().some(s => s[trackField] === row[trackField]);
    }
    return this.selection().includes(row);
  }

  /** Toggle selection of a single row */
  protected toggleRowSelection(row: Record<string, unknown>): void {
    if (!this.selectionMode()) return;

    if (this.selectionMode() === 'single') {
      this.selection.set(this.isRowSelected(row) ? [] : [row]);
      return;
    }

    // Multiple mode
    if (this.isRowSelected(row)) {
      const trackField = this.trackBy();
      if (trackField) {
        this.selection.update(sel => sel.filter(s => s[trackField] !== row[trackField]));
      } else {
        this.selection.update(sel => sel.filter(s => s !== row));
      }
    } else {
      this.selection.update(sel => [...sel, row]);
    }
  }

  /** Toggle select all / deselect all */
  protected toggleSelectAll(): void {
    if (this.allSelected()) {
      this.selection.set([]);
    } else {
      this.selection.set([...this.sortedData()]);
    }
  }

  /** Handle row click */
  protected onRowClick(row: Record<string, unknown>): void {
    this.rowClick.emit(row);
    if (this.selectionMode()) {
      this.toggleRowSelection(row);
    }
  }

  protected toggleSort(field: string): void {
    if (this.sortField() === field) {
      this.sortOrder.update(o => o === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortOrder.set('asc');
    }
    this.sortChange.emit({ field: this.sortField(), order: this.sortOrder() });
  }

  protected getAriaSort(field: string): string | null {
    if (this.sortField() !== field) return null;
    return this.sortOrder() === 'asc' ? 'ascending' : 'descending';
  }
}
