import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { GlintInputComponent } from '@glint-ng/core';

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
  host: { class: 'demo-page' },
  styles: `
    :host { display: block; }
    .stack { display: flex; flex-direction: column; gap: 1rem; max-inline-size: 400px; }
    .output { margin-block-start: 0.75rem; font-size: 0.875rem; color: #64748b; }
  `,
})
export class InputDemoComponent {
  emailCtrl = new FormControl('', [Validators.required, Validators.email]);
}
