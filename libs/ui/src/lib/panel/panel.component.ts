import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';

/**
 * Collapsible panel container with header, content, and footer slots.
 *
 * @example
 * ```html
 * <glint-panel header="Details" [toggleable]="true" [(collapsed)]="isCollapsed">
 *   <button glintPanelIcons>⚙</button>
 *   <p>Panel body content</p>
 *   <div glintPanelFooter>Footer actions</div>
 * </glint-panel>
 * ```
 */
@Component({
  selector: 'glint-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'style': 'display: block',
  },
  styles: `
    :host {
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
    }

    .panel {
      background: var(--glint-color-surface);
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      box-shadow: var(--glint-shadow);
      overflow: hidden;
      transition:
        background-color var(--glint-duration-normal) var(--glint-easing),
        border-color var(--glint-duration-normal) var(--glint-easing),
        box-shadow var(--glint-duration-normal) var(--glint-easing);
    }

    .panel-header {
      display: flex;
      align-items: center;
      background: var(--glint-color-surface-variant);
      padding-block: var(--glint-spacing-sm);
      padding-inline: var(--glint-spacing-md);
      border-block-end: 1px solid var(--glint-color-border);
    }

    .panel-title {
      font-weight: 600;
      color: var(--glint-color-text);
    }

    .panel-toggle {
      display: inline-flex;
      align-items: center;
      gap: var(--glint-spacing-xs);
      border: none;
      background: transparent;
      font: inherit;
      font-weight: 600;
      color: var(--glint-color-text);
      cursor: pointer;
      padding: 0;
    }
    .panel-toggle:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: 2px;
    }

    .chevron {
      display: inline-block;
      font-size: 0.65em;
      transition: rotate var(--glint-duration-fast) var(--glint-easing);
      rotate: 90deg;
    }
    .chevron.collapsed {
      rotate: 0deg;
    }

    .panel-icons {
      margin-inline-start: auto;
      display: flex;
      align-items: center;
      gap: var(--glint-spacing-xs);
    }

    .panel-content {
      padding: var(--glint-spacing-md);
      color: var(--glint-color-text);
    }

    .panel-footer {
      display: flex;
      align-items: center;
      gap: var(--glint-spacing-sm);
      padding-block: var(--glint-spacing-sm);
      padding-inline: var(--glint-spacing-md);
      border-block-start: 1px solid var(--glint-color-border);
    }
  `,
  template: `
    <div class="panel">
      <div class="panel-header">
        @if (toggleable()) {
          <button
            class="panel-toggle"
            type="button"
            [attr.aria-expanded]="!collapsed()"
            (click)="toggle()"
          >
            <span class="chevron" [class.collapsed]="collapsed()">&#9654;</span>
            {{ header() }}
          </button>
        } @else {
          <span class="panel-title">{{ header() }}</span>
        }
        <div class="panel-icons"><ng-content select="[glintPanelIcons]" /></div>
      </div>
      @if (!collapsed()) {
        <div class="panel-content"><ng-content /></div>
        <div class="panel-footer"><ng-content select="[glintPanelFooter]" /></div>
      }
    </div>
  `,
})
export class GlintPanelComponent {
  /** Panel header text */
  header = input.required<string>();
  /** Whether the panel can be collapsed */
  toggleable = input(false);
  /** Collapsed state (two-way bindable) */
  collapsed = model(false);

  toggle(): void {
    this.collapsed.update(v => !v);
  }
}
