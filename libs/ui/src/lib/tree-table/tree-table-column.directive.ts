import {
  Directive,
  input,
  TemplateRef,
  inject,
} from '@angular/core';

/**
 * Column definition directive for GlintTreeTable.
 *
 * @example
 * ```html
 * <ng-template glintTreeTableColumn="name" header="Name" let-node>
 *   {{ node.data.name }}
 * </ng-template>
 * ```
 */
@Directive({
  selector: '[glintTreeTableColumn]',
  standalone: true,
})
export class GlintTreeTableColumnDirective {
  /** Data field key */
  field = input.required<string>({ alias: 'glintTreeTableColumn' });
  /** Column header text */
  header = input('');
  /** Column width */
  width = input('');

  readonly template = inject(TemplateRef);
}
