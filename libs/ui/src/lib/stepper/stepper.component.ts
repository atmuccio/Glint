import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  numberAttribute,
  Output,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { CdkStepper, CdkStepHeader } from '@angular/cdk/stepper';
import { GlintStepHeaderComponent } from './step-header.component';

/**
 * Stepper for wizard-style navigation.
 * Extends CdkStepper to inherit keyboard navigation (Arrow keys, Home, End,
 * Enter/Space to select), linear mode validation, orientation support,
 * and focus management via FocusKeyManager.
 *
 * The `activeStep` input/output is an alias for CdkStepper's `selectedIndex`
 * to maintain backwards compatibility.
 *
 * @example
 * ```html
 * <glint-stepper [(activeStep)]="currentStep">
 *   <glint-step label="Account">...</glint-step>
 *   <glint-step label="Profile">...</glint-step>
 *   <glint-step label="Review">...</glint-step>
 * </glint-stepper>
 * ```
 */
@Component({
  selector: 'glint-stepper',
  standalone: true,
  imports: [NgTemplateOutlet, GlintStepHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CdkStepper, useExisting: GlintStepperComponent }],
  styles: `
    :host {
      display: block;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
    }

    .steps {
      display: flex;
      align-items: center;
      gap: 0;
      margin-block-end: var(--glint-spacing-lg);
    }

    .connector {
      flex: 1;
      block-size: 2px;
      background: var(--glint-color-border);
      min-inline-size: 2rem;
    }

    .connector.complete {
      background: var(--glint-color-success);
    }

    .step-content {
      padding-block: var(--glint-spacing-sm);
    }
  `,
  template: `
    <!-- eslint-disable-next-line @angular-eslint/template/interactive-supports-focus -->
    <div class="steps" role="tablist" (keydown)="_onKeydown($event)">
      @for (step of steps; track step; let i = $index; let last = $last) {
        <glint-step-header
          [index]="i"
          [active]="selectedIndex === i"
          [complete]="isComplete(i)"
          [optional]="step.optional"
          [hasError]="step.hasError"
          (click)="step.select()"
        >{{ step.label }}</glint-step-header>
        @if (!last) {
          <div
            class="connector"
            [class.complete]="isComplete(i)"
            aria-hidden="true"
          ></div>
        }
      }
    </div>
    @for (step of steps; track step; let i = $index) {
      @if (selectedIndex === i) {
        <div
          class="step-content"
          role="tabpanel"
          [attr.id]="'glint-step-content-' + i"
          [attr.aria-labelledby]="'glint-step-label-' + i"
        >
          <ng-container [ngTemplateOutlet]="step.content" />
        </div>
      }
    }
  `,
})
export class GlintStepperComponent extends CdkStepper {
  // CdkStepper provides:
  // - linear: boolean (input)
  // - selectedIndex: number (input/output via selectedIndexChange)
  // - selected: CdkStep | undefined
  // - orientation: StepperOrientation (input)
  // - selectionChange: EventEmitter<StepperSelectionEvent>
  // - selectedIndexChange: EventEmitter<number>
  // - steps: QueryList<CdkStep>
  // - next(): void
  // - previous(): void
  // - reset(): void
  // - _onKeydown(event): void (keyboard navigation)

  /**
   * Override CdkStepper's @ContentChildren(CdkStepHeader) with @ViewChildren
   * since our step headers are rendered in the template, not projected as content.
   *
   * Uses decorator instead of signal query because CdkStepper base class
   * expects a QueryList<CdkStepHeader> property set via @ViewChildren.
   */
  @ViewChildren(GlintStepHeaderComponent)
  override _stepHeader = new QueryList<CdkStepHeader>();

  /**
   * Alias for CdkStepper's `selectedIndex` — maintains backward compatibility.
   * Use `[(activeStep)]` for two-way binding.
   *
   * Uses @Input() decorator instead of signal input because CdkStepper base class
   * defines selectedIndex as a decorated property that must be overridden with a decorator.
   */
  // eslint-disable-next-line @angular-eslint/no-input-rename -- CdkStepper override requires decorator
  @Input({ alias: 'activeStep', transform: numberAttribute })
  override set selectedIndex(index: number) {
    super.selectedIndex = index;
  }
  override get selectedIndex(): number {
    return super.selectedIndex;
  }

  /**
   * Emits when activeStep changes. Supports `[(activeStep)]` two-way binding.
   *
   * Uses @Output() decorator instead of signal output because CdkStepper base class
   * defines selectedIndexChange as an EventEmitter that must be overridden with a decorator.
   */
  // eslint-disable-next-line @angular-eslint/no-output-rename -- CdkStepper override requires decorator
  @Output('activeStepChange')
  override readonly selectedIndexChange = new EventEmitter<number>();

  /**
   * Whether the step at the given index should display as completed.
   * A step is visually complete if it precedes the active step or has been
   * explicitly marked `[completed]="true"`.
   */
  protected isComplete(index: number): boolean {
    const step = this.steps.get(index);
    return index < this.selectedIndex || (!!step?.completed && index !== this.selectedIndex);
  }

  /**
   * Navigate to previous step.
   * @deprecated Use `previous()` instead. This alias is kept for backward compatibility.
   */
  prev(): void {
    this.previous();
  }
}
