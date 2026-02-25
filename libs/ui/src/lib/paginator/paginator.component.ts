import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
} from '@angular/core';
import { GlintIconComponent } from '../icon/icon.component';

/** Paginator state change event */
export interface GlintPageEvent {
  page: number;
  rows: number;
  first: number;
  totalRecords: number;
}

/**
 * Paginator component for navigating paged data.
 *
 * @example
 * ```html
 * <glint-paginator
 *   [totalRecords]="120"
 *   [(rows)]="pageSize"
 *   [(first)]="firstRecord"
 *   (pageChange)="onPageChange($event)"
 * />
 * ```
 */
@Component({
  selector: 'glint-paginator',
  standalone: true,
  imports: [GlintIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'navigation',
    'aria-label': 'Pagination',
  },
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--glint-spacing-sm);
      padding-block: var(--glint-spacing-sm);
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      color: var(--glint-color-text);
    }

    .page-btn {
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
      cursor: pointer;
      transition:
        background-color var(--glint-duration-fast) var(--glint-easing),
        border-color var(--glint-duration-fast) var(--glint-easing);
    }

    .page-btn:hover:not(:disabled) {
      background: var(--glint-color-surface-variant);
    }

    .page-btn:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: -2px;
    }

    .page-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .page-btn.active {
      background: var(--glint-color-primary);
      color: var(--glint-color-primary-contrast);
      border-color: var(--glint-color-primary);
    }

    .info {
      color: var(--glint-color-text-muted);
      font-size: 0.875em;
    }
  `,
  template: `
    <button
      class="page-btn"
      [disabled]="currentPage() === 0"
      aria-label="First page"
      (click)="goToPage(0)"
    ><glint-icon name="chevronsLeft" /></button>
    <button
      class="page-btn"
      [disabled]="currentPage() === 0"
      aria-label="Previous page"
      (click)="goToPage(currentPage() - 1)"
    ><glint-icon name="chevronLeft" /></button>

    @for (p of visiblePages(); track p) {
      <button
        class="page-btn"
        [class.active]="p === currentPage()"
        [attr.aria-current]="p === currentPage() ? 'page' : null"
        (click)="goToPage(p)"
      >{{ p + 1 }}</button>
    }

    <button
      class="page-btn"
      [disabled]="currentPage() >= totalPages() - 1"
      aria-label="Next page"
      (click)="goToPage(currentPage() + 1)"
    ><glint-icon name="chevronRight" /></button>
    <button
      class="page-btn"
      [disabled]="currentPage() >= totalPages() - 1"
      aria-label="Last page"
      (click)="goToPage(totalPages() - 1)"
    ><glint-icon name="chevronsRight" /></button>

    <span class="info">{{ first() + 1 }}–{{ Math.min(first() + rows(), totalRecords()) }} of {{ totalRecords() }}</span>
  `,
})
export class GlintPaginatorComponent {
  /** Total number of records */
  totalRecords = input(0);
  /** Number of records per page */
  rows = model(10);
  /** Index of the first record on the current page */
  first = model(0);
  /** Emitted on page change */
  pageChange = output<GlintPageEvent>();

  protected Math = Math;

  currentPage = computed(() => Math.floor(this.first() / this.rows()));

  totalPages = computed(() => {
    const rows = this.rows();
    return rows > 0 ? Math.ceil(this.totalRecords() / rows) : 0;
  });

  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const maxVisible = 5;
    let start = Math.max(0, current - Math.floor(maxVisible / 2));
    const end = Math.min(total, start + maxVisible);
    start = Math.max(0, end - maxVisible);
    const pages: number[] = [];
    for (let i = start; i < end; i++) pages.push(i);
    return pages;
  });

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages()) return;
    const newFirst = page * this.rows();
    this.first.set(newFirst);
    this.pageChange.emit({
      page,
      rows: this.rows(),
      first: newFirst,
      totalRecords: this.totalRecords(),
    });
  }
}
