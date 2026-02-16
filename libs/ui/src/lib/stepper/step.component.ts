import {
  ChangeDetectionStrategy,
  Component,
  input,
  TemplateRef,
  viewChild,
} from '@angular/core';

/**
 * A single step in a stepper.
 */
@Component({
  selector: 'glint-step',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #content>
      <ng-content />
    </ng-template>
  `,
})
export class GlintStepComponent {
  /** Step label */
  label = input.required<string>();

  contentTemplate = viewChild.required<TemplateRef<unknown>>('content');
}
