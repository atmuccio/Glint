import { Component } from '@angular/core';
import {
  GlintBadgeComponent,
  GlintTagComponent,
  GlintAvatarComponent,
  GlintAvatarGroupComponent,
  GlintChipComponent,
} from '@glint-ng/core';

@Component({
  selector: 'glint-data-display-demo',
  standalone: true,
  imports: [
    GlintBadgeComponent,
    GlintTagComponent,
    GlintAvatarComponent,
    GlintAvatarGroupComponent,
    GlintChipComponent,
  ],
  template: `
    <h2>Data Display</h2>
    <p class="page-desc">Badges, tags, avatars, and chips for presenting data and status.</p>

    <div class="demo-section">
      <h3>Badges — Severities</h3>
      <div class="row">
        <glint-badge severity="primary">4</glint-badge>
        <glint-badge severity="secondary">12</glint-badge>
        <glint-badge severity="success">New</glint-badge>
        <glint-badge severity="info">i</glint-badge>
        <glint-badge severity="warning">!</glint-badge>
        <glint-badge severity="danger">99+</glint-badge>
      </div>

      <h3 class="sub-heading">Badges — Sizes</h3>
      <div class="row">
        <glint-badge severity="primary" size="sm">SM</glint-badge>
        <glint-badge severity="primary" size="lg">LG</glint-badge>
      </div>
    </div>

    <div class="demo-section">
      <h3>Tags — Severities</h3>
      <div class="row">
        <glint-tag severity="primary">Primary</glint-tag>
        <glint-tag severity="secondary">Secondary</glint-tag>
        <glint-tag severity="success">Success</glint-tag>
        <glint-tag severity="info">Info</glint-tag>
        <glint-tag severity="warning">Warning</glint-tag>
        <glint-tag severity="danger">Danger</glint-tag>
      </div>

      <h3 class="sub-heading">Tags — Rounded</h3>
      <div class="row">
        <glint-tag severity="primary" [rounded]="true">Rounded</glint-tag>
        <glint-tag severity="success" [rounded]="true">Approved</glint-tag>
        <glint-tag severity="danger" [rounded]="true">Rejected</glint-tag>
      </div>

      <h3 class="sub-heading">Tags — Removable</h3>
      <div class="row">
        <glint-tag severity="info" [removable]="true">Removable</glint-tag>
        <glint-tag severity="warning" [removable]="true" [rounded]="true">Dismissible</glint-tag>
      </div>
    </div>

    <div class="demo-section">
      <h3>Avatars — Labels &amp; Images</h3>
      <div class="row">
        <glint-avatar label="John Doe" />
        <glint-avatar label="Alice Smith" />
        <glint-avatar image="https://i.pravatar.cc/100?u=1" label="User 1" />
        <glint-avatar image="https://i.pravatar.cc/100?u=2" label="User 2" />
      </div>

      <h3 class="sub-heading">Avatars — Sizes</h3>
      <div class="row">
        <glint-avatar label="SM" size="sm" />
        <glint-avatar label="MD" size="md" />
        <glint-avatar label="LG" size="lg" />
        <glint-avatar label="XL" size="xl" />
      </div>

      <h3 class="sub-heading">Avatars — Shapes</h3>
      <div class="row">
        <glint-avatar label="Circle" shape="circle" />
        <glint-avatar label="Square" shape="square" />
        <glint-avatar image="https://i.pravatar.cc/100?u=3" label="User 3" shape="square" />
      </div>

      <h3 class="sub-heading">Avatar Group</h3>
      <div class="row">
        <glint-avatar-group>
          <glint-avatar image="https://i.pravatar.cc/100?u=4" label="User 4" />
          <glint-avatar image="https://i.pravatar.cc/100?u=5" label="User 5" />
          <glint-avatar image="https://i.pravatar.cc/100?u=6" label="User 6" />
          <glint-avatar label="+2" />
        </glint-avatar-group>
      </div>
    </div>

    <div class="demo-section">
      <h3>Chips</h3>
      <div class="row">
        <glint-chip>Angular</glint-chip>
        <glint-chip>TypeScript</glint-chip>
        <glint-chip image="https://i.pravatar.cc/100?u=7">With image</glint-chip>
        <glint-chip [removable]="true">Removable</glint-chip>
        <glint-chip image="https://i.pravatar.cc/100?u=8" [removable]="true">Full chip</glint-chip>
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
    .sub-heading { margin-block: 1.5rem 1rem; }
  `,
})
export class DataDisplayDemoComponent {}
