import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  OnInit,
  output,
  signal,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { GlintPaginatorComponent, GlintPageEvent } from '../paginator/paginator.component';

/**
 * Data list/grid component with layout toggle and optional pagination.
 *
 * @example
 * ```html
 * <glint-data-view [value]="items" layout="grid" [paginator]="true" [rows]="12">
 *   <ng-template #listItem let-item>
 *     <div>{{ item.name }}</div>
 *   </ng-template>
 *   <ng-template #gridItem let-item>
 *     <div class="card">{{ item.name }}</div>
 *   </ng-template>
 * </glint-data-view>
 * ```
 */
@Component({
  selector: 'glint-data-view',
  standalone: true,
  imports: [NgTemplateOutlet, GlintPaginatorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-layout]': 'currentLayout()',
  },
  styles: `
    :host {
      display: block;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      color: var(--glint-color-text);
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-block: var(--glint-spacing-sm);
      padding-inline: var(--glint-spacing-md);
      border-block-end: 1px solid var(--glint-color-border);
      background: var(--glint-color-surface-variant);
    }

    .layout-toggle {
      display: inline-flex;
      gap: 0;
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      overflow: hidden;
    }

    .layout-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 2rem;
      block-size: 2rem;
      border: none;
      background: var(--glint-color-surface);
      color: var(--glint-color-text-muted);
      font: inherit;
      cursor: pointer;
      transition:
        background-color var(--glint-duration-fast) var(--glint-easing),
        color var(--glint-duration-fast) var(--glint-easing);
    }

    .layout-btn:hover:not(.active) {
      background: color-mix(in oklch, var(--glint-color-surface-variant), var(--glint-color-border) 20%);
    }

    .layout-btn.active {
      background: var(--glint-color-primary);
      color: var(--glint-color-primary-contrast);
    }

    .layout-btn:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: -2px;
    }

    .content-list {
      display: flex;
      flex-direction: column;
    }

    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: var(--glint-spacing-md);
      padding: var(--glint-spacing-md);
    }

    .empty {
      padding: var(--glint-spacing-lg);
      text-align: center;
      color: var(--glint-color-text-muted);
    }

    .footer {
      border-block-start: 1px solid var(--glint-color-border);
    }
  `,
  template: `
    <div class="header">
      <div class="layout-toggle" role="radiogroup" aria-label="Layout toggle">
        <button
          class="layout-btn"
          [class.active]="currentLayout() === 'list'"
          role="radio"
          [attr.aria-checked]="currentLayout() === 'list'"
          aria-label="List layout"
          (click)="setLayout('list')"
        >&#9776;</button>
        <button
          class="layout-btn"
          [class.active]="currentLayout() === 'grid'"
          role="radio"
          [attr.aria-checked]="currentLayout() === 'grid'"
          aria-label="Grid layout"
          (click)="setLayout('grid')"
        >&#9638;</button>
      </div>
    </div>

    @if (paginatedData().length === 0) {
      <div class="empty">{{ emptyMessage() }}</div>
    } @else {
      @if (currentLayout() === 'list') {
        <div class="content-list" role="list">
          @for (item of paginatedData(); track item) {
            <div role="listitem">
              @if (listItemTemplate()) {
                <ng-container [ngTemplateOutlet]="listItemTemplate()!" [ngTemplateOutletContext]="{ $implicit: item }" />
              }
            </div>
          }
        </div>
      } @else {
        <div class="content-grid" role="list">
          @for (item of paginatedData(); track item) {
            <div role="listitem">
              @if (gridItemTemplate()) {
                <ng-container [ngTemplateOutlet]="gridItemTemplate()!" [ngTemplateOutletContext]="{ $implicit: item }" />
              }
            </div>
          }
        </div>
      }
    }

    @if (paginator()) {
      <div class="footer">
        <glint-paginator
          [totalRecords]="resolvedTotalRecords()"
          [(rows)]="paginatorRows"
          [(first)]="paginatorFirst"
          (pageChange)="onPageChange($event)"
        />
      </div>
    }
  `,
})
export class GlintDataViewComponent implements OnInit {
  /** Data array to display */
  value = input.required<unknown[]>();
  /** Layout mode: list or grid */
  layout = input<'list' | 'grid'>('list');
  /** Whether to show a paginator */
  paginator = input(false);
  /** Number of items per page */
  rows = input(10);
  /** Total number of records (defaults to value.length) */
  totalRecords = input<number | null>(null);
  /** Message displayed when value is empty */
  emptyMessage = input('No records found');

  /** Emitted when the layout changes */
  layoutChange = output<'list' | 'grid'>();

  /** Template for list item rendering */
  listItemTemplate = contentChild<TemplateRef<unknown>>('listItem');
  /** Template for grid item rendering */
  gridItemTemplate = contentChild<TemplateRef<unknown>>('gridItem');

  /** Current layout state (mutable, initialized from input) */
  protected currentLayout = signal<'list' | 'grid'>('list');

  /** Paginator state */
  protected paginatorFirst = signal(0);
  protected paginatorRows = signal(10);

  /** Resolved total records: use input or fall back to value.length */
  protected resolvedTotalRecords = computed(() => {
    const tr = this.totalRecords();
    return tr !== null ? tr : this.value().length;
  });

  /** Paginated slice of data */
  paginatedData = computed(() => {
    const data = this.value();
    if (!this.paginator()) return data;

    const first = this.paginatorFirst();
    const rows = this.paginatorRows();
    return data.slice(first, first + rows);
  });

  constructor() {
    // Sync layout input to mutable state — use computed effect pattern
    // We initialize in constructor and the signal is overridden by setLayout
  }

  /** Update the layout and sync paginator rows from input */
  protected setLayout(layout: 'list' | 'grid'): void {
    this.currentLayout.set(layout);
    this.layoutChange.emit(layout);
  }

  protected onPageChange(event: GlintPageEvent): void {
    this.paginatorFirst.set(event.first);
    this.paginatorRows.set(event.rows);
  }

  /** Initialize layout from input — called via ngOnInit equivalent */
  ngOnInit(): void {
    this.currentLayout.set(this.layout());
    this.paginatorRows.set(this.rows());
  }
}
