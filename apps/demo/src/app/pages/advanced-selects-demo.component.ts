import { Component, ChangeDetectionStrategy, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  GlintAutoCompleteComponent,
  GlintMultiSelectComponent,
  GlintCascadeSelectComponent,
  GlintTreeSelectComponent,
  GlintDatepickerComponent,
  GlintDatepickerDayDirective,
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
    GlintDatepickerDayDirective,
    GlintColorPickerComponent,
  ],
  host: { class: 'demo-page' },
  styles: `
    :host { display: block; }
    .color-preview {
      display: inline-block; inline-size: 1.25rem; block-size: 1.25rem;
      border-radius: 4px; border: 1px solid #e2e8f0; vertical-align: middle;
      margin-inline-end: 0.5rem;
    }
    .custom-day {
      display: inline-flex; align-items: center; justify-content: center;
      inline-size: 2rem; block-size: 2rem; border-radius: 50%; font-size: 0.8125rem;
    }
    .custom-day--today {
      background: #3b82f6; color: white; font-weight: 700;
    }
    .custom-day--other { opacity: 0.35; }
    .custom-day--selected:not(.custom-day--today) {
      outline: 2px solid #3b82f6; outline-offset: -2px;
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

    <!-- ── Datepicker Custom Day Template ───────────── -->
    <div class="demo-section">
      <h3>Datepicker — Custom Day Template</h3>
      <p class="section-desc">Use the <code>glintDatepickerDay</code> structural directive to render custom day cells. This example highlights today and dims other-month days.</p>

      <div class="stack">
        <div>
          <glint-datepicker placeholder="Custom day cells" [formControl]="customDayCtrl">
            <ng-template glintDatepickerDay let-date let-today="today" let-otherMonth="otherMonth" let-selected="selected">
              <span class="custom-day" [class.custom-day--today]="today" [class.custom-day--other]="otherMonth" [class.custom-day--selected]="selected">
                {{ date.getDate() }}
              </span>
            </ng-template>
          </glint-datepicker>
          <div class="output">Value: {{ formatDate(customDayCtrl.value) }}</div>
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
  customDayCtrl = new FormControl<Date | null>(null);

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
