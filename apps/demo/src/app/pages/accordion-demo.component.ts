import { Component } from '@angular/core';
import {
  GlintAccordionComponent,
  GlintAccordionPanelComponent,
} from '@glint-ng/core';

@Component({
  selector: 'glint-accordion-demo',
  standalone: true,
  imports: [
    GlintAccordionComponent,
    GlintAccordionPanelComponent,
  ],
  template: `
    <h2>Accordion</h2>
    <p class="page-desc">Expandable panels for organizing content into collapsible sections.</p>

    <div class="demo-section">
      <h3>Single Expand</h3>
      <glint-accordion>
        <glint-accordion-panel header="What is Angular?">
          <p>Angular is a platform and framework for building single-page client applications using HTML and TypeScript. It implements core and optional functionality as a set of TypeScript libraries that you import into your applications.</p>
        </glint-accordion-panel>
        <glint-accordion-panel header="What are Signals?">
          <p>Signals are a reactive primitive introduced in Angular that provide a way to express and manage state changes. They enable fine-grained reactivity and improve change detection performance.</p>
        </glint-accordion-panel>
        <glint-accordion-panel header="What is NgRx?">
          <p>NgRx is a framework for building reactive applications in Angular. It provides libraries for managing global and local state, isolation of side effects, entity collection management, and router integration.</p>
        </glint-accordion-panel>
      </glint-accordion>
    </div>

    <div class="demo-section">
      <h3>Multiple Expand</h3>
      <glint-accordion [multiple]="true">
        <glint-accordion-panel header="Getting Started">
          <p>Install the library with npm, import the components you need, and wrap your app in a style zone for theming support. All components are standalone and tree-shakeable.</p>
        </glint-accordion-panel>
        <glint-accordion-panel header="Theming">
          <p>Use CSS custom properties to customize colors, spacing, typography, and more. Style zones cascade themes to child components, including overlays like dialogs and tooltips.</p>
        </glint-accordion-panel>
        <glint-accordion-panel header="Accessibility">
          <p>All components follow WAI-ARIA patterns with proper roles, keyboard navigation, and screen reader support. Focus management is handled automatically for interactive components.</p>
        </glint-accordion-panel>
      </glint-accordion>
    </div>

    <div class="demo-section">
      <h3>With Disabled Panel</h3>
      <glint-accordion>
        <glint-accordion-panel header="Available Section">
          <p>This section is available and can be expanded or collapsed normally.</p>
        </glint-accordion-panel>
        <glint-accordion-panel header="Disabled Section" [disabled]="true">
          <p>This content is not accessible because the panel is disabled.</p>
        </glint-accordion-panel>
        <glint-accordion-panel header="Another Available Section">
          <p>This section is also available. Only the middle panel is disabled in this example.</p>
        </glint-accordion-panel>
      </glint-accordion>
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
  `,
})
export class AccordionDemoComponent {}
