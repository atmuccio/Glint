import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  GlintToggleButtonComponent,
  GlintRatingComponent,
  GlintListboxComponent,
  GlintSelectButtonComponent,
} from '@glint-ng/core';
import type { SelectButtonOption } from '@glint-ng/core';

@Component({
  selector: 'glint-selection-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'demo-page' },
  imports: [
    ReactiveFormsModule,
    GlintToggleButtonComponent,
    GlintRatingComponent,
    GlintListboxComponent,
    GlintSelectButtonComponent,
  ],
  styles: `
    :host { display: block; }
  `,
  template: `
    <h2>Selection Controls</h2>
    <p class="page-desc">Toggle buttons, ratings, listboxes, and select button groups.</p>

    <!-- ── Toggle Button ──────────────────────────── -->
    <div class="demo-section">
      <h3>Toggle Button</h3>

      <div class="stack">
        <div>
          <p class="label-text">Basic toggle</p>
          <div class="row">
            <glint-toggle-button [formControl]="boldCtrl" onLabel="Bold" offLabel="Bold" />
            <glint-toggle-button [formControl]="italicCtrl" onLabel="Italic" offLabel="Italic" />
          </div>
          <div class="output">Bold: {{ boldCtrl.value }} | Italic: {{ italicCtrl.value }}</div>
        </div>

        <div>
          <p class="label-text">With icon text</p>
          <div class="row">
            <glint-toggle-button [formControl]="favoriteCtrl" onIcon="★" offIcon="☆">Favorite</glint-toggle-button>
          </div>
          <div class="output">Favorite: {{ favoriteCtrl.value }}</div>
        </div>

        <div>
          <p class="label-text">Group of exclusive toggles (manual)</p>
          <div class="row">
            <glint-toggle-button [formControl]="alignLeftCtrl" onLabel="Left" offLabel="Left" />
            <glint-toggle-button [formControl]="alignCenterCtrl" onLabel="Center" offLabel="Center" />
            <glint-toggle-button [formControl]="alignRightCtrl" onLabel="Right" offLabel="Right" />
          </div>
        </div>
      </div>
    </div>

    <!-- ── Rating ─────────────────────────────────── -->
    <div class="demo-section">
      <h3>Rating</h3>

      <div class="stack">
        <div>
          <p class="label-text">Basic rating</p>
          <glint-rating [formControl]="ratingCtrl" />
          <div class="output">Value: {{ ratingCtrl.value }}</div>
        </div>

        <div>
          <p class="label-text">Read-only (4 stars selected)</p>
          <glint-rating [stars]="5" [readonly]="true" [formControl]="readonlyRatingCtrl" />
        </div>

        <div>
          <p class="label-text">Custom max stars (10)</p>
          <glint-rating [stars]="10" [cancel]="false" [formControl]="tenStarCtrl" />
          <div class="output">Value: {{ tenStarCtrl.value }} / 10</div>
        </div>
      </div>
    </div>

    <!-- ── Listbox ────────────────────────────────── -->
    <div class="demo-section">
      <h3>Listbox</h3>

      <div class="stack">
        <div>
          <p class="label-text">Basic options list</p>
          <glint-listbox
            [options]="cities"
            optionLabel="name"
            optionValue="code"
            [formControl]="cityCtrl"
          />
          <div class="output">Selected: {{ cityCtrl.value }}</div>
        </div>

        <div>
          <p class="label-text">Multi-select mode with filter</p>
          <glint-listbox
            [options]="cities"
            optionLabel="name"
            optionValue="code"
            [multiple]="true"
            [filter]="true"
            [formControl]="multiCityCtrl"
          />
          <div class="output">Selected: {{ formatMultiValue(multiCityCtrl.value) }}</div>
        </div>
      </div>
    </div>

    <!-- ── Select Button ──────────────────────────── -->
    <div class="demo-section">
      <h3>Select Button</h3>

      <div class="stack">
        <div>
          <p class="label-text">Basic options</p>
          <glint-select-button
            [options]="alignOptions"
            [formControl]="selectBtnCtrl"
          />
          <div class="output">Selected: {{ selectBtnCtrl.value }}</div>
        </div>

        <div>
          <p class="label-text">With disabled option</p>
          <glint-select-button
            [options]="sizeOptions"
            [formControl]="sizeBtnCtrl"
          />
          <div class="output">Selected: {{ sizeBtnCtrl.value }}</div>
        </div>
      </div>
    </div>
  `,
})
export class SelectionDemoComponent {
  // ── Toggle Button ──────────────────────────────
  boldCtrl = new FormControl(false);
  italicCtrl = new FormControl(false);
  favoriteCtrl = new FormControl(false);
  alignLeftCtrl = new FormControl(true);
  alignCenterCtrl = new FormControl(false);
  alignRightCtrl = new FormControl(false);

  // ── Rating ─────────────────────────────────────
  ratingCtrl = new FormControl(3);
  readonlyRatingCtrl = new FormControl(4);
  tenStarCtrl = new FormControl(7);

  // ── Listbox ────────────────────────────────────
  cities: Record<string, unknown>[] = [
    { name: 'New York', code: 'NY' },
    { name: 'Los Angeles', code: 'LA' },
    { name: 'Chicago', code: 'CHI' },
    { name: 'Houston', code: 'HOU' },
    { name: 'Phoenix', code: 'PHX' },
    { name: 'Philadelphia', code: 'PHL' },
    { name: 'San Antonio', code: 'SA' },
    { name: 'San Diego', code: 'SD' },
  ];

  cityCtrl = new FormControl<string | null>(null);
  multiCityCtrl = new FormControl<string[]>([]);

  // ── Select Button ──────────────────────────────
  alignOptions: SelectButtonOption[] = [
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' },
    { label: 'Justify', value: 'justify' },
  ];

  sizeOptions: SelectButtonOption[] = [
    { label: 'Small', value: 'sm' },
    { label: 'Medium', value: 'md' },
    { label: 'Large', value: 'lg' },
    { label: 'X-Large', value: 'xl', disabled: true },
  ];

  selectBtnCtrl = new FormControl('center');
  sizeBtnCtrl = new FormControl('md');

  formatMultiValue(value: unknown): string {
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : '(none)';
    }
    return String(value ?? '(none)');
  }
}
