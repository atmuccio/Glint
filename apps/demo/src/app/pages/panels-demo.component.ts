import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  GlintPanelComponent,
  GlintInplaceComponent,
  GlintInplaceDisplayDirective,
  GlintInplaceContentDirective,
  GlintSplitterComponent,
  GlintSplitterPanelComponent,
  GlintScrollPanelComponent,
  GlintEditorComponent,
  GlintButtonComponent,
} from '@glint-ng/core';

@Component({
  selector: 'glint-panels-demo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    GlintPanelComponent,
    GlintInplaceComponent,
    GlintInplaceDisplayDirective,
    GlintInplaceContentDirective,
    GlintSplitterComponent,
    GlintSplitterPanelComponent,
    GlintScrollPanelComponent,
    GlintEditorComponent,
    GlintButtonComponent,
  ],
  host: { class: 'demo-page' },
  template: `
    <h2>Panels &amp; Editors</h2>
    <p class="page-desc">Panel containers, splitters, inline editing, scroll panels, and rich text editing.</p>

    <!-- Panel -->
    <div class="demo-section">
      <h3>Panel - Basic</h3>
      <glint-panel header="Project Details">
        <p>This is a basic panel with a fixed header and content area. Panels provide
        a structured way to group related content with a prominent header.</p>
      </glint-panel>
    </div>

    <div class="demo-section">
      <h3>Panel - Toggleable</h3>
      <glint-panel header="Advanced Settings" [toggleable]="true" [(collapsed)]="panelCollapsed">
        <button glintPanelIcons style="border: none; background: transparent; cursor: pointer;">&#9881;</button>
        <p>This panel can be collapsed and expanded by clicking the header.
        Use toggleable panels to let users hide less important content.</p>
        <ul>
          <li>Setting A: Enabled</li>
          <li>Setting B: Auto-detect</li>
          <li>Setting C: Default profile</li>
        </ul>
        <div glintPanelFooter>
          <glint-button severity="primary" variant="filled" size="sm">Save</glint-button>
          <glint-button severity="neutral" variant="outlined" size="sm">Reset</glint-button>
        </div>
      </glint-panel>
      <div class="output">Panel collapsed: {{ panelCollapsed }}</div>
    </div>

    <!-- Inplace -->
    <div class="demo-section">
      <h3>Inplace - Click to Edit</h3>
      <p class="section-desc">Click the text below to switch to edit mode.</p>
      <div class="stack">
        <div>
          <strong>Display name:</strong>
          <glint-inplace [closable]="true">
            <span glintInplaceDisplay>{{ inplaceText || 'Click to edit...' }}</span>
            <input
              glintInplaceContent
              type="text"
              [value]="inplaceText"
              (input)="onInplaceInput($event)"
              placeholder="Enter your name"
              style="padding: 0.25rem 0.5rem; border: 1px solid #cbd5e1; border-radius: 4px; font: inherit;"
            />
          </glint-inplace>
        </div>
        <div>
          <strong>Email:</strong>
          <glint-inplace [closable]="true">
            <span glintInplaceDisplay>{{ inplaceEmail || 'Click to edit...' }}</span>
            <input
              glintInplaceContent
              type="email"
              [value]="inplaceEmail"
              (input)="onInplaceEmailInput($event)"
              placeholder="Enter your email"
              style="padding: 0.25rem 0.5rem; border: 1px solid #cbd5e1; border-radius: 4px; font: inherit;"
            />
          </glint-inplace>
        </div>
      </div>
    </div>

    <!-- Splitter Horizontal -->
    <div class="demo-section">
      <h3>Splitter - Horizontal</h3>
      <p class="section-desc">Drag the gutter between panels to resize. Use keyboard arrows for accessibility.</p>
      <div style="height: 200px; border: 1px solid #e2e8f0; border-radius: 0.5rem; overflow: hidden;">
        <glint-splitter layout="horizontal" [gutterSize]="6">
          <glint-splitter-panel [size]="30" [minSize]="15">
            <div class="splitter-content sidebar-panel">
              <h4>Sidebar</h4>
              <ul>
                <li>Dashboard</li>
                <li>Projects</li>
                <li>Settings</li>
                <li>Reports</li>
              </ul>
            </div>
          </glint-splitter-panel>
          <glint-splitter-panel [size]="70" [minSize]="30">
            <div class="splitter-content main-panel">
              <h4>Main Content</h4>
              <p>This panel takes the remaining space. Drag the gutter to adjust the sidebar width.</p>
            </div>
          </glint-splitter-panel>
        </glint-splitter>
      </div>
    </div>

    <!-- Splitter Vertical -->
    <div class="demo-section">
      <h3>Splitter - Vertical</h3>
      <div style="height: 300px; border: 1px solid #e2e8f0; border-radius: 0.5rem; overflow: hidden;">
        <glint-splitter layout="vertical" [gutterSize]="6">
          <glint-splitter-panel [size]="40" [minSize]="20">
            <div class="splitter-content">
              <h4>Code Editor</h4>
              <pre class="code-block">const greeting = 'Hello, World!';
console.log(greeting);</pre>
            </div>
          </glint-splitter-panel>
          <glint-splitter-panel [size]="60" [minSize]="20">
            <div class="splitter-content">
              <h4>Output Console</h4>
              <pre class="console-block">> Hello, World!</pre>
            </div>
          </glint-splitter-panel>
        </glint-splitter>
      </div>
    </div>

    <!-- ScrollPanel -->
    <div class="demo-section">
      <h3>ScrollPanel - Custom Scrollbar</h3>
      <p class="section-desc">A container with thin, theme-aware custom scrollbars.</p>
      <glint-scroll-panel style="width: 100%; height: 200px;">
        <div style="padding: 1rem;">
          <h4 style="margin-block: 0 0.5rem;">The History of Computing</h4>
          <p>The history of computing hardware covers the developments from early simple devices
          to aid calculation to modern day computers. Before the 20th century, most calculations
          were done by humans.</p>
          <p>Early mechanical tools to help humans with digital calculations, like the abacus,
          were called "calculating machines", "calculators", or simply "computers".</p>
          <p>The first aids to computation were purely mechanical devices which required the
          operator to set up the initial values of an elementary arithmetic operation, then
          manipulate the device to obtain the result.</p>
          <p>Later, computers represented numbers in a continuous form, for instance distance
          along a scale, rotation of a shaft, or a voltage. Numbers could also be represented
          in the form of digits, automatically manipulated by a mechanism.</p>
          <p>Although this approach generally required more complex mechanisms, it greatly
          increased the precision of results. The development of transistor technology and
          then the integrated circuit chip led to a series of breakthroughs, starting with
          transistor computers and then integrated circuit computers.</p>
          <p>The cost of computers gradually became so low that personal computers by the
          1980s, and then mobile computers (smartphones and tablets) in the 2000s, became
          ubiquitous.</p>
        </div>
      </glint-scroll-panel>
    </div>

    <!-- Editor -->
    <div class="demo-section">
      <h3>Editor - Rich Text</h3>
      <p class="section-desc">A contenteditable rich text editor with formatting toolbar. Integrated with Reactive Forms.</p>
      <glint-editor
        [formControl]="editorCtrl"
        placeholder="Start typing here..."
        height="200px"
      />
      @if (editorCtrl.value) {
        <div class="output">
          <strong>HTML output:</strong><br/>
          <code>{{ editorCtrl.value }}</code>
        </div>
      }
    </div>
  `,
  styles: `
    :host { display: block; }

    p { color: #475569; margin-block: 0.25rem; line-height: 1.5; }

    .splitter-content {
      padding: 1rem;
      height: 100%;
      box-sizing: border-box;
    }
    .splitter-content h4 { margin-block: 0 0.5rem; font-size: 0.875rem; color: #334155; }
    .splitter-content p { font-size: 0.875rem; }
    .splitter-content ul { margin: 0; padding-inline-start: 1.25rem; }
    .splitter-content li { padding-block: 0.125rem; font-size: 0.875rem; color: #475569; }
    .sidebar-panel { background: #f8fafc; }
    .main-panel { background: #ffffff; }

    .code-block {
      margin: 0; padding: 0.75rem; background: #1e293b; color: #e2e8f0;
      border-radius: 0.375rem; font-size: 0.8125rem; overflow-x: auto;
    }
    .console-block {
      margin: 0; padding: 0.75rem; background: #0f172a; color: #4ade80;
      border-radius: 0.375rem; font-size: 0.8125rem;
    }

    code { word-break: break-all; }
  `,
})
export class PanelsDemoComponent {
  panelCollapsed = false;
  inplaceText = 'John Doe';
  inplaceEmail = 'john@example.com';

  editorCtrl = new FormControl('<p>Hello <strong>World</strong>! This is a rich text editor.</p>');

  onInplaceInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.inplaceText = target.value;
  }

  onInplaceEmailInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.inplaceEmail = target.value;
  }
}
