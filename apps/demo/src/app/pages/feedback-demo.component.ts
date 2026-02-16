import { Component } from '@angular/core';
import {
  GlintMessageComponent,
  GlintProgressBarComponent,
  GlintProgressSpinnerComponent,
  GlintSkeletonComponent,
} from '@glint/ui';

@Component({
  selector: 'glint-feedback-demo',
  standalone: true,
  imports: [
    GlintMessageComponent,
    GlintProgressBarComponent,
    GlintProgressSpinnerComponent,
    GlintSkeletonComponent,
  ],
  template: `
    <h2>Feedback</h2>
    <p class="page-desc">Components for displaying status, progress, and loading states.</p>

    <div class="demo-section">
      <h3>Messages</h3>
      <div class="stack">
        <glint-message severity="success">Operation completed successfully.</glint-message>
        <glint-message severity="info">This is an informational message.</glint-message>
        <glint-message severity="warning">Please review before continuing.</glint-message>
        <glint-message severity="danger">An error occurred during processing.</glint-message>
        <glint-message severity="info" [closable]="true">This message can be dismissed.</glint-message>
      </div>
    </div>

    <div class="demo-section">
      <h3>Progress Bar — Determinate</h3>
      <div class="stack">
        <glint-progress-bar [value]="60" severity="primary" />
      </div>
    </div>

    <div class="demo-section">
      <h3>Progress Bar — Indeterminate</h3>
      <div class="stack">
        <glint-progress-bar mode="indeterminate" severity="primary" />
      </div>
    </div>

    <div class="demo-section">
      <h3>Progress Bar — Severities</h3>
      <div class="stack">
        <glint-progress-bar [value]="80" severity="success" />
        <glint-progress-bar [value]="50" severity="info" />
        <glint-progress-bar [value]="65" severity="warning" />
        <glint-progress-bar [value]="35" severity="danger" />
      </div>
    </div>

    <div class="demo-section">
      <h3>Progress Spinner</h3>
      <div class="row">
        <glint-progress-spinner />
        <glint-progress-spinner size="4rem" strokeWidth="5" />
      </div>
    </div>

    <div class="demo-section">
      <h3>Skeleton</h3>
      <div class="stack">
        <glint-skeleton width="100%" height="1.25rem" />
        <glint-skeleton width="75%" height="1.25rem" />
        <glint-skeleton shape="rounded" width="12rem" height="2rem" />
        <div class="row">
          <glint-skeleton shape="circle" size="3rem" />
          <glint-skeleton shape="circle" size="3rem" />
          <glint-skeleton shape="circle" size="3rem" />
        </div>
      </div>
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
  `,
})
export class FeedbackDemoComponent {}
