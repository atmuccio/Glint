import { Component } from '@angular/core';
import { GlintButtonComponent, GlintTooltipDirective } from '@glint-ng/core';

@Component({
  selector: 'glint-tooltip-demo',
  standalone: true,
  imports: [GlintButtonComponent, GlintTooltipDirective],
  host: { class: 'demo-page' },
  template: `
    <h2>Tooltip</h2>
    <p class="page-desc">Tooltips display brief informational text on hover or focus.</p>

    <div class="demo-section">
      <h3>Basic</h3>
      <div class="row">
        <glint-button glintTooltip="Save your changes" severity="primary">Save</glint-button>
        <glint-button glintTooltip="This action cannot be undone" severity="secondary">Delete</glint-button>
        <glint-button glintTooltip="View full details" severity="neutral" variant="outlined">Details</glint-button>
      </div>
    </div>

    <div class="demo-section">
      <h3>Disabled</h3>
      <div class="row">
        <glint-button [glintTooltip]="'This tooltip is disabled'" [glintTooltipDisabled]="true" severity="neutral" variant="outlined">Hover me (no tooltip)</glint-button>
      </div>
      <p class="hint">The tooltip on this button is programmatically disabled using <code>glintTooltipDisabled</code>. Hovering will not show any tooltip text.</p>
    </div>
  `,
  styles: `
    :host { display: block; }
    .hint { margin-block-start: 1rem; color: #64748b; font-size: 0.875rem; }
  `,
})
export class TooltipDemoComponent {}
