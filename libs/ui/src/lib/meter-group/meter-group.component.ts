import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

/** Represents a single segment in the meter group. */
export interface GlintMeterItem {
  /** Label displayed in the legend. */
  label: string;
  /** Numeric value for this segment. */
  value: number;
  /** Optional CSS color. Falls back to a default palette color. */
  color?: string;
  /** Optional icon identifier (reserved for future use). */
  icon?: string;
}

/**
 * Default color palette for meter segments when no explicit color is provided.
 * Uses oklch values that harmonize with the Glint design system.
 */
const DEFAULT_COLORS = [
  'oklch(0.59 0.2 255)',   // blue
  'oklch(0.64 0.2 145)',   // green
  'oklch(0.7 0.18 55)',    // orange
  'oklch(0.55 0.22 305)',  // purple
  'oklch(0.65 0.15 195)',  // teal
  'oklch(0.65 0.22 350)',  // pink
  'oklch(0.78 0.18 85)',   // yellow
  'oklch(0.57 0.22 25)',   // red
];

/**
 * Multi-segment progress/meter bar. Data-driven via `GlintMeterItem[]`.
 *
 * @example
 * ```html
 * <glint-meter-group [value]="[
 *   { label: 'Used', value: 40, color: 'var(--glint-color-primary)' },
 *   { label: 'Free', value: 30 }
 * ]" />
 * ```
 */
@Component({
  selector: 'glint-meter-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-label-position]': 'labelPosition()',
  },
  styles: `
    :host {
      display: block;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
    }

    .meter-group {
      display: flex;
      flex-direction: column;
      gap: var(--glint-spacing-sm);
    }

    .meter-group.vertical {
      flex-direction: row;
      align-items: stretch;
    }

    /* ── Meter bar ──────────────────────────────── */
    .meter-bar {
      display: flex;
      overflow: hidden;
      border-radius: var(--glint-border-radius);
      block-size: 1.5rem;
      background: color-mix(in oklch, var(--glint-color-border), transparent 50%);
    }

    .vertical .meter-bar {
      flex-direction: column;
      block-size: auto;
      inline-size: 1.5rem;
      min-block-size: 8rem;
    }

    .meter-segment {
      transition: inline-size var(--glint-duration-normal) var(--glint-easing);
    }

    .vertical .meter-segment {
      transition: block-size var(--glint-duration-normal) var(--glint-easing);
    }

    /* ── Legend ─────────────────────────────────── */
    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: var(--glint-spacing-sm) var(--glint-spacing-md);
    }

    .vertical .legend {
      flex-direction: column;
    }

    .legend-item {
      display: inline-flex;
      align-items: center;
      gap: var(--glint-spacing-xs);
    }

    .legend-marker {
      display: inline-block;
      inline-size: 0.75rem;
      block-size: 0.75rem;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .legend-label {
      color: var(--glint-color-text);
    }

    .legend-value {
      color: var(--glint-color-text-muted);
      font-weight: 600;
    }
  `,
  template: `
    <div class="meter-group" [class]="orientation()">
      @if (labelPosition() === 'start') {
        <div class="legend">
          @for (item of value(); track item.label) {
            <div class="legend-item">
              <span class="legend-marker" [style.background]="itemColor($index)"></span>
              <span class="legend-label">{{ item.label }}</span>
              <span class="legend-value">{{ item.value }}%</span>
            </div>
          }
        </div>
      }
      <div
        class="meter-bar"
        role="meter"
        [attr.aria-valuemin]="0"
        [attr.aria-valuemax]="max()"
        [attr.aria-valuenow]="totalValue()"
      >
        @for (item of value(); track item.label) {
          <div
            class="meter-segment"
            [style.inline-size.%]="segmentPercent(item)"
            [style.background]="itemColor($index)"
            [attr.aria-label]="item.label + ': ' + item.value"
          ></div>
        }
      </div>
      @if (labelPosition() === 'end') {
        <div class="legend">
          @for (item of value(); track item.label) {
            <div class="legend-item">
              <span class="legend-marker" [style.background]="itemColor($index)"></span>
              <span class="legend-label">{{ item.label }}</span>
              <span class="legend-value">{{ item.value }}%</span>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class GlintMeterGroupComponent {
  /** Array of meter segments to display. */
  value = input.required<GlintMeterItem[]>();

  /** Maximum value the meter represents. */
  max = input(100);

  /** Layout orientation. */
  orientation = input<'horizontal' | 'vertical'>('horizontal');

  /** Position of the legend relative to the meter bar. */
  labelPosition = input<'start' | 'end'>('end');

  /** Sum of all segment values. */
  totalValue = computed(() =>
    this.value().reduce((sum, item) => sum + item.value, 0)
  );

  /** The default color palette for segments without an explicit color. */
  readonly defaultColors = DEFAULT_COLORS;

  /** Returns the color for a segment at the given index. */
  itemColor(index: number): string {
    return this.value()[index]?.color || this.defaultColors[index % this.defaultColors.length];
  }

  /** Returns the percentage width for a segment. */
  segmentPercent(item: GlintMeterItem): number {
    return (item.value / this.max()) * 100;
  }
}
