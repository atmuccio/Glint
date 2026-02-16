import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';

/**
 * Fieldset with legend and optional collapse toggle.
 *
 * @example
 * ```html
 * <glint-fieldset legend="Personal Info" [toggleable]="true">
 *   <p>Form fields here…</p>
 * </glint-fieldset>
 * ```
 */
@Component({
  selector: 'glint-fieldset',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
    }

    fieldset {
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      padding: var(--glint-spacing-md);
      margin: 0;
    }

    legend {
      font-weight: 600;
      color: var(--glint-color-text);
      padding-inline: var(--glint-spacing-xs);
    }

    .toggle {
      display: inline-flex;
      align-items: center;
      gap: var(--glint-spacing-xs);
      border: none;
      background: transparent;
      font: inherit;
      font-weight: 600;
      color: var(--glint-color-text);
      cursor: pointer;
      padding-inline: var(--glint-spacing-xs);
    }
    .toggle:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: 2px;
    }

    .chevron {
      font-size: 0.75em;
      transition: rotate var(--glint-duration-fast) var(--glint-easing);
    }
    .chevron.collapsed {
      rotate: -90deg;
    }

    .content {
      color: var(--glint-color-text);
    }
  `,
  template: `
    <fieldset>
      <legend>
        @if (toggleable()) {
          <button
            class="toggle"
            type="button"
            [attr.aria-expanded]="!collapsed()"
            (click)="toggle()"
          >
            <span class="chevron" [class.collapsed]="collapsed()">&#9660;</span>
            {{ legend() }}
          </button>
        } @else {
          {{ legend() }}
        }
      </legend>
      @if (!collapsed()) {
        <div class="content">
          <ng-content />
        </div>
      }
    </fieldset>
  `,
})
export class GlintFieldsetComponent {
  /** Legend text */
  legend = input.required<string>();
  /** Whether the fieldset is toggleable */
  toggleable = input(false);
  /** Collapsed state (two-way bindable) */
  collapsed = model(false);

  toggle(): void {
    this.collapsed.update(v => !v);
  }
}
