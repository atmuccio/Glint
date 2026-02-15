import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { CdkTrapFocus } from '@angular/cdk/a11y';

/**
 * Internal dialog container that wraps dialog content.
 * Provides focus trap, role="dialog", and aria-modal.
 */
@Component({
  selector: 'glint-dialog-container',
  standalone: true,
  imports: [CdkTrapFocus],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'dialog',
    'aria-modal': 'true',
  },
  styles: `
    :host {
      display: block;
      background: var(--glint-color-surface);
      color: var(--glint-color-text);
      border: 1px solid var(--glint-color-border);
      border-radius: 12px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      padding: var(--glint-spacing-lg);
      outline: none;
      max-block-size: 90vh;
      overflow: auto;
      transition:
        background-color var(--glint-duration-normal) var(--glint-easing),
        color var(--glint-duration-normal) var(--glint-easing);
    }
  `,
  template: `
    <div cdkTrapFocus [cdkTrapFocusAutoCapture]="true">
      <ng-template #outlet />
    </div>
  `,
})
export class GlintDialogContainerComponent {
  @ViewChild('outlet', { read: ViewContainerRef, static: true })
  outlet!: ViewContainerRef;
}
