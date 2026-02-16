import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

/**
 * Divider component for visual separation with optional label.
 *
 * @example
 * ```html
 * <glint-divider />
 * <glint-divider label="OR" />
 * <glint-divider orientation="vertical" />
 * ```
 */
@Component({
  selector: 'glint-divider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'separator',
    '[attr.aria-orientation]': 'orientation()',
    '[attr.data-orientation]': 'orientation()',
  },
  styles: `
    :host {
      display: flex;
      align-items: center;
      font-family: var(--glint-font-family);
      font-size: 0.875rem;
      color: var(--glint-color-text-muted);
    }

    :host([data-orientation="horizontal"]) {
      flex-direction: row;
      inline-size: 100%;
      margin-block: var(--glint-spacing-md);
    }

    :host([data-orientation="vertical"]) {
      flex-direction: column;
      block-size: 100%;
      margin-inline: var(--glint-spacing-md);
    }

    .line {
      flex: 1;
      background: var(--glint-color-border);
    }

    :host([data-orientation="horizontal"]) .line {
      block-size: 1px;
      min-inline-size: 1rem;
    }

    :host([data-orientation="vertical"]) .line {
      inline-size: 1px;
      min-block-size: 1rem;
    }

    .label {
      padding-inline: var(--glint-spacing-sm);
    }

    :host([data-orientation="vertical"]) .label {
      padding-inline: 0;
      padding-block: var(--glint-spacing-sm);
    }
  `,
  template: `
    <span class="line"></span>
    @if (label()) {
      <span class="label">{{ label() }}</span>
      <span class="line"></span>
    }
  `,
})
export class GlintDividerComponent {
  /** Orientation */
  orientation = input<'horizontal' | 'vertical'>('horizontal');
  /** Optional label text displayed in the center of the divider */
  label = input('');
}
