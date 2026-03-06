import { Component, viewChild } from '@angular/core';
import {
  GlintStepperComponent,
  GlintStepComponent,
  GlintTimelineComponent,
  GlintButtonComponent,
} from '@glint-ng/core';
import type { GlintTimelineEvent } from '@glint-ng/core';

@Component({
  selector: 'glint-stepper-timeline-demo',
  standalone: true,
  imports: [
    GlintStepperComponent,
    GlintStepComponent,
    GlintTimelineComponent,
    GlintButtonComponent,
  ],
  template: `
    <h2>Stepper &amp; Timeline</h2>
    <p class="page-desc">Step-by-step wizards and chronological event displays.</p>

    <div class="demo-section">
      <h3>Stepper</h3>
      <glint-stepper #stepper>
        <glint-step label="Account">
          <p>Enter your account details to get started.</p>
          <div class="step-actions">
            <glint-button severity="primary" variant="filled" (click)="stepNext()">Next</glint-button>
          </div>
        </glint-step>
        <glint-step label="Profile">
          <p>Complete your profile information.</p>
          <div class="step-actions">
            <glint-button severity="neutral" variant="outlined" (click)="stepPrev()">Back</glint-button>
            <glint-button severity="primary" variant="filled" (click)="stepNext()">Next</glint-button>
          </div>
        </glint-step>
        <glint-step label="Review">
          <p>Review your information and submit.</p>
          <div class="step-actions">
            <glint-button severity="neutral" variant="outlined" (click)="stepPrev()">Back</glint-button>
            <glint-button severity="success" variant="filled">Submit</glint-button>
          </div>
        </glint-step>
      </glint-stepper>
    </div>

    <div class="demo-section">
      <h3>Non-Linear Navigation</h3>
      <p class="section-desc">Click any step header to jump directly to it. Completed steps show a hover effect.</p>
      <glint-stepper #nonLinearStepper>
        <glint-step label="Details" [completed]="true">
          <p>This step is already completed. Click any step header above to navigate freely.</p>
          <div class="step-actions">
            <glint-button severity="primary" variant="filled" (click)="nonLinearNext()">Next</glint-button>
          </div>
        </glint-step>
        <glint-step label="Preferences" [completed]="true">
          <p>Also completed. You can go back and forth at will.</p>
          <div class="step-actions">
            <glint-button severity="neutral" variant="outlined" (click)="nonLinearPrev()">Back</glint-button>
            <glint-button severity="primary" variant="filled" (click)="nonLinearNext()">Next</glint-button>
          </div>
        </glint-step>
        <glint-step label="Confirmation">
          <p>Final step. Navigate back to any previous step if needed.</p>
          <div class="step-actions">
            <glint-button severity="neutral" variant="outlined" (click)="nonLinearPrev()">Back</glint-button>
            <glint-button severity="success" variant="filled">Confirm</glint-button>
          </div>
        </glint-step>
      </glint-stepper>
    </div>

    <div class="demo-section">
      <h3>Validation Error State</h3>
      <p class="section-desc">Steps with errors display a warning icon and red styling instead of the step number or checkmark.</p>
      <glint-stepper #errorStepper [activeStep]="1">
        <glint-step label="Account" [completed]="true" [hasError]="true" errorMessage="Email is required">
          <p>This step has a validation error. Notice the warning icon above.</p>
          <div class="step-actions">
            <glint-button severity="primary" variant="filled" (click)="errorNext()">Next</glint-button>
          </div>
        </glint-step>
        <glint-step label="Profile">
          <p>Currently active step with no errors.</p>
          <div class="step-actions">
            <glint-button severity="neutral" variant="outlined" (click)="errorPrev()">Back</glint-button>
            <glint-button severity="primary" variant="filled" (click)="errorNext()">Next</glint-button>
          </div>
        </glint-step>
        <glint-step label="Review">
          <p>Final review before submission.</p>
          <div class="step-actions">
            <glint-button severity="neutral" variant="outlined" (click)="errorPrev()">Back</glint-button>
            <glint-button severity="success" variant="filled">Submit</glint-button>
          </div>
        </glint-step>
      </glint-stepper>
    </div>

    <div class="demo-section">
      <h3>Timeline</h3>
      <glint-timeline [events]="timelineEvents" />
    </div>
  `,
  host: { class: 'demo-page' },
  styles: `
    :host { display: block; }
    .step-actions { display: flex; gap: 0.5rem; margin-block-start: 1rem; }
  `,
})
export class StepperTimelineDemoComponent {
  private stepper = viewChild.required<GlintStepperComponent>('stepper');
  private nonLinearStepper = viewChild.required<GlintStepperComponent>('nonLinearStepper');
  private errorStepper = viewChild.required<GlintStepperComponent>('errorStepper');

  timelineEvents: GlintTimelineEvent[] = [
    { title: 'Order Placed', date: 'Jan 15, 2025', description: 'Your order has been placed and is being processed.', severity: 'info' },
    { title: 'Payment Confirmed', date: 'Jan 15, 2025', description: 'Payment was successfully authorized.', severity: 'success' },
    { title: 'Shipped', date: 'Jan 17, 2025', description: 'Package dispatched from warehouse.', severity: 'warning' },
    { title: 'Delivered', date: 'Jan 20, 2025', description: 'Package delivered to destination.', severity: 'success' },
  ];

  stepNext(): void {
    this.stepper().next();
  }

  stepPrev(): void {
    this.stepper().previous();
  }

  nonLinearNext(): void {
    this.nonLinearStepper().next();
  }

  nonLinearPrev(): void {
    this.nonLinearStepper().previous();
  }

  errorNext(): void {
    this.errorStepper().next();
  }

  errorPrev(): void {
    this.errorStepper().previous();
  }
}
