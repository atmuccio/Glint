import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  input,
  output,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { GlintColumnDirective } from './table-column.directive';

/** Sort event */
export interface GlintSortEvent {
  field: string;
  order: 'asc' | 'desc';
}

/**
 * Data table with column definitions, sorting, and striped rows.
 *
 * @example
 * ```html
 * <glint-table [data]="users" [striped]="true" trackBy="id">
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
  imports: [NgTemplateOutlet],
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
      background: var(--glint-color-surface-variant);
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
  `,
  host: {
    '[attr.data-striped]': 'striped() || null',
    '[attr.data-fixed-layout]': 'fixedLayout() || null',
  },
  template: `
    <table role="grid">
      <thead>
        <tr>
          @for (col of columns(); track col.field()) {
            <th
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
                >{{ sortField() === col.field() ? (sortOrder() === 'asc' ? '▲' : '▼') : '⇅' }}</span>
              }
            </th>
          }
        </tr>
      </thead>
      <tbody>
        @for (row of sortedData(); track rowIdentity(row)) {
          <tr>
            @for (col of columns(); track col.field()) {
              <td
                [class.sticky-start]="col.sticky()"
                [class.sticky-end]="col.stickyEnd()"
                [class.align-center]="col.align() === 'center'"
                [class.align-end]="col.align() === 'end'"
              >
                <ng-container [ngTemplateOutlet]="col.template" [ngTemplateOutletContext]="{ $implicit: row }" />
              </td>
            }
          </tr>
        } @empty {
          <tr>
            <td class="empty" [attr.colspan]="columns().length">No data available</td>
          </tr>
        }
      </tbody>
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
  /** Emitted on sort change */
  sortChange = output<GlintSortEvent>();

  columns = contentChildren(GlintColumnDirective);

  protected sortField = signal('');
  protected sortOrder = signal<'asc' | 'desc'>('asc');

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

  toggleSort(field: string): void {
    if (this.sortField() === field) {
      this.sortOrder.update(o => o === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortOrder.set('asc');
    }
    this.sortChange.emit({ field: this.sortField(), order: this.sortOrder() });
  }

  getAriaSort(field: string): string | null {
    if (this.sortField() !== field) return null;
    return this.sortOrder() === 'asc' ? 'ascending' : 'descending';
  }
}
