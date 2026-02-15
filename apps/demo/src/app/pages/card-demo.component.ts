import { Component } from '@angular/core';
import { GlintCardComponent, GlintCardHeaderDirective, GlintCardFooterDirective, GlintButtonComponent } from '@glint/ui';

@Component({
  selector: 'glint-card-demo',
  standalone: true,
  imports: [GlintCardComponent, GlintCardHeaderDirective, GlintCardFooterDirective, GlintButtonComponent],
  template: `
    <h2>Card</h2>

    <section>
      <h3>Variants</h3>
      <div class="grid">
        <glint-card variant="flat">
          <div glintCardHeader>Flat Card</div>
          <p>This is a flat card with no elevation.</p>
        </glint-card>

        <glint-card variant="elevated">
          <div glintCardHeader>Elevated Card</div>
          <p>This card has a box shadow for depth.</p>
        </glint-card>

        <glint-card variant="outlined">
          <div glintCardHeader>Outlined Card</div>
          <p>This card has a visible border.</p>
          <div glintCardFooter>
            <glint-button variant="ghost" severity="primary">Action</glint-button>
          </div>
        </glint-card>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    section { margin-block-end: 2rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; }
    p { margin: 0.5rem 0; }
  `,
})
export class CardDemoComponent {}
