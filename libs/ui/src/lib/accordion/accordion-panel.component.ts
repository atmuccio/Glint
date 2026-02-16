import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
  TemplateRef,
  viewChild,
} from '@angular/core';

let nextId = 0;

/**
 * A single accordion panel.
 *
 * @example
 * ```html
 * <glint-accordion-panel header="Details">
 *   <p>Panel content…</p>
 * </glint-accordion-panel>
 * ```
 */
@Component({
  selector: 'glint-accordion-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #content>
      <ng-content />
    </ng-template>
  `,
})
export class GlintAccordionPanelComponent {
  /** Panel header text */
  header = input.required<string>();
  /** Disabled state */
  disabled = input(false);
  /** Whether this panel is expanded (two-way bindable) */
  expanded = model(false);

  readonly panelId = `glint-accordion-panel-${nextId++}`;
  readonly headerId = `${this.panelId}-header`;

  contentTemplate = viewChild.required<TemplateRef<unknown>>('content');

  toggle(): void {
    if (!this.disabled()) {
      this.expanded.update(v => !v);
    }
  }
}
