import { Component, ChangeDetectionStrategy, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  GlintAutoCompleteComponent,
  GlintMultiSelectComponent,
  GlintCascadeSelectComponent,
  GlintTreeSelectComponent,
  GlintDatepickerComponent,
  GlintColorPickerComponent,
} from '@glint-ng/core';
import type { GlintMenuItem, GlintTreeNode } from '@glint-ng/core';

@Component({
  selector: 'glint-advanced-selects-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    GlintAutoCompleteComponent,
    GlintMultiSelectComponent,
    GlintCascadeSelectComponent,
    GlintTreeSelectComponent,
    GlintDatepickerComponent,
    GlintColorPickerComponent,
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
    .color-preview {
      display: inline-block; inline-size: 1.25rem; block-size: 1.25rem;
      border-radius: 4px; border: 1px solid #e2e8f0; vertical-align: middle;
      margin-inline-end: 0.5rem;
    }
  `,
  template: `
    <h2>Advanced Selects</h2>
    <p class="page-desc">Autocomplete, multi-select, cascade select, tree select, datepicker, and color picker.</p>

    <!-- ── AutoComplete ───────────────────────────── -->
    <div class="demo-section">
      <h3>AutoComplete</h3>

      <div class="stack">
        <div>
          <p class="label-text">Basic with string suggestions</p>
          <glint-autocomplete
            #autoCompleteRef
            [suggestions]="filteredCountries"
            field="name"
            placeholder="Search countries..."
            [formControl]="countryCtrl"
            (completeMethod)="filterCountries($event)"
          />
          <div class="output">Value: {{ formatAutoValue(countryCtrl.value) }}</div>
        </div>
      </div>
    </div>

    <!-- ── MultiSelect ────────────────────────────── -->
    <div class="demo-section">
      <h3>MultiSelect</h3>

      <div class="stack">
        <div>
          <p class="label-text">Basic multi-select</p>
          <glint-multiselect
            [options]="cityOptions"
            optionLabel="name"
            optionValue="code"
            placeholder="Select cities"
            [formControl]="multiSelectCtrl"
          />
          <div class="output">Selected: {{ formatMultiValue(multiSelectCtrl.value) }}</div>
        </div>
      </div>
    </div>

    <!-- ── Cascade Select ─────────────────────────── -->
    <div class="demo-section">
      <h3>Cascade Select</h3>

      <div class="stack">
        <div>
          <p class="label-text">Hierarchical options</p>
          <glint-cascade-select
            [options]="geographyOptions"
            placeholder="Select a city"
            [formControl]="cascadeCtrl"
          />
          <div class="output">Selected: {{ cascadeCtrl.value || '(none)' }}</div>
        </div>
      </div>
    </div>

    <!-- ── Tree Select ────────────────────────────── -->
    <div class="demo-section">
      <h3>Tree Select</h3>

      <div class="stack">
        <div>
          <p class="label-text">Tree data selection</p>
          <glint-tree-select
            [options]="treeData"
            placeholder="Select a node"
            [formControl]="treeCtrl"
          />
          <div class="output">Selected: {{ formatTreeValue(treeCtrl.value) }}</div>
        </div>
      </div>
    </div>

    <!-- ── Datepicker ─────────────────────────────── -->
    <div class="demo-section">
      <h3>Datepicker</h3>

      <div class="stack">
        <div>
          <p class="label-text">Basic date</p>
          <glint-datepicker
            placeholder="Select a date"
            [formControl]="dateCtrl"
          />
          <div class="output">Value: {{ formatDate(dateCtrl.value) }}</div>
        </div>
      </div>
    </div>

    <!-- ── Color Picker ───────────────────────────── -->
    <div class="demo-section">
      <h3>Color Picker</h3>

      <div class="stack">
        <div>
          <p class="label-text">Basic color picker</p>
          <div class="row">
            <glint-colorpicker [formControl]="colorCtrl" />
          </div>
          <div class="output">
            <span class="color-preview" [style.background]="colorCtrl.value || '#ff0000'"></span>
            Value: {{ colorCtrl.value || '#ff0000' }}
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdvancedSelectsDemoComponent {
  // ── AutoComplete ───────────────────────────────
  private autoCompleteRef = viewChild<GlintAutoCompleteComponent>('autoCompleteRef');

  allCountries = [
    { name: 'Argentina' }, { name: 'Australia' }, { name: 'Austria' },
    { name: 'Brazil' }, { name: 'Belgium' }, { name: 'Canada' },
    { name: 'China' }, { name: 'Colombia' }, { name: 'Denmark' },
    { name: 'Egypt' }, { name: 'Finland' }, { name: 'France' },
    { name: 'Germany' }, { name: 'Greece' }, { name: 'India' },
    { name: 'Ireland' }, { name: 'Italy' }, { name: 'Japan' },
    { name: 'Mexico' }, { name: 'Netherlands' }, { name: 'Norway' },
    { name: 'Peru' }, { name: 'Poland' }, { name: 'Portugal' },
    { name: 'South Korea' }, { name: 'Spain' }, { name: 'Sweden' },
    { name: 'Switzerland' }, { name: 'United Kingdom' }, { name: 'United States' },
  ];
  filteredCountries: unknown[] = [];
  countryCtrl = new FormControl<unknown>(null);

  filterCountries(event: { query: string }): void {
    const query = event.query.toLowerCase();
    this.filteredCountries = this.allCountries.filter(
      c => c.name.toLowerCase().includes(query)
    );
    this.autoCompleteRef()?.openPanel();
  }

  formatAutoValue(value: unknown): string {
    if (value == null) return '(none)';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value !== null && 'name' in value) {
      return (value as { name: string }).name;
    }
    return String(value);
  }

  // ── MultiSelect ────────────────────────────────
  cityOptions: Record<string, unknown>[] = [
    { name: 'New York', code: 'NY' },
    { name: 'London', code: 'LDN' },
    { name: 'Paris', code: 'PRS' },
    { name: 'Tokyo', code: 'TYO' },
    { name: 'Berlin', code: 'BER' },
    { name: 'Sydney', code: 'SYD' },
    { name: 'Toronto', code: 'TOR' },
    { name: 'Dubai', code: 'DXB' },
  ];
  multiSelectCtrl = new FormControl<unknown[]>([]);

  formatMultiValue(value: unknown): string {
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : '(none)';
    }
    return String(value ?? '(none)');
  }

  // ── Cascade Select ─────────────────────────────
  geographyOptions: GlintMenuItem[] = [
    {
      label: 'North America',
      items: [
        {
          label: 'United States',
          items: [
            { label: 'New York' },
            { label: 'Los Angeles' },
            { label: 'Chicago' },
          ],
        },
        {
          label: 'Canada',
          items: [
            { label: 'Toronto' },
            { label: 'Vancouver' },
            { label: 'Montreal' },
          ],
        },
      ],
    },
    {
      label: 'Europe',
      items: [
        {
          label: 'United Kingdom',
          items: [
            { label: 'London' },
            { label: 'Manchester' },
            { label: 'Edinburgh' },
          ],
        },
        {
          label: 'France',
          items: [
            { label: 'Paris' },
            { label: 'Lyon' },
            { label: 'Marseille' },
          ],
        },
        {
          label: 'Germany',
          items: [
            { label: 'Berlin' },
            { label: 'Munich' },
            { label: 'Hamburg' },
          ],
        },
      ],
    },
    {
      label: 'Asia',
      items: [
        {
          label: 'Japan',
          items: [
            { label: 'Tokyo' },
            { label: 'Osaka' },
            { label: 'Kyoto' },
          ],
        },
        {
          label: 'South Korea',
          items: [
            { label: 'Seoul' },
            { label: 'Busan' },
          ],
        },
      ],
    },
  ];
  cascadeCtrl = new FormControl<string | null>(null);

  // ── Tree Select ────────────────────────────────
  treeData: GlintTreeNode[] = [
    {
      key: 'documents',
      label: 'Documents',
      children: [
        {
          key: 'work',
          label: 'Work',
          children: [
            { key: 'resume', label: 'Resume.pdf', leaf: true },
            { key: 'cover', label: 'Cover Letter.docx', leaf: true },
          ],
        },
        {
          key: 'personal',
          label: 'Personal',
          children: [
            { key: 'taxes', label: 'Taxes 2025.xlsx', leaf: true },
            { key: 'passport', label: 'Passport Scan.pdf', leaf: true },
          ],
        },
      ],
    },
    {
      key: 'photos',
      label: 'Photos',
      children: [
        { key: 'vacation', label: 'Vacation', children: [
          { key: 'beach', label: 'Beach.jpg', leaf: true },
          { key: 'mountain', label: 'Mountain.jpg', leaf: true },
        ]},
        { key: 'family', label: 'Family', children: [
          { key: 'reunion', label: 'Reunion.jpg', leaf: true },
        ]},
      ],
    },
    {
      key: 'music',
      label: 'Music',
      children: [
        { key: 'jazz', label: 'Jazz Playlist', leaf: true },
        { key: 'rock', label: 'Rock Classics', leaf: true },
      ],
    },
  ];
  treeCtrl = new FormControl<GlintTreeNode | null>(null);

  formatTreeValue(value: unknown): string {
    if (value == null) return '(none)';
    if (typeof value === 'object' && value !== null && 'label' in value) {
      return (value as GlintTreeNode).label ?? '(unknown)';
    }
    return String(value);
  }

  // ── Datepicker ─────────────────────────────────
  dateCtrl = new FormControl<Date | null>(null);

  formatDate(value: unknown): string {
    if (value instanceof Date) {
      const month = String(value.getMonth() + 1).padStart(2, '0');
      const day = String(value.getDate()).padStart(2, '0');
      const year = value.getFullYear();
      return `${month}/${day}/${year}`;
    }
    return '(none)';
  }

  // ── Color Picker ───────────────────────────────
  colorCtrl = new FormControl('#3b82f6');
}
