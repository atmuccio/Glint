import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

/** Breadcrumb item model */
export interface GlintBreadcrumbItem {
  /** Display label */
  label: string;
  /** Optional URL for router navigation */
  url?: string;
  /** Optional icon identifier */
  icon?: string;
}

/**
 * Breadcrumb navigation component.
 *
 * @example
 * ```html
 * <glint-breadcrumb [items]="[
 *   { label: 'Home', url: '/' },
 *   { label: 'Products', url: '/products' },
 *   { label: 'Widget' }
 * ]" />
 * ```
 */
@Component({
  selector: 'glint-breadcrumb',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'navigation',
    'aria-label': 'Breadcrumb',
  },
  styles: `
    :host {
      display: block;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
    }

    ol {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--glint-spacing-xs);
      list-style: none;
      margin: 0;
      padding: 0;
    }

    li {
      display: inline-flex;
      align-items: center;
      gap: var(--glint-spacing-xs);
    }

    a {
      color: var(--glint-color-primary);
      text-decoration: none;
      transition: color var(--glint-duration-fast) var(--glint-easing);
    }

    a:hover {
      color: color-mix(in oklch, var(--glint-color-primary), black 15%);
      text-decoration: underline;
    }

    a:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: 2px;
      border-radius: 2px;
    }

    .current {
      color: var(--glint-color-text-muted);
    }

    .separator {
      color: var(--glint-color-text-muted);
      user-select: none;
    }
  `,
  template: `
    <ol>
      @for (item of items(); track item.label; let last = $last) {
        <li>
          @if (!last && item.url) {
            <a
              [href]="item.url"
              (click)="onItemClick($event, item)"
            >{{ item.label }}</a>
          } @else {
            <span class="current" [attr.aria-current]="last ? 'page' : null">{{ item.label }}</span>
          }
          @if (!last) {
            <span class="separator" aria-hidden="true">{{ separator() }}</span>
          }
        </li>
      }
    </ol>
  `,
})
export class GlintBreadcrumbComponent {
  /** Breadcrumb items */
  items = input.required<GlintBreadcrumbItem[]>();
  /** Separator character */
  separator = input('/');
  /** Emitted when a breadcrumb link is clicked. Prevents default navigation. */
  itemClick = output<GlintBreadcrumbItem>();

  protected onItemClick(event: MouseEvent, item: GlintBreadcrumbItem): void {
    event.preventDefault();
    this.itemClick.emit(item);
  }
}
