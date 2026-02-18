import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

/**
 * Overlay badge that positions a badge absolutely over its projected content.
 *
 * @example
 * ```html
 * <glint-overlay-badge [value]="3" severity="danger">
 *   <button>Notifications</button>
 * </glint-overlay-badge>
 * ```
 */
@Component({
  selector: 'glint-overlay-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    style: 'display: inline-flex',
  },
  styles: `
    .overlay-badge-wrapper {
      position: relative;
      display: inline-flex;
    }

    .overlay-badge {
      position: absolute;
      inset-block-start: 0;
      inset-inline-end: 0;
      transform: translate(50%, -50%);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: var(--glint-font-family);
      font-weight: 700;
      line-height: 1;
      white-space: nowrap;
      border-radius: 9999px;
      box-sizing: border-box;
    }

    /* Size: normal */
    .overlay-badge[data-size="normal"] {
      font-size: 0.75rem;
      min-inline-size: 1.25rem;
      min-block-size: 1.25rem;
      padding-inline: 0.25rem;
    }

    /* Size: large */
    .overlay-badge[data-size="large"] {
      font-size: 0.875rem;
      min-inline-size: 1.5rem;
      min-block-size: 1.5rem;
      padding-inline: 0.375rem;
    }

    /* Size: xlarge */
    .overlay-badge[data-size="xlarge"] {
      font-size: 1rem;
      min-inline-size: 2rem;
      min-block-size: 2rem;
      padding-inline: 0.5rem;
    }

    /* Severity: primary */
    .overlay-badge[data-severity="primary"] {
      background: var(--glint-color-primary);
      color: var(--glint-color-primary-contrast);
    }

    /* Severity: success */
    .overlay-badge[data-severity="success"] {
      background: var(--glint-color-success);
      color: white;
    }

    /* Severity: info */
    .overlay-badge[data-severity="info"] {
      background: var(--glint-color-info);
      color: white;
    }

    /* Severity: warn */
    .overlay-badge[data-severity="warn"] {
      background: var(--glint-color-warning);
      color: white;
    }

    /* Severity: danger */
    .overlay-badge[data-severity="danger"] {
      background: var(--glint-color-error);
      color: white;
    }
  `,
  template: `
    <div class="overlay-badge-wrapper">
      <ng-content />
      @if (visible()) {
        <span
          class="overlay-badge"
          [attr.data-severity]="severity()"
          [attr.data-size]="size()"
        >{{ value() }}</span>
      }
    </div>
  `,
})
export class GlintOverlayBadgeComponent {
  /** Badge content */
  value = input<string | number>('');
  /** Color severity */
  severity = input<'primary' | 'success' | 'info' | 'warn' | 'danger'>('primary');
  /** Badge size */
  size = input<'normal' | 'large' | 'xlarge'>('normal');

  /** Whether the badge should be visible */
  protected visible = computed(() => {
    const v = this.value();
    return v !== '' && v !== null && v !== undefined;
  });
}
