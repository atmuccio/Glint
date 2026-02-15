import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GlintSelectComponent, GlintSelectOptionComponent } from '@glint/ui';

@Component({
  selector: 'glint-select-demo',
  standalone: true,
  imports: [GlintSelectComponent, GlintSelectOptionComponent, ReactiveFormsModule, JsonPipe],
  template: `
    <h2>Select</h2>

    <section>
      <h3>Single Select</h3>
      <div class="stack">
        <glint-select placeholder="Choose a fruit" [formControl]="fruitCtrl">
          <glint-select-option [value]="'apple'">Apple</glint-select-option>
          <glint-select-option [value]="'banana'">Banana</glint-select-option>
          <glint-select-option [value]="'cherry'">Cherry</glint-select-option>
          <glint-select-option [value]="'grape'">Grape</glint-select-option>
          <glint-select-option [value]="'mango'" [disabled]="true">Mango (disabled)</glint-select-option>
        </glint-select>
        <p>Selected: {{ fruitCtrl.value || 'none' }}</p>
      </div>
    </section>

    <section>
      <h3>Multi Select</h3>
      <div class="stack">
        <glint-select placeholder="Choose colors" [multiple]="true" [formControl]="colorsCtrl">
          <glint-select-option [value]="'red'">Red</glint-select-option>
          <glint-select-option [value]="'green'">Green</glint-select-option>
          <glint-select-option [value]="'blue'">Blue</glint-select-option>
          <glint-select-option [value]="'yellow'">Yellow</glint-select-option>
        </glint-select>
        <p>Selected: {{ colorsCtrl.value | json }}</p>
      </div>
    </section>

    <section>
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
        <p>Selected: {{ countryCtrl.value || 'none' }}</p>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    section { margin-block-end: 2rem; }
    .stack { display: flex; flex-direction: column; gap: 0.75rem; max-inline-size: 400px; }
    p { margin: 0.25rem 0; font-size: 0.875rem; color: #64748b; }
  `,
})
export class SelectDemoComponent {
  fruitCtrl = new FormControl<string | null>(null);
  colorsCtrl = new FormControl<string[]>([]);
  countryCtrl = new FormControl<string | null>(null);
}
