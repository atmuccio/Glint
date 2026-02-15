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
      color: var(--glint-color-primary-contrast);
      background: var(--glint-color-text);
      padding-block: var(--glint-spacing-xs);
      padding-inline: var(--glint-spacing-sm);
      border-radius: var(--glint-border-radius);
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
