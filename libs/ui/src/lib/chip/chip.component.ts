import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { GlintIconComponent } from '../icon/icon.component';

/**
 * Chip component for compact elements like tags in an input field.
 *
 * @example
 * ```html
 * <glint-chip>Angular</glint-chip>
 * <glint-chip [removable]="true" (removed)="onRemove()">React</glint-chip>
 * <glint-chip image="/avatar.jpg">John</glint-chip>
 * ```
 */
@Component({
  selector: 'glint-chip',
  standalone: true,
  imports: [GlintIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--glint-spacing-xs);
      font-family: var(--glint-font-family);
      font-size: 0.875rem;
      line-height: 1.25;
      padding-block: 0.25rem;
      padding-inline: 0.75rem;
      border-radius: 9999px;
      background: var(--glint-color-surface-variant);
      color: var(--glint-color-text);
      border: 1px solid var(--glint-color-border);
      white-space: nowrap;
    }

    .chip-image {
      inline-size: 1.25rem;
      block-size: 1.25rem;
      border-radius: 50%;
      object-fit: cover;
      margin-inline-start: -0.375rem;
    }

    .remove {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 1rem;
      block-size: 1rem;
      border: none;
      border-radius: 50%;
      background: transparent;
      color: inherit;
      cursor: pointer;
      font-size: 0.75rem;
      line-height: 1;
      opacity: 0.6;
      margin-inline-end: -0.25rem;
      transition: opacity var(--glint-duration-fast) var(--glint-easing);
    }
    .remove:hover { opacity: 1; }
    .remove:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: 1px;
    }
  `,
  template: `
    @if (image()) {
      <img class="chip-image" [src]="image()" alt="" />
    }
    <ng-content />
    @if (removable()) {
      <button class="remove" type="button" aria-label="Remove" (click)="removed.emit()"><glint-icon name="x" /></button>
    }
  `,
})
export class GlintChipComponent {
  /** Image URL shown before label */
  image = input('');
  /** Show remove button */
  removable = input(false);
  /** Emitted when remove button is clicked */
  removed = output<void>();
}
