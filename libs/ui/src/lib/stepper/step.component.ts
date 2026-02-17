import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { CdkStep } from '@angular/cdk/stepper';

/**
 * A single step in a stepper.
 *
 * Extends CdkStep to inherit `label`, `completed`, `optional`, `editable`,
 * `stepControl`, `state`, and `content` template projection.
 *
 * @example
 * ```html
 * <glint-step label="Account">Account form content</glint-step>
 * <glint-step label="Profile" [completed]="true">Profile content</glint-step>
 * ```
 */
@Component({
  selector: 'glint-step',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: CdkStep, useExisting: GlintStepComponent },
  ],
  template: `
    <ng-template><ng-content /></ng-template>
  `,
})
export class GlintStepComponent extends CdkStep {
  // All inputs inherited from CdkStep:
  // - label: string
  // - completed: boolean
  // - optional: boolean
  // - editable: boolean
  // - stepControl: AbstractControl
  // - state: StepState
  // - errorMessage: string
  // - ariaLabel: string (alias 'aria-label')
  // - ariaLabelledby: string (alias 'aria-labelledby')
  // - hasError: boolean
  //
  // Inherited properties:
  // - content: TemplateRef<any> (captured via @ViewChild(TemplateRef))
  // - index: WritableSignal<number>
  // - isSelected: Signal<boolean>
  // - indicatorType: Signal<string>
  // - isNavigable: Signal<boolean>
  // - interacted: boolean
}
