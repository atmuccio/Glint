import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal,
} from '@angular/core';
import { CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import type { GlintMenuItem } from './menu-item.model';
import { GlintIconComponent } from '../icon/icon.component';

/**
 * Internal menu panel rendered inside the CDK overlay.
 * Uses CdkMenu + CdkMenuItem for keyboard navigation, focus management, and ARIA.
 * Not exported from the public API.
 */
@Component({
  selector: 'glint-menu-panel',
  standalone: true,
  imports: [CdkMenu, CdkMenuItem, GlintIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: contents;
    }

    .glint-menu {
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

    .menu-item:hover:not([aria-disabled="true"]) {
      background: color-mix(in oklch, var(--glint-color-primary), transparent 90%);
    }

    .menu-item:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: -2px;
    }

    .menu-item[aria-disabled="true"] {
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
    <div class="glint-menu" cdkMenu>
      @for (item of items(); track item.label) {
        <button
          [class]="'menu-item' + (item.styleClass ? ' ' + item.styleClass : '')"
          cdkMenuItem
          [cdkMenuItemDisabled]="item.disabled ?? false"
          (cdkMenuItemTriggered)="onItemClick(item)"
        >@if (item.icon) { <glint-icon [name]="item.icon" /> }{{ item.label }}</button>
        @if (item.separator) {
          <div class="separator" role="separator"></div>
        }
      }
    </div>
  `,
})
export class GlintMenuPanelComponent {
  items = signal<GlintMenuItem[]>([]);
  itemSelected = output<GlintMenuItem>();

  onItemClick(item: GlintMenuItem): void {
    if (item.disabled) return;
    this.itemSelected.emit(item);
  }
}
