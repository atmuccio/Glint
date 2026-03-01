import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  model,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CdkAccordionItem } from '@angular/cdk/accordion';

/**
 * A single accordion panel.
 *
 * Uses `CdkAccordionItem` as a host directive for expand/collapse coordination,
 * unique ID generation, and single-expand mode support via `UniqueSelectionDispatcher`.
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
  hostDirectives: [CdkAccordionItem],
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

  private readonly cdkItem = inject(CdkAccordionItem);

  /** Unique panel content ID (from CDK) */
  readonly panelId = this.cdkItem.id;
  /** Unique header ID derived from the CDK-generated panel ID */
  readonly headerId = `${this.cdkItem.id}-header`;

  contentTemplate = viewChild.required<TemplateRef<unknown>>('content');

  /** Sync disabled input -> CdkAccordionItem */
  private readonly syncDisabled = effect(() => {
    this.cdkItem.disabled = this.disabled();
  });

  /** Sync expanded model -> CdkAccordionItem */
  private readonly syncExpanded = effect(() => {
    const val = this.expanded();
    if (this.cdkItem.expanded !== val) {
      this.cdkItem.expanded = val;
    }
  });

  constructor() {
    // Sync CdkAccordionItem -> expanded model
    // (fires when CDK closes this panel in single-expand mode)
    this.cdkItem.expandedChange
      .pipe(takeUntilDestroyed())
      .subscribe(val => {
        if (this.expanded() !== val) {
          this.expanded.set(val);
        }
      });
  }

  toggle(): void {
    if (!this.disabled()) {
      this.cdkItem.toggle();
    }
  }
}
