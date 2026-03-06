import { Component } from '@angular/core';
import { GlintCardComponent, GlintCardHeaderDirective, GlintCardFooterDirective, GlintButtonComponent } from '@glint-ng/core';

@Component({
  selector: 'glint-card-demo',
  standalone: true,
  imports: [GlintCardComponent, GlintCardHeaderDirective, GlintCardFooterDirective, GlintButtonComponent],
  template: `
    <h2>Card</h2>
    <p class="page-desc">Card is a flexible container for grouping content.</p>

    <div class="demo-section">
      <h3>Variants</h3>
      <div class="grid">
        <glint-card variant="flat">
          <div glintCardHeader>Flat Card</div>
          <p>This is a flat card with no elevation or border styling. It blends seamlessly into the surrounding layout.</p>
          <p>Use flat cards when you want to group content without adding visual weight to the interface.</p>
        </glint-card>

        <glint-card variant="elevated">
          <div glintCardHeader>Elevated Card</div>
          <p>This card uses a subtle box shadow to create a sense of depth and separation from the background.</p>
          <p>Elevated cards are ideal for highlighting important content or interactive sections.</p>
        </glint-card>

        <glint-card variant="outlined">
          <div glintCardHeader>Outlined Card</div>
          <p>This card features a visible border that clearly defines its boundaries without adding elevation.</p>
          <p>Outlined cards work well in dense layouts where shadow effects would be too visually busy.</p>
        </glint-card>
      </div>
    </div>

    <div class="demo-section">
      <h3>With Actions</h3>
      <glint-card variant="elevated">
        <div glintCardHeader>Project Settings</div>
        <p>Review and update your project configuration. Changes will be applied immediately after saving.</p>
        <p>Make sure to verify all settings before confirming to avoid unintended side effects.</p>
        <div glintCardFooter>
          <glint-button variant="ghost" severity="neutral">Cancel</glint-button>
          <glint-button variant="filled" severity="primary">Save</glint-button>
        </div>
      </glint-card>
    </div>
  `,
  host: { class: 'demo-page' },
  styles: `
    :host { display: block; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; }
    p { margin: 0.5rem 0; color: #475569; line-height: 1.5; }
  `,
})
export class CardDemoComponent {}
