import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  GlintToggleButtonComponent,
  GlintRatingComponent,
  GlintListboxComponent,
  GlintSelectButtonComponent,
} from '@glint/ui';
import type { SelectButtonOption } from '@glint/ui';

@Component({
  selector: 'glint-selection-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    GlintToggleButtonComponent,
    GlintRatingComponent,
    GlintListboxComponent,
    GlintSelectButtonComponent,
  ],
  styles: `
    :host { display: block; }
    h2 { margin-block: 0 0.25rem; font-size: 1.75rem; font-weight: 600; color: #1e293b; }
    .page-desc { color: #64748b; margin-block: 0 2rem; font-size: 1.25rem; }
    .demo-section {
      background: white; border: 1px solid #e2e8f0; border-radius: 0.625rem;
      padding: 2rem; margin-block-end: 1.5rem;
    }
    .demo-section h3 { margin-block: 0 1rem; font-size: 1rem; font-weight: 600; color: #334155; }
    .row { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; }
    .stack { display: flex; flex-direction: column; gap: 1rem; }
    .output { margin-block-start: 1rem; padding: 0.75rem 1rem; background: #f8fafc;
      border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.875rem; color: #64748b; }
    .label-text {
      margin-block: 0 0.25rem; font-size: 0.875rem; font-weight: 500; color: #475569;
    }
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
