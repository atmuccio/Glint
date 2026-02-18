import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from '@angular/core';
import type { GlintMenuItem } from '../menu/menu-item.model';

/**
 * Floating action button that reveals action items in a radial or linear pattern.
 *
 * @example
 * ```html
 * <glint-speed-dial [items]="actions" direction="up" />
 *
 * <glint-speed-dial [items]="actions" type="circle" [radius]="100" />
 * ```
 */
@Component({
  selector: 'glint-speed-dial',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'style': 'display: inline-block; position: relative',
  },
  styles: `
    .speed-dial-trigger {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 3.5rem;
      block-size: 3.5rem;
      border-radius: 50%;
      border: none;
      background: var(--glint-color-primary);
      color: var(--glint-color-primary-contrast);
      font-size: 1.5rem;
      font-family: var(--glint-font-family);
      cursor: pointer;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.15), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
      transition:
        background-color var(--glint-duration-fast) var(--glint-easing),
        box-shadow var(--glint-duration-fast) var(--glint-easing);
      position: relative;
      z-index: 1;
    }

    .speed-dial-trigger:hover:not(.disabled) {
      background: color-mix(in oklch, var(--glint-color-primary), white 15%);
      box-shadow: 0 6px 10px -2px rgba(0, 0, 0, 0.2), 0 3px 6px -3px rgba(0, 0, 0, 0.15);
    }

    .speed-dial-trigger:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: 2px;
    }

    .speed-dial-trigger.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    .trigger-icon {
      display: inline-block;
      line-height: 1;
      transition: transform var(--glint-duration-fast) var(--glint-easing);
    }

    .trigger-icon.rotated {
      transform: rotate(45deg);
    }

    .speed-dial-items {
      position: absolute;
      z-index: 0;
    }

    .speed-dial-items.up {
      inset-block-end: 0;
      inset-inline-start: 50%;
      transform: translateX(-50%);
    }

    .speed-dial-items.down {
      inset-block-start: 0;
      inset-inline-start: 50%;
      transform: translateX(-50%);
    }

    .speed-dial-items.left {
      inset-block-start: 50%;
      inset-inline-end: 0;
      transform: translateY(-50%);
    }

    .speed-dial-items.right {
      inset-block-start: 50%;
      inset-inline-start: 0;
      transform: translateY(-50%);
    }

    .speed-dial-item {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 2.5rem;
      block-size: 2.5rem;
      border-radius: 50%;
      border: none;
      background: var(--glint-color-surface);
      color: var(--glint-color-text);
      font-size: 0.875rem;
      font-family: var(--glint-font-family);
      cursor: pointer;
      box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.15), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
      position: absolute;
      transition:
        transform var(--glint-duration-fast) var(--glint-easing),
        opacity var(--glint-duration-fast) var(--glint-easing),
        background-color var(--glint-duration-fast) var(--glint-easing);
    }

    .speed-dial-item:hover:not(.disabled) {
      background: color-mix(in oklch, var(--glint-color-surface), var(--glint-color-primary) 10%);
    }

    .speed-dial-item:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: 2px;
    }

    .speed-dial-item.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    .item-tooltip {
      position: absolute;
      white-space: nowrap;
      background: var(--glint-color-text);
      color: var(--glint-color-surface);
      font-family: var(--glint-font-family);
      font-size: 0.75rem;
      padding-block: 0.25rem;
      padding-inline: 0.5rem;
      border-radius: var(--glint-border-radius);
      pointer-events: none;
      opacity: 0;
      transition: opacity var(--glint-duration-fast) var(--glint-easing);
    }

    .speed-dial-item:hover + .item-tooltip {
      opacity: 1;
    }
  `,
  template: `
    @if (visible()) {
      <button
        class="speed-dial-trigger"
        [class.open]="isOpen()"
        [class.disabled]="disabled()"
        [attr.aria-expanded]="isOpen()"
        aria-label="Speed dial"
        (click)="toggle()"
        type="button"
      >
        <span class="trigger-icon" [class.rotated]="isOpen()">+</span>
      </button>
      @if (isOpen()) {
        <div class="speed-dial-items" [class]="direction()">
          @for (item of visibleItems(); track item.label; let i = $index) {
            <button
              class="speed-dial-item"
              [class.disabled]="item.disabled"
              [attr.aria-label]="item.label"
              role="menuitem"
              [style]="getItemStyle(i)"
              (click)="onItemClick(item)"
              type="button"
            >
              <span class="item-icon">{{ item.icon || item.label.charAt(0) }}</span>
            </button>
            <span class="item-tooltip" [style]="getTooltipStyle(i)">{{ item.label }}</span>
          }
        </div>
      }
    }
  `,
})
export class GlintSpeedDialComponent {
  /** Action items to display */
  items = input.required<GlintMenuItem[]>();
  /** Direction for linear layout */
  direction = input<'up' | 'down' | 'left' | 'right'>('up');
  /** Layout type */
  type = input<'linear' | 'circle' | 'semi-circle'>('linear');
  /** Pixel radius for circle/semi-circle layout */
  radius = input(80);
  /** Disabled state */
  disabled = input(false);
  /** Visibility of the FAB */
  visible = input(true);
  /** Two-way bindable open state */
  isOpen = model(false);

  /** Visible items (filter out items with visible === false) */
  visibleItems = computed(() => this.items().filter(item => item.visible !== false));

  toggle(): void {
    if (this.disabled()) return;
    this.isOpen.set(!this.isOpen());
  }

  onItemClick(item: GlintMenuItem): void {
    if (item.disabled) return;
    item.command?.();
    this.isOpen.set(false);
  }

  getItemStyle(index: number): Record<string, string> {
    const layoutType = this.type();
    const dir = this.direction();
    const itemSize = 60; // spacing for linear layout

    if (layoutType === 'linear') {
      return this.getLinearStyle(index, dir, itemSize);
    } else if (layoutType === 'circle') {
      return this.getCircleStyle(index);
    } else {
      return this.getSemiCircleStyle(index);
    }
  }

  getTooltipStyle(index: number): Record<string, string> {
    const layoutType = this.type();
    const dir = this.direction();
    const itemSize = 60;
    const tooltipOffset = 36; // offset from item center for tooltip

    if (layoutType === 'linear') {
      const pos = (index + 1) * itemSize;
      switch (dir) {
        case 'up':
          return { bottom: pos + 'px', right: tooltipOffset + 'px' };
        case 'down':
          return { top: pos + 'px', right: tooltipOffset + 'px' };
        case 'left':
          return { right: pos + 'px', bottom: tooltipOffset + 'px' };
        case 'right':
          return { left: pos + 'px', bottom: tooltipOffset + 'px' };
      }
    }

    // For circle/semi-circle, position tooltip next to item
    const itemStyle = layoutType === 'circle'
      ? this.getCircleStyle(index)
      : this.getSemiCircleStyle(index);

    return {
      ...itemStyle,
      transform: 'translateX(3rem)',
    };
  }

  private getLinearStyle(index: number, dir: string, itemSize: number): Record<string, string> {
    const pos = (index + 1) * itemSize;
    const transitionDelay = (index * 30) + 'ms';
    const halfItem = '-1.25rem'; // center the 2.5rem item

    switch (dir) {
      case 'up':
        return { bottom: pos + 'px', left: '50%', marginLeft: halfItem, transitionDelay };
      case 'down':
        return { top: pos + 'px', left: '50%', marginLeft: halfItem, transitionDelay };
      case 'left':
        return { right: pos + 'px', top: '50%', marginTop: halfItem, transitionDelay };
      case 'right':
        return { left: pos + 'px', top: '50%', marginTop: halfItem, transitionDelay };
      default:
        return {};
    }
  }

  private getCircleStyle(index: number): Record<string, string> {
    const items = this.visibleItems();
    const total = items.length;
    const r = this.radius();
    const angle = (2 * Math.PI * index) / total - Math.PI / 2;
    const x = Math.round(Math.cos(angle) * r);
    const y = Math.round(Math.sin(angle) * r);
    const transitionDelay = (index * 30) + 'ms';

    return {
      left: `calc(50% + ${x}px - 1.25rem)`,
      top: `calc(50% + ${y}px - 1.25rem)`,
      transitionDelay,
    };
  }

  private getSemiCircleStyle(index: number): Record<string, string> {
    const items = this.visibleItems();
    const total = items.length;
    const r = this.radius();
    const dir = this.direction();
    const transitionDelay = (index * 30) + 'ms';

    // Spread items across 180 degrees based on direction
    let startAngle: number;
    switch (dir) {
      case 'up':
        startAngle = Math.PI; // 180 to 0 (left to right, going up)
        break;
      case 'down':
        startAngle = 0; // 0 to 180 (left to right, going down)
        break;
      case 'left':
        startAngle = -Math.PI / 2; // -90 to 90
        break;
      case 'right':
        startAngle = Math.PI / 2; // 90 to 270
        break;
      default:
        startAngle = Math.PI;
    }

    const step = total > 1 ? Math.PI / (total - 1) : 0;
    const angle = startAngle + step * index;
    const x = Math.round(Math.cos(angle) * r);
    const y = Math.round(Math.sin(angle) * r);

    return {
      left: `calc(50% + ${x}px - 1.25rem)`,
      top: `calc(50% + ${y}px - 1.25rem)`,
      transitionDelay,
    };
  }
}
