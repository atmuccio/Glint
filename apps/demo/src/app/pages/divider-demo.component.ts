import { Component } from '@angular/core';
import { GlintDividerComponent } from '@glint-ng/core';

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
  host: { class: 'demo-page' },
  styles: `
    :host { display: block; }
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
