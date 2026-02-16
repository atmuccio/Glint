import {
  ChangeDetectionStrategy,
  Component,
  input,
  TemplateRef,
  viewChild,
} from '@angular/core';

let nextId = 0;

/**
 * A single tab panel. Must be placed inside a `<glint-tabs>` host.
 *
 * @example
 * ```html
 * <glint-tab-panel label="General">
 *   <p>General settings content…</p>
 * </glint-tab-panel>
 * ```
 */
@Component({
  selector: 'glint-tab-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #content>
      <ng-content />
    </ng-template>
  `,
})
export class GlintTabPanelComponent {
  /** Tab header label */
  label = input.required<string>();
  /** Disable this tab */
  disabled = input(false);

  /** Unique ID for ARIA linkage */
  readonly panelId = `glint-tab-panel-${nextId++}`;
  readonly tabId = `${this.panelId}-tab`;

  /** Template outlet for lazy rendering */
  contentTemplate = viewChild.required<TemplateRef<unknown>>('content');
}
