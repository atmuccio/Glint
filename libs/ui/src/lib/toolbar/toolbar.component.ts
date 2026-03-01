import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';

/**
 * Toolbar container with start, center, and end content areas.
 *
 * @example
 * ```html
 * <glint-toolbar>
 *   <div glintToolbarStart>
 *     <glint-button>Back</glint-button>
 *   </div>
 *   <div glintToolbarCenter>
 *     <h2>Page Title</h2>
 *   </div>
 *   <div glintToolbarEnd>
 *     <glint-button>Save</glint-button>
 *   </div>
 * </glint-toolbar>
 * ```
 */
@Component({
  selector: 'glint-toolbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'toolbar',
  },
  styles: `
    :host {
      display: flex;
      align-items: center;
      gap: var(--glint-spacing-sm);
      padding-block: var(--glint-spacing-sm);
      padding-inline: var(--glint-spacing-md);
      background: var(--glint-color-surface);
      border-block-end: 1px solid var(--glint-color-border);
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
    }

    .start {
      display: flex;
      align-items: center;
      gap: var(--glint-spacing-sm);
    }

    .center {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--glint-spacing-sm);
    }

    .end {
      display: flex;
      align-items: center;
      gap: var(--glint-spacing-sm);
    }
  `,
  template: `
    <div class="start"><ng-content select="[glintToolbarStart]" /></div>
    <div class="center"><ng-content select="[glintToolbarCenter]" /></div>
    <div class="end"><ng-content select="[glintToolbarEnd]" /></div>
  `,
})
export class GlintToolbarComponent {}
