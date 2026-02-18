import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  input,
  model,
  output,
} from '@angular/core';

/**
 * Marker directive for the display slot of Inplace.
 *
 * @example
 * ```html
 * <span glintInplaceDisplay>Click to edit</span>
 * ```
 */
@Directive({
  selector: '[glintInplaceDisplay]',
  standalone: true,
})
export class GlintInplaceDisplayDirective {}

/**
 * Marker directive for the content/edit slot of Inplace.
 *
 * @example
 * ```html
 * <input glintInplaceContent type="text" />
 * ```
 */
@Directive({
  selector: '[glintInplaceContent]',
  standalone: true,
})
export class GlintInplaceContentDirective {}

/**
 * Inplace component that toggles between display and edit content.
 *
 * @example
 * ```html
 * <glint-inplace [closable]="true">
 *   <span glintInplaceDisplay>Click to edit</span>
 *   <input glintInplaceContent type="text" value="Hello" />
 * </glint-inplace>
 * ```
 */
@Component({
  selector: 'glint-inplace',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'style': 'display: block',
    '[class.disabled]': 'disabled()',
  },
  styles: `
    :host {
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
    }

    :host(.disabled) {
      opacity: 0.5;
      pointer-events: none;
    }

    .display {
      display: inline-block;
      cursor: pointer;
      padding-block: var(--glint-spacing-xs);
      padding-inline: var(--glint-spacing-sm);
      border-radius: var(--glint-border-radius);
      color: var(--glint-color-text);
      transition: background-color var(--glint-duration-fast) var(--glint-easing);
    }
    .display:hover {
      background: color-mix(in oklch, var(--glint-color-primary) 10%, transparent);
    }
    .display:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: 2px;
    }

    .content {
      display: inline-flex;
      align-items: center;
      gap: var(--glint-spacing-xs);
    }

    .close-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 1.5rem;
      block-size: 1.5rem;
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      background: var(--glint-color-surface);
      color: var(--glint-color-text);
      cursor: pointer;
      font-size: 0.75rem;
      line-height: 1;
      transition: background-color var(--glint-duration-fast) var(--glint-easing);
    }
    .close-btn:hover {
      background: color-mix(in oklch, var(--glint-color-danger) 15%, var(--glint-color-surface));
    }
    .close-btn:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: 2px;
    }
  `,
  template: `
    @if (!active()) {
      <div
        class="display"
        (click)="onActivate()"
        tabindex="0"
        (keydown.enter)="onActivate()"
        role="button"
      >
        <ng-content select="[glintInplaceDisplay]" />
      </div>
    } @else {
      <div class="content">
        <ng-content select="[glintInplaceContent]" />
        @if (closable()) {
          <button
            class="close-btn"
            type="button"
            aria-label="Close"
            (click)="onDeactivate()"
          >&#10005;</button>
        }
      </div>
    }
  `,
})
export class GlintInplaceComponent {
  /** Whether the edit content is active (two-way bindable) */
  active = model(false);
  /** Disable toggling */
  disabled = input(false);
  /** Show close button in edit mode */
  closable = input(false);

  /** Emitted when switching to edit mode */
  activate = output<void>();
  /** Emitted when switching back to display mode */
  deactivate = output<void>();

  onActivate(): void {
    if (this.disabled()) return;
    this.active.set(true);
    this.activate.emit();
  }

  onDeactivate(): void {
    this.active.set(false);
    this.deactivate.emit();
  }
}
