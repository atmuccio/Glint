import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  GlintTextareaComponent,
  GlintInputNumberComponent,
  GlintPasswordComponent,
} from '@glint-ng/core';

@Component({
  selector: 'glint-text-inputs-demo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    GlintTextareaComponent,
    GlintInputNumberComponent,
    GlintPasswordComponent,
  ],
  template: `
    <h2>Text Inputs</h2>
    <p class="page-desc">Textarea, numeric input, and password fields for specialized data entry.</p>

    <div class="demo-section">
      <h3>Textarea</h3>
      <div class="stack">
        <glint-textarea placeholder="Basic textarea" />
        <glint-textarea label="With label" placeholder="Enter your comments..." />
        <glint-textarea label="Auto-resize" placeholder="This grows as you type..." [autoResize]="true" />
        <glint-textarea label="Filled variant" variant="filled" placeholder="Filled style..." />
        <glint-textarea label="Disabled" placeholder="Cannot edit" [disabled]="true" />
      </div>
    </div>

    <div class="demo-section">
      <h3>Input Number</h3>
      <div class="stack">
        <glint-input-number label="Basic" placeholder="Enter a number" />
        <glint-input-number label="With min/max/step" [min]="0" [max]="100" [step]="5" [formControl]="quantityCtrl" />
        <p class="value-display">Quantity: {{ quantityCtrl.value }}</p>
        <glint-input-number label="Price" prefix="$" [step]="0.01" [min]="0" />
        <glint-input-number label="Percentage" suffix="%" [min]="0" [max]="100" />
        <glint-input-number label="Disabled" [disabled]="true" placeholder="Cannot edit" />
      </div>
    </div>

    <div class="demo-section">
      <h3>Password</h3>
      <div class="stack">
        <glint-password label="Basic password" placeholder="Enter password" />
        <glint-password label="With strength meter" placeholder="Enter a strong password" [showStrength]="true" [formControl]="passwordCtrl" />
        <p class="value-display">Strength reflected in meter above</p>
        <glint-password label="Disabled" placeholder="Cannot edit" [disabled]="true" />
      </div>
    </div>
  `,
  host: { class: 'demo-page' },
  styles: `
    :host { display: block; }
    .value-display {
      margin-block: 0.25rem 0;
      font-size: 0.8125rem;
      color: #64748b;
      font-family: monospace;
    }
  `,
})
export class TextInputsDemoComponent {
  quantityCtrl = new FormControl(10);
  passwordCtrl = new FormControl('');
}
