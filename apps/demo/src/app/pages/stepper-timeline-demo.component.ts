import { Component, viewChild } from '@angular/core';
import {
  GlintStepperComponent,
  GlintStepComponent,
  GlintTimelineComponent,
  GlintButtonComponent,
} from '@glint/ui';
import type { GlintTimelineEvent } from '@glint/ui';

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
      <h3>Timeline</h3>
      <glint-timeline [events]="timelineEvents" />
    </div>
  `,
  styles: `
    :host { display: block; }
    h2 { margin-block: 0 0.25rem; font-size: 1.75rem; font-weight: 600; color: #1e293b; }
    .page-desc { color: #64748b; margin-block: 0 2rem; font-size: 1.25rem; }
    .demo-section {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 0.625rem;
      padding: 2rem;
      margin-block-end: 1.5rem;
    }
    .demo-section h3 { margin-block: 0 1rem; font-size: 1rem; font-weight: 600; color: #334155; }
    .row { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; }
    .stack { display: flex; flex-direction: column; gap: 1rem; }
    .step-actions { display: flex; gap: 0.5rem; margin-block-start: 1rem; }
  `,
})
export class StepperTimelineDemoComponent {
  private stepper = viewChild.required<GlintStepperComponent>('stepper');

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
}
