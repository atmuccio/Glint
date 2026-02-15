import { Component } from '@angular/core';
import { GlintButtonComponent, GlintTooltipDirective } from '@glint/ui';

@Component({
  selector: 'glint-tooltip-demo',
  standalone: true,
  imports: [GlintButtonComponent, GlintTooltipDirective],
  template: `
    <h2>Tooltip</h2>

    <section>
      <h3>Basic Usage</h3>
      <div class="row">
        <glint-button glintTooltip="Save your changes">Hover me</glint-button>
        <glint-button glintTooltip="This action cannot be undone" severity="secondary">Another tooltip</glint-button>
        <glint-button [glintTooltip]="'Disabled tooltip'" [glintTooltipDisabled]="true">Disabled</glint-button>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    section { margin-block-end: 2rem; }
    .row { display: flex; gap: 0.75rem; flex-wrap: wrap; }
  `,
})
export class TooltipDemoComponent {}
