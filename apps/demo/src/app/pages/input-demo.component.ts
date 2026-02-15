import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { GlintInputComponent } from '@glint/ui';

@Component({
  selector: 'glint-input-demo',
  standalone: true,
  imports: [GlintInputComponent, ReactiveFormsModule],
  template: `
    <h2>Input</h2>
    <p class="page-desc">Input fields allow users to enter and edit text.</p>

    <div class="demo-section">
      <h3>Variants</h3>
      <div class="stack">
        <glint-input label="Outline (default)" variant="outline" placeholder="Type here..." />
        <glint-input label="Filled" variant="filled" placeholder="Type here..." />
        <glint-input label="Underline" variant="underline" placeholder="Type here..." />
      </div>
    </div>

    <div class="demo-section">
      <h3>Reactive Form</h3>
      <div class="stack">
        <glint-input
          label="Email"
          placeholder="you@example.com"
          [formControl]="emailCtrl"
          [invalid]="emailCtrl.invalid && emailCtrl.touched"
          errorMessage="Please enter a valid email"
        />
        <p class="output">Value: {{ emailCtrl.value }}</p>
      </div>
    </div>

    <div class="demo-section">
      <h3>States</h3>
      <div class="stack">
        <glint-input label="Disabled" [disabled]="true" placeholder="Can't type here" />
        <glint-input label="Required" [required]="true" placeholder="Required field" />
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
    .stack { display: flex; flex-direction: column; gap: 1rem; max-inline-size: 400px; }
    .output { margin-block-start: 0.75rem; font-size: 0.875rem; color: #64748b; }
  `,
})
export class InputDemoComponent {
  emailCtrl = new FormControl('', [Validators.required, Validators.email]);
}
