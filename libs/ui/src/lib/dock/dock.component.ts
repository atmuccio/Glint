import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import type { GlintMenuItem } from '../menu/menu-item.model';

/**
 * macOS-style dock component. Data-driven icon bar with hover magnification.
 *
 * @example
 * ```html
 * <glint-dock [items]="dockItems" position="bottom" />
 * ```
 */
@Component({
  selector: 'glint-dock',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'style': 'display: block',
  },
  styles: `
    :host {
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
    }

    .dock {
      display: inline-flex;
      align-items: center;
      gap: var(--glint-spacing-xs);
      padding: var(--glint-spacing-sm);
      background: color-mix(in oklch, var(--glint-color-surface), transparent 20%);
      backdrop-filter: blur(10px);
      border-radius: var(--glint-border-radius);
      border: 1px solid var(--glint-color-border);
    }

    .dock.left,
    .dock.right {
      flex-direction: column;
    }

    .dock-item {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 3rem;
      block-size: 3rem;
      border-radius: 50%;
      border: none;
      background: var(--glint-color-surface-variant);
      color: var(--glint-color-text);
      font: inherit;
      font-size: 1.25rem;
      cursor: pointer;
      transition: transform var(--glint-duration-fast) var(--glint-easing);
    }

    .dock-item:hover:not(.disabled) {
      transform: scale(1.3);
    }

    .dock-item:hover:not(.disabled) + .dock-item:not(.disabled) {
      transform: scale(1.1);
    }

    .dock-item:has(+ .dock-item:hover:not(.disabled)):not(.disabled) {
      transform: scale(1.1);
    }

    .dock-item:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: 2px;
    }

    .dock-item.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .dock-icon {
      pointer-events: none;
    }

    .dock-tooltip {
      position: absolute;
      inset-block-end: calc(100% + 0.5rem);
      inset-inline-start: 50%;
      transform: translateX(-50%);
      padding-block: var(--glint-spacing-xs);
      padding-inline: var(--glint-spacing-sm);
      background: var(--glint-color-surface);
      color: var(--glint-color-text);
      font-size: 0.75rem;
      white-space: nowrap;
      border-radius: var(--glint-border-radius);
      box-shadow: 0 2px 8px rgb(0 0 0 / 0.15);
      pointer-events: none;
      opacity: 0;
      transition: opacity var(--glint-duration-fast) var(--glint-easing);
    }

    .dock-item:hover:not(.disabled) .dock-tooltip {
      opacity: 1;
    }

    /* Position-aware tooltip placement */
    .top .dock-tooltip {
      inset-block-end: auto;
      inset-block-start: calc(100% + 0.5rem);
    }

    .left .dock-tooltip {
      inset-block-end: auto;
      inset-inline-start: calc(100% + 0.5rem);
      transform: translateY(-50%);
      inset-block-start: 50%;
    }

    .right .dock-tooltip {
      inset-block-end: auto;
      inset-inline-start: auto;
      inset-inline-end: calc(100% + 0.5rem);
      transform: translateY(-50%);
      inset-block-start: 50%;
    }
  `,
  template: `
    <div class="dock" [class]="position()" role="menu">
      @for (item of items(); track item.label) {
        <button
          class="dock-item"
          role="menuitem"
          [attr.aria-label]="item.label"
          [class.disabled]="item.disabled"
          [attr.aria-disabled]="item.disabled || null"
          (click)="onItemClick(item)"
        >
          <span class="dock-icon">{{ item.icon || item.label.charAt(0) }}</span>
          <span class="dock-tooltip">{{ item.label }}</span>
        </button>
      }
    </div>
  `,
})
export class GlintDockComponent {
  /** Dock items to display */
  items = input.required<GlintMenuItem[]>();

  /** Position of the dock */
  position = input<'bottom' | 'top' | 'left' | 'right'>('bottom');

  /** Handle item click */
  onItemClick(item: GlintMenuItem): void {
    if (item.disabled) return;
    item.command?.();
  }
}
