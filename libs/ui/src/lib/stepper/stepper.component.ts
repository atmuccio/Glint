import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  input,
  model,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { GlintStepComponent } from './step.component';

/**
 * Stepper for wizard-style navigation.
 *
 * @example
 * ```html
 * <glint-stepper [(activeStep)]="currentStep">
 *   <glint-step label="Account">…</glint-step>
 *   <glint-step label="Profile">…</glint-step>
 *   <glint-step label="Review">…</glint-step>
 * </glint-stepper>
 * ```
 */
@Component({
  selector: 'glint-stepper',
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

    .step-header {
      display: flex;
      align-items: center;
      gap: var(--glint-spacing-sm);
      cursor: pointer;
      padding-block: var(--glint-spacing-xs);
      padding-inline: var(--glint-spacing-sm);
      border: none;
      background: transparent;
      font: inherit;
      color: var(--glint-color-text-muted);
      transition: color var(--glint-duration-fast) var(--glint-easing);
    }
    .step-header:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: 2px;
    }

    .step-header.active {
      color: var(--glint-color-primary);
    }

    .step-header.complete {
      color: var(--glint-color-success);
    }

    .step-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 1.75rem;
      block-size: 1.75rem;
      border-radius: 50%;
      border: 2px solid currentColor;
      font-weight: 600;
      font-size: 0.875rem;
      flex-shrink: 0;
    }

    .step-header.active .step-number {
      background: var(--glint-color-primary);
      color: var(--glint-color-primary-contrast);
      border-color: var(--glint-color-primary);
    }

    .step-header.complete .step-number {
      background: var(--glint-color-success);
      color: white;
      border-color: var(--glint-color-success);
    }

    .step-label {
      font-weight: 500;
      white-space: nowrap;
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
    <div class="steps" role="tablist">
      @for (step of steps(); track $index; let i = $index; let last = $last) {
        <button
          class="step-header"
          [class.active]="activeStep() === i"
          [class.complete]="i < activeStep()"
          role="tab"
          [attr.aria-selected]="activeStep() === i"
          (click)="goToStep(i)"
        >
          <span class="step-number">
            @if (i < activeStep()) {
              &#10003;
            } @else {
              {{ i + 1 }}
            }
          </span>
          <span class="step-label">{{ step.label() }}</span>
        </button>
        @if (!last) {
          <div class="connector" [class.complete]="i < activeStep()"></div>
        }
      }
    </div>
    @for (step of steps(); track $index; let i = $index) {
      @if (activeStep() === i) {
        <div class="step-content" role="tabpanel">
          <ng-container [ngTemplateOutlet]="step.contentTemplate()" />
        </div>
      }
    }
  `,
})
export class GlintStepperComponent {
  /** Current active step index (two-way bindable) */
  activeStep = model(0);
  /** Allow clicking completed steps to navigate back */
  linear = input(false);

  steps = contentChildren(GlintStepComponent);

  goToStep(index: number): void {
    if (this.linear() && index > this.activeStep()) return;
    this.activeStep.set(index);
  }

  next(): void {
    const total = this.steps().length;
    if (this.activeStep() < total - 1) {
      this.activeStep.update(v => v + 1);
    }
  }

  prev(): void {
    if (this.activeStep() > 0) {
      this.activeStep.update(v => v - 1);
    }
  }
}
