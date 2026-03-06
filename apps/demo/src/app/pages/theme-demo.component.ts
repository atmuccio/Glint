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
} from '@glint-ng/core';
import type { ZoneTheme } from '@glint-ng/core';

@Component({
  selector: 'glint-theme-demo',
  standalone: true,
  imports: [GlintStyleZoneComponent, GlintButtonComponent, GlintCardComponent, GlintCardHeaderDirective, GlintInputComponent],
  template: `
    <h2>Theme Zones</h2>
    <p class="page-desc">Style Zones provide cascading theme customization through CSS custom properties and DI.</p>

    <div class="demo-section">
      <h3>Default Theme</h3>
      <p>The default theme provides the baseline look and feel. All components render with standard colors, spacing, and typography.</p>
      <div class="row">
        <glint-button severity="primary" variant="filled">Primary</glint-button>
        <glint-button severity="secondary" variant="filled">Secondary</glint-button>
        <glint-button severity="neutral" variant="filled">Neutral</glint-button>
      </div>
    </div>

    <div class="demo-section">
      <h3>Dark Zone</h3>
      <p>Applies a dark color scheme to all nested components. Backgrounds, text, and accent colors are adjusted for dark surfaces.</p>
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
    </div>

    <div class="demo-section">
      <h3>Danger Zone</h3>
      <p>Overrides the primary color to a destructive red, signaling dangerous or irreversible actions to the user.</p>
      <glint-style-zone [theme]="dangerZone">
        <div class="row">
          <glint-button severity="primary" variant="filled">Delete All</glint-button>
          <glint-button severity="primary" variant="outlined">Remove</glint-button>
        </div>
      </glint-style-zone>
    </div>

    <div class="demo-section">
      <h3>Compact Zone</h3>
      <p>Reduces padding and font sizes for denser layouts. Useful for toolbars, sidebars, or data-heavy interfaces.</p>
      <glint-style-zone [theme]="compactZone">
        <div class="row">
          <glint-button severity="primary" variant="filled">Compact</glint-button>
          <glint-button severity="secondary" variant="filled">Compact</glint-button>
        </div>
      </glint-style-zone>
    </div>

    <div class="demo-section">
      <h3>Soft Zone</h3>
      <p>Applies larger border radii and softer shadows for a gentle, rounded appearance throughout the zone.</p>
      <glint-style-zone [theme]="softZone">
        <glint-card variant="elevated">
          <div glintCardHeader>Soft Card</div>
          <p>Rounded corners and softer shadows.</p>
        </glint-card>
      </glint-style-zone>
    </div>

    <div class="demo-section">
      <h3>Nested Zones</h3>
      <p>Zones can be nested to compose multiple theme overrides. Inner zones inherit from outer zones and apply additional customizations.</p>
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
    </div>

    <div class="demo-section">
      <h3>Dark + Compact (Pre-composed)</h3>
      <p>A pre-composed zone that combines dark and compact themes into a single reusable configuration.</p>
      <glint-style-zone [theme]="darkCompactZone">
        <div style="background: var(--glint-color-surface); padding: 1rem; border-radius: 0.5rem;">
          <div class="row">
            <glint-button severity="primary" variant="filled">Dark Compact</glint-button>
            <glint-button severity="secondary" variant="outlined">Dark Compact</glint-button>
          </div>
        </div>
      </glint-style-zone>
    </div>
  `,
  host: { class: 'demo-page' },
  styles: `
    :host { display: block; }
    p { margin: 0.25rem 0 1rem; color: #475569; font-size: 0.875rem; line-height: 1.5; }
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
