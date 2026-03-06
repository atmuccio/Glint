import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  GlintCheckboxComponent,
  GlintRadioButtonComponent,
  GlintToggleSwitchComponent,
  GlintSliderComponent,
} from '@glint-ng/core';

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
  host: { class: 'demo-page' },
  styles: `
    :host { display: block; }
  `,
})
export class FormControlsDemoComponent {
  checkboxCtrl = new FormControl(true);
  radioCtrl = new FormControl('a');
  toggleCtrl = new FormControl(false);
  sliderCtrl = new FormControl(40);
}
