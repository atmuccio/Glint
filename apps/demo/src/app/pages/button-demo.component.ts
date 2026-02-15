import { Component } from '@angular/core';
import { GlintButtonComponent, GlintStyleZoneComponent, GlintColor } from '@glint/ui';

@Component({
  selector: 'glint-button-demo',
  standalone: true,
  imports: [GlintButtonComponent, GlintStyleZoneComponent],
  template: `
    <h2>Button</h2>

    <section>
      <h3>Variants</h3>
      <div class="row">
        <glint-button variant="filled" severity="primary">Filled</glint-button>
        <glint-button variant="outlined" severity="primary">Outlined</glint-button>
        <glint-button variant="ghost" severity="primary">Ghost</glint-button>
      </div>
    </section>

    <section>
      <h3>Severities</h3>
      <div class="row">
        <glint-button severity="primary">Primary</glint-button>
        <glint-button severity="secondary">Secondary</glint-button>
        <glint-button severity="neutral">Neutral</glint-button>
      </div>
    </section>

    <section>
      <h3>States</h3>
      <div class="row">
        <glint-button [disabled]="true">Disabled</glint-button>
        <glint-button [loading]="true">Loading</glint-button>
      </div>
    </section>

    <section>
      <h3>Themed Zone</h3>
      <glint-style-zone [theme]="{ colorPrimary: greenColor }">
        <div class="row">
          <glint-button severity="primary" variant="filled">Green Primary</glint-button>
          <glint-button severity="primary" variant="outlined">Green Outlined</glint-button>
        </div>
      </glint-style-zone>
    </section>
  `,
  styles: `
    :host { display: block; }
    section { margin-block-end: 2rem; }
    .row { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; }
  `,
})
export class ButtonDemoComponent {
  greenColor = GlintColor.Green.S500;
}
