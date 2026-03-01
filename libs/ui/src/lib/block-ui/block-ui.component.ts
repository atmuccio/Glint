import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

/**
 * Blocking overlay that masks its projected content.
 *
 * @example
 * ```html
 * <glint-block-ui [blocked]="isLoading">
 *   <p>Content that gets blocked during loading</p>
 * </glint-block-ui>
 * ```
 */
@Component({
  selector: 'glint-block-ui',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    style: 'display: block',
  },
  styles: `
    .block-ui-container {
      position: relative;
    }

    .block-ui-mask {
      position: absolute;
      inset: 0;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--glint-spacing-sm);
      background: color-mix(in oklch, var(--glint-color-surface), transparent 40%);
      transition: opacity var(--glint-duration-normal) var(--glint-easing);
    }

    .block-ui-spinner {
      inline-size: 2rem;
      block-size: 2rem;
      border: 3px solid var(--glint-color-border);
      border-block-start-color: var(--glint-color-primary);
      border-radius: 50%;
      animation: glint-block-ui-spin 0.8s linear infinite;
    }

    .block-ui-message {
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      color: var(--glint-color-text);
      font-weight: 600;
    }

    @keyframes glint-block-ui-spin {
      to { rotate: 360deg; }
    }
  `,
  template: `
    <div class="block-ui-container">
      <ng-content />
      @if (blocked()) {
        <div class="block-ui-mask">
          <div class="block-ui-spinner"></div>
          @if (message()) {
            <span class="block-ui-message">{{ message() }}</span>
          }
        </div>
      }
    </div>
  `,
})
export class GlintBlockUiComponent {
  /** Whether the UI is blocked */
  blocked = input(false);
  /** Optional message to show on the mask */
  message = input('');
}
