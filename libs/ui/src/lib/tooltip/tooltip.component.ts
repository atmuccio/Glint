import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Internal tooltip panel rendered inside the overlay.
 */
@Component({
  selector: 'glint-tooltip-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
      font-family: var(--glint-font-family);
      font-size: 0.8125rem;
      line-height: 1.4;
      color: var(--glint-color-surface);
      background: var(--glint-color-text);
      padding: var(--glint-spacing-sm);
      border-radius: var(--glint-border-radius);
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      max-inline-size: 200px;
      word-wrap: break-word;
      pointer-events: none;
    }
  `,
  template: `{{ message }}`,
})
export class GlintTooltipPanelComponent {
  message = '';
}
