import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  GlintButtonComponent,
  GlintCardComponent,
  GlintBadgeComponent,
  GlintIconComponent,
  GlintStyleZoneComponent,
  GlintColor,
  DARK_ZONE,
} from '@glint-ng/core';
import type { CSSColor } from '@glint-ng/core';

interface FeatureCard {
  icon: string;
  title: string;
  description: string;
}

interface DemoSection {
  title: string;
  route: string;
  items: string[];
}

@Component({
  selector: 'glint-home',
  standalone: true,
  imports: [
    RouterLink,
    GlintButtonComponent,
    GlintCardComponent,
    GlintBadgeComponent,
    GlintIconComponent,
    GlintStyleZoneComponent,
  ],
  template: `
    <div class="home">
      <section class="hero">
        <div class="hero-badge">
          <glint-badge value="v0.1.0" severity="primary" />
          <span class="hero-badge-label">Open Source</span>
        </div>
        <h1>Glint UI</h1>
        <p class="hero-tagline">
          Angular Style Zone UI component library — 80+ themeable components
          built on Angular CDK with signal-based cascading style customization.
        </p>
        <div class="hero-actions">
          <glint-button severity="primary" variant="filled" routerLink="/button">
            Explore Components
          </glint-button>
          <glint-button severity="secondary" variant="outlined" routerLink="/theme">
            See Theming
          </glint-button>
        </div>
      </section>

      <section class="features">
        <h2>Features</h2>
        <div class="feature-grid">
          @for (feature of features; track feature.title) {
            <glint-card>
              <div class="feature-card">
                <glint-icon [name]="feature.icon" size="24" />
                <h3>{{ feature.title }}</h3>
                <p>{{ feature.description }}</p>
              </div>
            </glint-card>
          }
        </div>
      </section>

      <section class="demo-nav">
        <h2>Explore the Demo</h2>
        <div class="section-grid">
          @for (section of sections; track section.title) {
            <a class="section-card" [routerLink]="section.route">
              <h3>{{ section.title }}</h3>
              <p class="section-items">{{ section.items.join(', ') }}</p>
              <span class="section-link">View demos</span>
            </a>
          }
        </div>
      </section>

      <section class="zone-preview">
        <h2>Style Zones in Action</h2>
        <p class="zone-desc">
          Wrap any section in a <code>&lt;glint-style-zone&gt;</code> to override theme tokens.
          Zones nest and inherit.
        </p>
        <div class="zone-demo">
          <glint-style-zone [theme]="{ colorPrimary: blue }">
            <div class="zone-box">
              <span class="zone-label">Blue Zone</span>
              <glint-button severity="primary" variant="filled">Primary</glint-button>
              <glint-button severity="primary" variant="outlined">Outlined</glint-button>
            </div>
          </glint-style-zone>
          <glint-style-zone [theme]="{ colorPrimary: green }">
            <div class="zone-box">
              <span class="zone-label">Green Zone</span>
              <glint-button severity="primary" variant="filled">Primary</glint-button>
              <glint-button severity="primary" variant="outlined">Outlined</glint-button>
            </div>
          </glint-style-zone>
          <glint-style-zone [theme]="DARK_ZONE">
            <div class="zone-box dark">
              <span class="zone-label">Dark Zone</span>
              <glint-button severity="primary" variant="filled">Primary</glint-button>
              <glint-button severity="primary" variant="outlined">Outlined</glint-button>
            </div>
          </glint-style-zone>
        </div>
      </section>

      <section class="getting-started">
        <h2>Getting Started</h2>
        <div class="steps">
          <div class="step">
            <span class="step-num">1</span>
            <div>
              <h3>Install</h3>
              <code class="code-block">npm install &#64;glint/ui &#64;angular/cdk lucide</code>
            </div>
          </div>
          <div class="step">
            <span class="step-num">2</span>
            <div>
              <h3>Configure</h3>
              <code class="code-block">provideGlintUI()</code>
            </div>
          </div>
          <div class="step">
            <span class="step-num">3</span>
            <div>
              <h3>Use</h3>
              <code class="code-block">&lt;glint-button severity="primary"&gt;Go&lt;/glint-button&gt;</code>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: `
    .home {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    /* Hero */
    .hero {
      text-align: center;
      padding-block: 2rem 1rem;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin-block-end: 1rem;
    }

    .hero-badge-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--glint-color-primary);
    }

    .hero h1 {
      font-size: 3rem;
      font-weight: 800;
      margin: 0 0 1rem;
      background: linear-gradient(135deg, var(--glint-color-primary), var(--glint-color-secondary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-tagline {
      font-size: 1.125rem;
      max-inline-size: 600px;
      margin-inline: auto;
      margin-block-end: 1.5rem;
      opacity: 0.8;
      line-height: 1.6;
    }

    .hero-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    /* Features */
    .features h2,
    .demo-nav h2,
    .zone-preview h2,
    .getting-started h2 {
      font-size: 1.5rem;
      font-weight: 700;
      margin-block-end: 1rem;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }

    .feature-card {
      padding: 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .feature-card h3 {
      font-size: 1rem;
      font-weight: 600;
      margin: 0;
    }

    .feature-card p {
      font-size: 0.875rem;
      opacity: 0.75;
      margin: 0;
      line-height: 1.5;
    }

    /* Demo navigation */
    .section-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1rem;
    }

    .section-card {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 1.25rem;
      border-radius: var(--glint-border-radius);
      border: 1px solid color-mix(in oklch, var(--glint-color-text), transparent 88%);
      text-decoration: none;
      color: inherit;
      transition: border-color var(--glint-duration-normal) var(--glint-easing-standard),
                  box-shadow var(--glint-duration-normal) var(--glint-easing-standard);
    }

    .section-card:hover {
      border-color: var(--glint-color-primary);
      box-shadow: 0 2px 8px color-mix(in oklch, var(--glint-color-primary), transparent 85%);
    }

    .section-card h3 {
      font-size: 1rem;
      font-weight: 600;
      margin: 0;
    }

    .section-items {
      font-size: 0.8125rem;
      opacity: 0.6;
      margin: 0;
      line-height: 1.5;
    }

    .section-link {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--glint-color-primary);
      margin-block-start: auto;
    }

    /* Zone preview */
    .zone-desc {
      opacity: 0.75;
      margin-block-end: 1rem;
    }

    .zone-desc code {
      font-size: 0.875em;
      padding: 0.125em 0.375em;
      border-radius: 4px;
      background: color-mix(in oklch, var(--glint-color-text), transparent 92%);
    }

    .zone-demo {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }

    .zone-box {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 1.25rem;
      border-radius: var(--glint-border-radius);
      border: 1px solid color-mix(in oklch, var(--glint-color-text), transparent 88%);
    }

    .zone-box.dark {
      background: color-mix(in oklch, var(--glint-color-surface), transparent 0%);
    }

    .zone-label {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      opacity: 0.5;
    }

    /* Getting started */
    .steps {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .step {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
    }

    .step-num {
      display: flex;
      align-items: center;
      justify-content: center;
      inline-size: 2rem;
      block-size: 2rem;
      border-radius: 50%;
      background: var(--glint-color-primary);
      color: white;
      font-weight: 700;
      font-size: 0.875rem;
      flex-shrink: 0;
    }

    .step h3 {
      font-size: 1rem;
      font-weight: 600;
      margin: 0 0 0.25rem;
    }

    .code-block {
      display: block;
      font-size: 0.875rem;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      background: color-mix(in oklch, var(--glint-color-text), transparent 94%);
    }
  `,
})
export class HomeComponent {
  protected readonly DARK_ZONE = DARK_ZONE;
  protected readonly blue: CSSColor = GlintColor.Blue.S500;
  protected readonly green: CSSColor = GlintColor.Green.S500;

  protected features: FeatureCard[] = [
    {
      icon: 'eye',
      title: 'Style Zones',
      description: 'Cascade theme overrides through your component tree. Each zone inherits from its parent.',
    },
    {
      icon: 'layoutGrid',
      title: '80+ Components',
      description: 'Forms, data display, navigation, overlays, layout, and feedback — production ready.',
    },
    {
      icon: 'zap',
      title: 'Signal-based',
      description: 'Built on Angular signals for reactive theme propagation with no zone.js dependency.',
    },
    {
      icon: 'layers',
      title: 'Angular CDK',
      description: 'Accessibility, overlays, drag & drop, and virtual scrolling — all powered by the CDK.',
    },
    {
      icon: 'shield',
      title: 'Type-safe Theming',
      description: 'Branded types catch theming mistakes at compile time. No invalid color or spacing values.',
    },
    {
      icon: 'package',
      title: 'Tree-shakeable',
      description: 'Import only what you use. Unused components are eliminated from production builds.',
    },
  ];

  protected sections: DemoSection[] = [
    {
      title: 'Forms',
      route: '/input',
      items: ['Input', 'Select', 'Checkbox', 'Radio', 'Slider', 'DatePicker', 'Password'],
    },
    {
      title: 'Data Display',
      route: '/data-display',
      items: ['Table', 'Card', 'Avatar', 'Badge', 'Tag', 'Timeline', 'Tree'],
    },
    {
      title: 'Navigation',
      route: '/navigation',
      items: ['Menu', 'Tabs', 'Breadcrumb', 'Paginator', 'Stepper', 'PanelMenu'],
    },
    {
      title: 'Overlays',
      route: '/dialog',
      items: ['Dialog', 'Drawer', 'Popover', 'Tooltip', 'Toast', 'ConfirmDialog'],
    },
    {
      title: 'Layout',
      route: '/containers',
      items: ['Shell', 'Accordion', 'Fieldset', 'Splitter', 'Divider', 'Toolbar'],
    },
    {
      title: 'Theming',
      route: '/theme',
      items: ['Style Zones', 'Dark Mode', 'Compact', 'Color Scales', 'Presets'],
    },
  ];
}
