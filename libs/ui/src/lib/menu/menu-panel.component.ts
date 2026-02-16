import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  output,
  signal,
  viewChildren,
} from '@angular/core';
import type { GlintMenuItem } from './menu-item.model';

/**
 * Internal menu panel rendered inside the CDK overlay.
 * Not exported from the public API.
 */
@Component({
  selector: 'glint-menu-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'menu',
    '(keydown)': 'onKeydown($event)',
  },
  styles: `
    :host {
      display: block;
      min-inline-size: 12rem;
      padding-block: var(--glint-spacing-xs);
      background: var(--glint-color-surface);
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      box-shadow: var(--glint-shadow);
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      outline: none;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: var(--glint-spacing-sm);
      inline-size: 100%;
      border: none;
      background: transparent;
      color: var(--glint-color-text);
      font: inherit;
      padding-block: var(--glint-spacing-sm);
      padding-inline: var(--glint-spacing-md);
      cursor: pointer;
      text-align: start;
      transition: background-color var(--glint-duration-fast) var(--glint-easing);
    }

    .menu-item:hover:not(.disabled) {
      background: color-mix(in oklch, var(--glint-color-primary), transparent 90%);
    }

    .menu-item:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: -2px;
    }

    .menu-item.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .separator {
      block-size: 1px;
      background: var(--glint-color-border);
      margin-block: var(--glint-spacing-xs);
    }
  `,
  template: `
    @for (item of items(); track item.label) {
      <button
        #itemEl
        class="menu-item"
        [class.disabled]="item.disabled"
        role="menuitem"
        [attr.aria-disabled]="item.disabled || null"
        [tabindex]="item.disabled ? -1 : 0"
        (click)="onItemClick(item)"
      >{{ item.label }}</button>
      @if (item.separator) {
        <div class="separator" role="separator"></div>
      }
    }
  `,
})
export class GlintMenuPanelComponent {
  items = signal<GlintMenuItem[]>([]);
  itemSelected = output<GlintMenuItem>();

  private itemEls = viewChildren<ElementRef<HTMLButtonElement>>('itemEl');

  onItemClick(item: GlintMenuItem): void {
    if (item.disabled) return;
    this.itemSelected.emit(item);
  }

  onKeydown(event: KeyboardEvent): void {
    const els = this.itemEls().map(e => e.nativeElement);
    const current = els.indexOf(document.activeElement as HTMLButtonElement);

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const next = this.findNext(current, 1, els);
      if (next >= 0) els[next].focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const next = this.findNext(current, -1, els);
      if (next >= 0) els[next].focus();
    } else if (event.key === 'Home') {
      event.preventDefault();
      const next = this.findNext(-1, 1, els);
      if (next >= 0) els[next].focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      const next = this.findNext(els.length, -1, els);
      if (next >= 0) els[next].focus();
    }
  }

  private findNext(from: number, dir: 1 | -1, els: HTMLButtonElement[]): number {
    let i = from + dir;
    while (i >= 0 && i < els.length) {
      if (!els[i].classList.contains('disabled')) return i;
      i += dir;
    }
    return -1;
  }
}
