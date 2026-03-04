import { Directive, inject, TemplateRef } from '@angular/core';

/** Context provided to custom day cell templates */
export interface GlintDatepickerDayContext {
  /** The date for this day cell */
  $implicit: Date;
  /** Whether this date is currently selected */
  selected: boolean;
  /** Whether this date is disabled (outside min/max range) */
  disabled: boolean;
  /** Whether this date is today */
  today: boolean;
  /** Whether this date is in the selected range (range mode only) */
  inRange: boolean;
  /** Whether this date belongs to an adjacent month */
  otherMonth: boolean;
}

/**
 * Structural directive for providing a custom day cell template to the datepicker.
 *
 * @example
 * ```html
 * <glint-datepicker [formControl]="dateCtrl">
 *   <ng-template glintDatepickerDay let-date let-selected="selected" let-today="today">
 *     <span [class.highlight]="today">{{ date.getDate() }}</span>
 *   </ng-template>
 * </glint-datepicker>
 * ```
 */
@Directive({
  selector: '[glintDatepickerDay]',
  standalone: true,
})
export class GlintDatepickerDayDirective {
  readonly template = inject(TemplateRef<GlintDatepickerDayContext>);
}
