import { Component } from '@angular/core';
import {
  GlintTabsComponent,
  GlintTabPanelComponent,
} from '@glint-ng/core';

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
  host: { class: 'demo-page' },
  styles: `
    :host { display: block; }
  `,
})
export class TabsDemoComponent {}
