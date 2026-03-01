import { Component } from '@angular/core';
import { GlintButtonComponent, GlintStyleZoneComponent, GlintColor } from '@glint-ng/core';

@Component({
  selector: 'glint-button-demo',
  standalone: true,
  imports: [GlintButtonComponent, GlintStyleZoneComponent],
  template: `
    <h2>Button</h2>
    <p class="page-desc">Buttons communicate actions users can take.</p>

    <div class="demo-section">
      <h3>Severities</h3>
      <div class="row">
        <glint-button variant="filled" severity="primary">Primary</glint-button>
        <glint-button variant="filled" severity="secondary">Secondary</glint-button>
        <glint-button variant="filled" severity="success">Success</glint-button>
        <glint-button variant="filled" severity="warning">Warning</glint-button>
        <glint-button variant="filled" severity="danger">Danger</glint-button>
        <glint-button variant="filled" severity="neutral">Neutral</glint-button>
      </div>
    </div>

    <div class="demo-section">
      <h3>Variants</h3>

      <p class="variant-label">Filled</p>
      <div class="row">
        <glint-button variant="filled" severity="primary">Primary</glint-button>
        <glint-button variant="filled" severity="secondary">Secondary</glint-button>
        <glint-button variant="filled" severity="danger">Danger</glint-button>
      </div>

      <p class="variant-label">Outlined</p>
      <div class="row">
        <glint-button variant="outlined" severity="primary">Primary</glint-button>
        <glint-button variant="outlined" severity="secondary">Secondary</glint-button>
        <glint-button variant="outlined" severity="danger">Danger</glint-button>
      </div>

      <p class="variant-label">Ghost</p>
      <div class="row">
        <glint-button variant="ghost" severity="primary">Primary</glint-button>
        <glint-button variant="ghost" severity="secondary">Secondary</glint-button>
        <glint-button variant="ghost" severity="danger">Danger</glint-button>
      </div>
    </div>

    <div class="demo-section">
      <h3>States</h3>
      <div class="row">
        <glint-button [disabled]="true">Disabled</glint-button>
        <glint-button [loading]="true">Loading</glint-button>
      </div>
    </div>

    <div class="demo-section">
      <h3>Themed Zone</h3>
      <glint-style-zone [theme]="{ colorPrimary: greenColor }">
        <div class="row">
          <glint-button severity="primary" variant="filled">Green Primary</glint-button>
          <glint-button severity="primary" variant="outlined">Green Outlined</glint-button>
          <glint-button severity="primary" variant="ghost">Green Ghost</glint-button>
        </div>
      </glint-style-zone>
    </div>
  `,
  styles: `
    :host { display: block; }
    h2 { margin-block: 0 0.25rem; font-size: 1.75rem; font-weight: 600; color: #1e293b; }
    .page-desc { color: #64748b; margin-block: 0 2rem; font-size: 1.25rem; }
    .demo-section {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 0.625rem;
      padding: 2rem;
      margin-block-end: 1.5rem;
    }
    .demo-section h3 { margin-block: 0 1rem; font-size: 1rem; font-weight: 600; color: #334155; }
    .row { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; }
    .variant-label {
      margin-block: 1.25rem 0.5rem;
      font-size: 0.8125rem;
      font-weight: 500;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }
    .variant-label:first-of-type { margin-block-start: 0; }
  `,
})
export class ButtonDemoComponent {
  greenColor = GlintColor.Green.S500;
}
