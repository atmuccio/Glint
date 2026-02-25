import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CdkStepHeader } from '@angular/cdk/stepper';

/**
 * Step header button used inside the stepper.
 * Extends CdkStepHeader to participate in CdkStepper's FocusKeyManager
 * for keyboard navigation (Arrow keys, Home, End, Enter, Space).
 */
@Component({
  selector: 'glint-step-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CdkStepHeader, useExisting: GlintStepHeaderComponent }],
  host: {
    'class': 'glint-step-header',
    '[class.active]': 'active()',
    '[class.complete]': 'complete() && !hasError()',
    '[class.error]': 'hasError()',
    '[attr.id]': '"glint-step-label-" + index()',
    '[attr.aria-selected]': 'active()',
    '[attr.aria-controls]': '"glint-step-content-" + index()',
    '[attr.tabindex]': 'active() ? 0 : -1',
    'role': 'tab',
  },
  styles: `
    .glint-step-header {
      display: flex;
      align-items: center;
      gap: var(--glint-spacing-sm);
      cursor: pointer;
      padding-block: var(--glint-spacing-xs);
      padding-inline: var(--glint-spacing-sm);
      border: none;
      background: transparent;
      font: inherit;
      color: var(--glint-color-text-muted);
      transition: color var(--glint-duration-fast) var(--glint-easing);
    }
    .glint-step-header:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: 2px;
    }
    .glint-step-header.active {
      color: var(--glint-color-primary);
    }
    .glint-step-header.complete {
      color: var(--glint-color-success);
    }
    .glint-step-header .step-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 1.75rem;
      block-size: 1.75rem;
      border-radius: 50%;
      border: 2px solid currentColor;
      font-weight: 600;
      font-size: 0.875rem;
      flex-shrink: 0;
      transition:
        background-color var(--glint-duration-fast) var(--glint-easing),
        border-color var(--glint-duration-fast) var(--glint-easing),
        color var(--glint-duration-fast) var(--glint-easing);
    }
    .glint-step-header.active .step-number {
      background: var(--glint-color-primary);
      color: var(--glint-color-primary-contrast);
      border-color: var(--glint-color-primary);
    }
    .glint-step-header.complete .step-number {
      background: var(--glint-color-success);
      color: var(--glint-color-primary-contrast);
      border-color: var(--glint-color-success);
    }
    .glint-step-header:not(.active):hover {
      color: var(--glint-color-text);
    }
    .glint-step-header.error {
      color: var(--glint-color-error);
    }
    .glint-step-header.error:not(.active):hover {
      color: var(--glint-color-error);
    }
    .glint-step-header.error .step-number {
      background: var(--glint-color-error);
      color: var(--glint-color-primary-contrast);
      border-color: var(--glint-color-error);
    }
    .glint-step-header .step-label {
      font-weight: 500;
      white-space: nowrap;
    }
    .glint-step-header .step-optional {
      font-weight: 400;
      font-size: 0.75rem;
      color: var(--glint-color-text-muted);
    }
  `,
  template: `
    <span class="step-number">
      @if (hasError()) {
        &#9888;
      } @else if (complete()) {
        &#10003;
      } @else {
        {{ index() + 1 }}
      }
    </span>
    <span class="step-label">
      <ng-content />
      @if (optional()) {
        <span class="step-optional"> (Optional)</span>
      }
    </span>
  `,
})
export class GlintStepHeaderComponent extends CdkStepHeader {
  /** Zero-based index of this step. */
  index = input.required<number>();
  /** Whether this step is the currently active step. */
  active = input(false);
  /** Whether this step has been completed. */
  complete = input(false);
  /** Whether this step is optional. */
  optional = input(false);
  /** Whether this step has a validation error. */
  hasError = input(false);
}
