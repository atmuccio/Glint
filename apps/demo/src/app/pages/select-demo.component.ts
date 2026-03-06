import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GlintSelectComponent, GlintSelectOptionComponent } from '@glint-ng/core';

@Component({
  selector: 'glint-select-demo',
  standalone: true,
  host: { class: 'demo-page' },
  imports: [GlintSelectComponent, GlintSelectOptionComponent, ReactiveFormsModule, JsonPipe],
  template: `
    <h2>Select</h2>
    <p class="page-desc">Select provides a dropdown list of options.</p>

    <div class="demo-section">
      <h3>Single Select</h3>
      <div class="stack">
        <glint-select placeholder="Choose a fruit" [formControl]="fruitCtrl">
          <glint-select-option [value]="'apple'">Apple</glint-select-option>
          <glint-select-option [value]="'banana'">Banana</glint-select-option>
          <glint-select-option [value]="'cherry'">Cherry</glint-select-option>
          <glint-select-option [value]="'grape'">Grape</glint-select-option>
          <glint-select-option [value]="'mango'" [disabled]="true">Mango (disabled)</glint-select-option>
        </glint-select>
        <p class="output">Selected: {{ fruitCtrl.value || 'none' }}</p>
      </div>
    </div>

    <div class="demo-section">
      <h3>Multi Select</h3>
      <div class="stack">
        <glint-select placeholder="Choose colors" [multiple]="true" [formControl]="colorsCtrl">
          <glint-select-option [value]="'red'">Red</glint-select-option>
          <glint-select-option [value]="'green'">Green</glint-select-option>
          <glint-select-option [value]="'blue'">Blue</glint-select-option>
          <glint-select-option [value]="'yellow'">Yellow</glint-select-option>
        </glint-select>
        <p class="output">Selected: {{ colorsCtrl.value | json }}</p>
      </div>
    </div>

    <div class="demo-section">
      <h3>Searchable</h3>
      <div class="stack">
        <glint-select placeholder="Search countries" [searchable]="true" [formControl]="countryCtrl">
          <glint-select-option [value]="'us'">United States</glint-select-option>
          <glint-select-option [value]="'uk'">United Kingdom</glint-select-option>
          <glint-select-option [value]="'ca'">Canada</glint-select-option>
          <glint-select-option [value]="'au'">Australia</glint-select-option>
          <glint-select-option [value]="'de'">Germany</glint-select-option>
          <glint-select-option [value]="'fr'">France</glint-select-option>
          <glint-select-option [value]="'jp'">Japan</glint-select-option>
        </glint-select>
        <p class="output">Selected: {{ countryCtrl.value || 'none' }}</p>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; }
    .stack { display: flex; flex-direction: column; gap: 1rem; max-inline-size: 400px; }
    .output { margin-block-start: 0.75rem; font-size: 0.875rem; color: #64748b; }
  `,
})
export class SelectDemoComponent {
  fruitCtrl = new FormControl<string | null>(null);
  colorsCtrl = new FormControl<string[]>([]);
  countryCtrl = new FormControl<string | null>(null);
}
