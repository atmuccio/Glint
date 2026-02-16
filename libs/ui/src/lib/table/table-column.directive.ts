import {
  Directive,
  input,
  TemplateRef,
  inject,
} from '@angular/core';

/**
 * Column definition directive for GlintTable.
 *
 * @example
 * ```html
 * <ng-template glintColumn field="name" header="Name" [sortable]="true" let-row>
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

  readonly template = inject(TemplateRef);
}
