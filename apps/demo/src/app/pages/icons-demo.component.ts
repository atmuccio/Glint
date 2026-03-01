import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  GlintIconComponent,
  GlintButtonComponent,
  GlintMessageComponent,
  GlintStyleZoneComponent,
  DARK_ZONE,
} from '@glint-ng/core';

const DEFAULT_ICON_NAMES = [
  'x', 'check', 'plus', 'minus', 'search', 'pencil', 'trash',
  'chevronDown', 'chevronUp', 'chevronLeft', 'chevronRight',
  'chevronsLeft', 'chevronsRight', 'chevronsUp', 'chevronsDown',
  'arrowUp', 'arrowDown', 'arrowLeft', 'arrowRight',
  'arrowUpDown', 'arrowLeftRight',
  'circleCheck', 'info', 'triangleAlert', 'circleX',
  'star', 'eye', 'eyeOff', 'gripVertical', 'menu',
  'externalLink', 'ellipsisVertical', 'maximize', 'layoutGrid',
  'calendar',
];

@Component({
  selector: 'glint-icons-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GlintIconComponent,
    GlintButtonComponent,
    GlintMessageComponent,
    GlintStyleZoneComponent,
  ],
  template: `
    <h2>Icons</h2>
    <p class="page-desc">
      Library-agnostic SVG icon system. Defaults to Lucide, extensible with any icon set via
      <code>provideGlintIcons()</code> and <code>mapIcons()</code>.
    </p>

    <div class="demo-section">
      <h3>Default Icon Set (~36 icons)</h3>
      <p class="section-desc">Registered automatically by <code>provideGlintUI()</code>.</p>
      <div class="icon-grid">
        @for (name of iconNames; track name) {
          <div class="icon-cell">
            <glint-icon [name]="name" />
            <span class="icon-name">{{ name }}</span>
          </div>
        }
      </div>
    </div>

    <div class="demo-section">
      <h3>Sizes</h3>
      <div class="row">
        <div class="size-example">
          <glint-icon name="star" size="0.75rem" />
          <span>0.75rem</span>
        </div>
        <div class="size-example">
          <glint-icon name="star" size="1rem" />
          <span>1rem</span>
        </div>
        <div class="size-example">
          <glint-icon name="star" size="1.5rem" />
          <span>1.5rem</span>
        </div>
        <div class="size-example">
          <glint-icon name="star" size="2rem" />
          <span>2rem</span>
        </div>
        <div class="size-example">
          <glint-icon name="star" size="3rem" />
          <span>3rem</span>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h3>Stroke Width</h3>
      <div class="row">
        <div class="size-example">
          <glint-icon name="search" size="2rem" strokeWidth="1" />
          <span>1</span>
        </div>
        <div class="size-example">
          <glint-icon name="search" size="2rem" strokeWidth="1.5" />
          <span>1.5</span>
        </div>
        <div class="size-example">
          <glint-icon name="search" size="2rem" />
          <span>2 (default)</span>
        </div>
        <div class="size-example">
          <glint-icon name="search" size="2rem" strokeWidth="2.5" />
          <span>2.5</span>
        </div>
        <div class="size-example">
          <glint-icon name="search" size="2rem" strokeWidth="3" />
          <span>3</span>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h3>Color Inheritance</h3>
      <p class="section-desc">Icons inherit <code>currentColor</code> from their parent.</p>
      <div class="row">
        <glint-button variant="filled" severity="primary"><glint-icon name="plus" /> Add Item</glint-button>
        <glint-button variant="filled" severity="success"><glint-icon name="check" /> Confirm</glint-button>
        <glint-button variant="filled" severity="danger"><glint-icon name="trash" /> Delete</glint-button>
        <glint-button variant="outlined" severity="primary"><glint-icon name="pencil" /> Edit</glint-button>
        <glint-button variant="ghost" severity="danger"><glint-icon name="x" /> Cancel</glint-button>
      </div>
    </div>

    <div class="demo-section">
      <h3>Inside Messages</h3>
      <div class="row" style="flex-direction: column; align-items: stretch;">
        <glint-message severity="success" [closable]="false">Operation completed</glint-message>
        <glint-message severity="info" [closable]="false">Information message</glint-message>
        <glint-message severity="warning" [closable]="false">Warning: check your input</glint-message>
        <glint-message severity="danger" [closable]="false">Error: something went wrong</glint-message>
      </div>
    </div>

    <div class="demo-section">
      <h3>Dark Theme</h3>
      <glint-style-zone [theme]="DARK_ZONE">
        <div class="dark-surface">
          <div class="row">
            @for (name of sampleIcons; track name) {
              <div class="icon-cell">
                <glint-icon [name]="name" size="1.5rem" />
                <span class="icon-name">{{ name }}</span>
              </div>
            }
          </div>
        </div>
      </glint-style-zone>
    </div>

    <div class="demo-section">
      <h3>Accessibility</h3>
      <p class="section-desc">Decorative icons get <code>aria-hidden="true"</code>. Use the <code>label</code> input for meaningful icons.</p>
      <div class="row">
        <div class="a11y-example">
          <glint-icon name="search" size="1.5rem" />
          <code>aria-hidden="true"</code>
        </div>
        <div class="a11y-example">
          <glint-icon name="triangleAlert" size="1.5rem" label="Warning" />
          <code>aria-label="Warning"</code>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h3>Usage</h3>
      <pre class="code-block">// In template
&lt;glint-icon name="check" /&gt;
&lt;glint-icon name="star" size="2rem" /&gt;
&lt;glint-icon [name]="iconName()" label="Close" /&gt;

// Register additional Lucide icons
import {{ '{' }} Home, Users {{ '}' }} from 'lucide';
import {{ '{' }} mapIcons, lucideToSvg, provideGlintIcons {{ '}' }} from '&#64;glint/ui';

provideGlintIcons(mapIcons({{ '{' }} home: Home, users: Users {{ '}' }}, lucideToSvg))

// Register any icon library
provideGlintIcons(mapIcons(heroicons, myHeroConverter))

// Direct SVG strings
provideGlintIcons({{ '{' }} logo: '&lt;svg&gt;...&lt;/svg&gt;' {{ '}' }})</pre>
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
    .section-desc { color: #64748b; margin-block: -0.5rem 1rem; font-size: 0.875rem; }
    .row { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; }
    code { background: #f1f5f9; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-size: 0.8125rem; }

    .icon-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(7.5rem, 1fr));
      gap: 0.5rem;
    }

    .icon-cell {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.375rem;
      padding: 0.75rem 0.5rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      transition: background-color 0.15s;
    }

    .icon-cell:hover {
      background: #f8fafc;
    }

    .icon-cell glint-icon {
      font-size: 1.25rem;
      color: #334155;
    }

    .icon-name {
      font-size: 0.6875rem;
      color: #94a3b8;
      font-family: monospace;
      text-align: center;
      word-break: break-all;
    }

    .size-example {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }

    .size-example span {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .dark-surface {
      background: var(--glint-color-surface, #1e293b);
      color: var(--glint-color-text, #f8fafc);
      border-radius: 0.5rem;
      padding: 1.5rem;
    }

    .dark-surface .icon-cell {
      border-color: rgba(255, 255, 255, 0.1);
    }

    .dark-surface .icon-cell:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    .dark-surface .icon-cell glint-icon {
      color: #e2e8f0;
    }

    .dark-surface .icon-name {
      color: #94a3b8;
    }

    .a11y-example {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .code-block {
      background: #1e293b;
      color: #e2e8f0;
      padding: 1.25rem;
      border-radius: 0.5rem;
      font-size: 0.8125rem;
      line-height: 1.6;
      overflow-x: auto;
      white-space: pre;
    }
  `,
})
export class IconsDemoComponent {
  protected readonly DARK_ZONE = DARK_ZONE;
  protected readonly iconNames = DEFAULT_ICON_NAMES;
  protected readonly sampleIcons = [
    'check', 'x', 'search', 'star', 'eye', 'info', 'triangleAlert', 'menu',
  ];
}
