import { Component } from '@angular/core';
import {
  GlintStyleZoneComponent,
  GlintButtonComponent,
  GlintCardComponent,
  GlintCardHeaderDirective,
  GlintInputComponent,
  GlintColor,
  DARK_ZONE,
  COMPACT_ZONE,
  DANGER_ZONE,
  SOFT_ZONE,
  DARK_COMPACT_ZONE,
} from '@glint/ui';
import type { ZoneTheme } from '@glint/ui';

@Component({
  selector: 'glint-theme-demo',
  standalone: true,
  imports: [GlintStyleZoneComponent, GlintButtonComponent, GlintCardComponent, GlintCardHeaderDirective, GlintInputComponent],
  template: `
    <h2>Theme Zones</h2>

    <section>
      <h3>Default Theme</h3>
      <div class="row">
        <glint-button severity="primary" variant="filled">Primary</glint-button>
        <glint-button severity="secondary" variant="filled">Secondary</glint-button>
        <glint-button severity="neutral" variant="filled">Neutral</glint-button>
      </div>
    </section>

    <section>
      <h3>Dark Zone</h3>
      <glint-style-zone [theme]="darkZone">
        <glint-card variant="flat">
          <div glintCardHeader>Dark Card</div>
          <div class="row">
            <glint-button severity="primary" variant="filled">Primary</glint-button>
            <glint-button severity="primary" variant="outlined">Outlined</glint-button>
          </div>
          <glint-input label="Dark Input" placeholder="Type here..." />
        </glint-card>
      </glint-style-zone>
    </section>

    <section>
      <h3>Danger Zone</h3>
      <glint-style-zone [theme]="dangerZone">
        <div class="row">
          <glint-button severity="primary" variant="filled">Delete All</glint-button>
          <glint-button severity="primary" variant="outlined">Remove</glint-button>
        </div>
      </glint-style-zone>
    </section>

    <section>
      <h3>Compact Zone</h3>
      <glint-style-zone [theme]="compactZone">
        <div class="row">
          <glint-button severity="primary" variant="filled">Compact</glint-button>
          <glint-button severity="secondary" variant="filled">Compact</glint-button>
        </div>
      </glint-style-zone>
    </section>

    <section>
      <h3>Soft Zone</h3>
      <glint-style-zone [theme]="softZone">
        <glint-card variant="elevated">
          <div glintCardHeader>Soft Card</div>
          <p>Rounded corners and softer shadows.</p>
        </glint-card>
      </glint-style-zone>
    </section>

    <section>
      <h3>Nested Zones</h3>
      <glint-style-zone [theme]="darkZone">
        <glint-card variant="flat">
          <div glintCardHeader>Outer Dark Zone</div>
          <div class="row" style="margin-block-end: 1rem;">
            <glint-button severity="primary" variant="filled">Dark Primary</glint-button>
          </div>
          <glint-style-zone [theme]="nestedGreenTheme">
            <div class="row">
              <glint-button severity="primary" variant="filled">Green Inside Dark</glint-button>
              <glint-button severity="primary" variant="outlined">Green Outlined</glint-button>
            </div>
          </glint-style-zone>
        </glint-card>
      </glint-style-zone>
    </section>

    <section>
      <h3>Dark + Compact (Pre-composed)</h3>
      <glint-style-zone [theme]="darkCompactZone">
        <div class="row">
          <glint-button severity="primary" variant="filled">Dark Compact</glint-button>
          <glint-button severity="secondary" variant="outlined">Dark Compact</glint-button>
        </div>
      </glint-style-zone>
    </section>
  `,
  styles: `
    :host { display: block; }
    section { margin-block-end: 2rem; }
    .row { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; }
    p { margin: 0.5rem 0; }
  `,
})
export class ThemeDemoComponent {
  darkZone = DARK_ZONE;
  compactZone = COMPACT_ZONE;
  dangerZone = DANGER_ZONE;
  softZone = SOFT_ZONE;
  darkCompactZone = DARK_COMPACT_ZONE;
  nestedGreenTheme: Partial<ZoneTheme> = {
    colorPrimary: GlintColor.Green.S400,
    colorPrimaryContrast: GlintColor.White,
  };
}
