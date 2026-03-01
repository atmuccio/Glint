import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  input,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  CdkVirtualScrollViewport,
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
} from '@angular/cdk/scrolling';

/**
 * Virtual scrolling wrapper that delegates to CDK's CdkVirtualScrollViewport.
 *
 * @example
 * ```html
 * <glint-scroller [items]="largeList" [itemSize]="48" scrollHeight="400px">
 *   <ng-template #item let-item>
 *     <div class="row">{{ item.name }}</div>
 *   </ng-template>
 * </glint-scroller>
 * ```
 */
@Component({
  selector: 'glint-scroller',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      color: var(--glint-color-text);
    }

    cdk-virtual-scroll-viewport {
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      background: var(--glint-color-surface);
    }

    .scroller-item {
      box-sizing: border-box;
    }
  `,
  template: `
    <cdk-virtual-scroll-viewport
      [itemSize]="itemSize()"
      [style.block-size]="scrollHeight()"
      [orientation]="orientation()"
    >
      <div *cdkVirtualFor="let item of items()" class="scroller-item">
        @if (itemTemplate()) {
          <ng-container [ngTemplateOutlet]="itemTemplate()!" [ngTemplateOutletContext]="{ $implicit: item }" />
        }
      </div>
    </cdk-virtual-scroll-viewport>
  `,
})
export class GlintScrollerComponent {
  /** Array of items to virtually scroll through */
  items = input.required<unknown[]>();
  /** Height in pixels for each item (required by CDK fixed-size strategy) */
  itemSize = input.required<number>();
  /** Height of the scroll container */
  scrollHeight = input('200px');
  /** Scroll orientation */
  orientation = input<'vertical' | 'horizontal'>('vertical');

  /** Template for rendering each item */
  itemTemplate = contentChild<TemplateRef<unknown>>('item');
}
