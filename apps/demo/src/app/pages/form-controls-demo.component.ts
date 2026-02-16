import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  GlintCheckboxComponent,
  GlintRadioButtonComponent,
  GlintToggleSwitchComponent,
  GlintSliderComponent,
} from '@glint/ui';

@Component({
  selector: 'glint-form-controls-demo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    GlintCheckboxComponent,
    GlintRadioButtonComponent,
    GlintToggleSwitchComponent,
    GlintSliderComponent,
  ],
  template: `
    <h2>Form Controls</h2>
    <p class="page-desc">Checkboxes, radio buttons, toggle switches, and sliders for user input.</p>

    <div class="demo-section">
      <h3>Checkboxes</h3>
      <div class="row">
        <glint-checkbox [formControl]="checkboxCtrl">Checked via FormControl</glint-checkbox>
        <glint-checkbox [indeterminate]="true">Indeterminate</glint-checkbox>
        <glint-checkbox [disabled]="true">Disabled</glint-checkbox>
      </div>
      <p class="value-display">FormControl value: {{ checkboxCtrl.value }}</p>
    </div>

    <div class="demo-section">
      <h3>Radio Buttons</h3>
      <div class="row">
        <glint-radio-button [value]="'a'" name="demo" [formControl]="radioCtrl">Option A</glint-radio-button>
        <glint-radio-button [value]="'b'" name="demo" [formControl]="radioCtrl">Option B</glint-radio-button>
        <glint-radio-button [value]="'c'" name="demo" [formControl]="radioCtrl">Option C</glint-radio-button>
      </div>
      <p class="value-display">Selected: {{ radioCtrl.value }}</p>
    </div>

    <div class="demo-section">
      <h3>Toggle Switches</h3>
      <div class="row">
        <glint-toggle-switch>Basic toggle</glint-toggle-switch>
        <glint-toggle-switch [formControl]="toggleCtrl">Dark mode</glint-toggle-switch>
      </div>
      <p class="value-display">Dark mode: {{ toggleCtrl.value }}</p>
    </div>

    <div class="demo-section">
      <h3>Slider</h3>
      <div class="stack">
        <div>
          <p class="label-text">Basic slider</p>
          <glint-slider />
        </div>
        <div>
          <p class="label-text">With min/max/step (0–50, step 5)</p>
          <glint-slider [min]="0" [max]="50" [step]="5" />
        </div>
        <div>
          <p class="label-text">With labels</p>
          <glint-slider [min]="0" [max]="100" [showLabels]="true" />
        </div>
        <div>
          <p class="label-text">With FormControl</p>
          <glint-slider [min]="0" [max]="100" [showLabels]="true" [formControl]="sliderCtrl" />
          <p class="value-display">Value: {{ sliderCtrl.value }}</p>
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
    .value-display {
      margin-block: 0.75rem 0;
      font-size: 0.8125rem;
      color: #64748b;
      font-family: monospace;
    }
    .label-text {
      margin-block: 0 0.25rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #475569;
    }
  `,
})
export class FormControlsDemoComponent {
  checkboxCtrl = new FormControl(true);
  radioCtrl = new FormControl('a');
  toggleCtrl = new FormControl(false);
  sliderCtrl = new FormControl(40);
}
