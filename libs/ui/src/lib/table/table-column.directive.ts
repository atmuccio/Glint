import {
  Directive,
  input,
  TemplateRef,
  inject,
} from '@angular/core';

/** Column text alignment */
export type GlintColumnAlign = 'start' | 'center' | 'end';

/**
 * Column definition directive for GlintTable.
 *
 * @example
 * ```html
 * <ng-template glintColumn="name" header="Name" [sortable]="true" let-row>
 *   {{ row.name }}
 * </ng-template>
 * ```
 */
@Directive({
  selector: '[glintColumn]',
  standalone: true,
})
export class GlintColumnDirective {
  /** Data field key */
  field = input.required<string>({ alias: 'glintColumn' });
  /** Column header text */
  header = input('');
  /** Whether this column is sortable */
  sortable = input(false);
  /** Column width */
  width = input('');
  /** Stick column to the inline-start edge */
  sticky = input(false);
  /** Stick column to the inline-end edge */
  stickyEnd = input(false);
  /** Text alignment for header and cells */
  align = input<GlintColumnAlign>('start');

  readonly template = inject(TemplateRef);
}
