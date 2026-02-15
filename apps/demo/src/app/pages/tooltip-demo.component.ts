import { Component } from '@angular/core';
import { GlintButtonComponent, GlintTooltipDirective } from '@glint/ui';

@Component({
  selector: 'glint-tooltip-demo',
  standalone: true,
  imports: [GlintButtonComponent, GlintTooltipDirective],
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
    .hint { margin-block-start: 1rem; color: #64748b; font-size: 0.875rem; }
    code { background: #f1f5f9; padding: 0.125rem 0.375rem; border-radius: 4px; font-size: 0.8125rem; }
  `,
})
export class TooltipDemoComponent {}
