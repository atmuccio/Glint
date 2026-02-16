import { Component } from '@angular/core';
import {
  GlintTabsComponent,
  GlintTabPanelComponent,
} from '@glint/ui';

@Component({
  selector: 'glint-tabs-demo',
  standalone: true,
  imports: [
    GlintTabsComponent,
    GlintTabPanelComponent,
  ],
  template: `
    <h2>Tabs</h2>
    <p class="page-desc">Tabbed navigation for organizing content into panels.</p>

    <div class="demo-section">
      <h3>Basic Tabs</h3>
      <glint-tabs>
        <glint-tab-panel label="General">
          <p>General settings allow you to configure the basic behavior of your application, including language, timezone, and notification preferences.</p>
        </glint-tab-panel>
        <glint-tab-panel label="Security">
          <p>Security settings let you manage passwords, two-factor authentication, and active sessions across your devices.</p>
        </glint-tab-panel>
        <glint-tab-panel label="Notifications">
          <p>Notification settings control how and when you receive alerts, including email digests, push notifications, and in-app messages.</p>
        </glint-tab-panel>
      </glint-tabs>
    </div>

    <div class="demo-section">
      <h3>Tabs with Disabled Panel</h3>
      <glint-tabs>
        <glint-tab-panel label="Profile">
          <p>View and edit your profile information, including your name, bio, and avatar.</p>
        </glint-tab-panel>
        <glint-tab-panel label="Billing" [disabled]="true">
          <p>This tab is disabled. Billing settings are not available for your plan.</p>
        </glint-tab-panel>
        <glint-tab-panel label="Integrations">
          <p>Connect third-party services like Slack, GitHub, and Jira to streamline your workflow.</p>
        </glint-tab-panel>
      </glint-tabs>
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
export class TabsDemoComponent {}
