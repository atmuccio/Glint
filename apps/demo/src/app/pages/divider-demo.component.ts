import { Component } from '@angular/core';
import { GlintDividerComponent } from '@glint/ui';

@Component({
  selector: 'glint-divider-demo',
  standalone: true,
  imports: [GlintDividerComponent],
  template: `
    <h2>Divider</h2>
    <p class="page-desc">Visual separators for content sections.</p>

    <div class="demo-section">
      <h3>Horizontal (default)</h3>
      <p>Content above the divider.</p>
      <glint-divider />
      <p>Content below the divider.</p>
    </div>

    <div class="demo-section">
      <h3>Horizontal with Label</h3>
      <p>Content above the divider.</p>
      <glint-divider label="OR" />
      <p>Content below the divider.</p>
    </div>

    <div class="demo-section">
      <h3>Vertical</h3>
      <div class="vertical-row">
        <span>Left content</span>
        <glint-divider orientation="vertical" />
        <span>Right content</span>
      </div>
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
    .stack { display: flex; flex-direction: column; gap: 1rem; }
    .vertical-row {
      display: flex;
      align-items: center;
      gap: 0;
      block-size: 2rem;
    }
    .vertical-row span {
      color: #475569;
      font-size: 0.875rem;
    }
    p { color: #475569; margin-block: 0.5rem; }
  `,
})
export class DividerDemoComponent {}
