import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  GlintTieredMenuComponent,
  GlintMenuBarComponent,
  GlintPanelMenuComponent,
  GlintContextMenuDirective,
  GlintDockComponent,
  GlintSpeedDialComponent,
} from '@glint/ui';
import type { GlintMenuItem } from '@glint/ui';

@Component({
  selector: 'glint-advanced-menus-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GlintTieredMenuComponent,
    GlintMenuBarComponent,
    GlintPanelMenuComponent,
    GlintContextMenuDirective,
    GlintDockComponent,
    GlintSpeedDialComponent,
  ],
  template: `
    <h2>Advanced Menus</h2>
    <p class="page-desc">Tiered menus, menu bars, panel menus, context menus, docks, and speed dials.</p>

    <div class="demo-section">
      <h3>Tiered Menu (Inline)</h3>
      <p class="section-desc">Nested menu with submenus that expand on hover or keyboard navigation.</p>
      <glint-tiered-menu [items]="tieredMenuItems" />
      @if (lastTieredAction) {
        <div class="output">Last action: {{ lastTieredAction }}</div>
      }
    </div>

    <div class="demo-section">
      <h3>Menu Bar</h3>
      <p class="section-desc">Horizontal desktop-style menu bar with dropdown submenus.</p>
      <glint-menubar [items]="menuBarItems" />
      @if (lastMenuBarAction) {
        <div class="output">Last action: {{ lastMenuBarAction }}</div>
      }
    </div>

    <div class="demo-section">
      <h3>Panel Menu</h3>
      <p class="section-desc">Accordion-style vertical menu with expandable sections. Multiple panels can be open simultaneously.</p>
      <div style="max-inline-size: 20rem;">
        <glint-panel-menu [items]="panelMenuItems" [multiple]="true" />
      </div>
      @if (lastPanelAction) {
        <div class="output">Last action: {{ lastPanelAction }}</div>
      }
    </div>

    <div class="demo-section">
      <h3>Context Menu</h3>
      <p class="section-desc">Right-click the area below to open a context menu.</p>
      <div class="context-target" [glintContextMenu]="contextMenuItems">
        Right-click here to open context menu
      </div>
      @if (lastContextAction) {
        <div class="output">Last action: {{ lastContextAction }}</div>
      }
    </div>

    <div class="demo-section">
      <h3>Dock</h3>
      <p class="section-desc">macOS-style icon dock with hover magnification effect.</p>
      <div class="row">
        <glint-dock [items]="dockItems" position="bottom" />
      </div>
      @if (lastDockAction) {
        <div class="output">Last action: {{ lastDockAction }}</div>
      }
    </div>

    <div class="demo-section">
      <h3>Speed Dial</h3>
      <p class="section-desc">Floating action button with expandable action items in different directions and layouts.</p>
      <div class="speed-dial-row">
        <div class="speed-dial-container">
          <span class="speed-dial-label">Linear (Up)</span>
          <div class="speed-dial-wrapper">
            <glint-speed-dial [items]="speedDialItems" direction="up" />
          </div>
        </div>
        <div class="speed-dial-container">
          <span class="speed-dial-label">Linear (Right)</span>
          <div class="speed-dial-wrapper horizontal">
            <glint-speed-dial [items]="speedDialItems" direction="right" />
          </div>
        </div>
        <div class="speed-dial-container">
          <span class="speed-dial-label">Circle</span>
          <div class="speed-dial-wrapper circle">
            <glint-speed-dial [items]="speedDialItems" type="circle" [radius]="80" />
          </div>
        </div>
        <div class="speed-dial-container">
          <span class="speed-dial-label">Semi-Circle (Up)</span>
          <div class="speed-dial-wrapper circle">
            <glint-speed-dial [items]="speedDialItems" type="semi-circle" direction="up" [radius]="80" />
          </div>
        </div>
      </div>
      @if (lastSpeedDialAction) {
        <div class="output">Last action: {{ lastSpeedDialAction }}</div>
      }
    </div>
  `,
  styles: `
    :host { display: block; }
    h2 { margin-block: 0 0.25rem; font-size: 1.75rem; font-weight: 600; color: #1e293b; }
    .page-desc { color: #64748b; margin-block: 0 2rem; font-size: 1.25rem; }
    .demo-section {
      background: white; border: 1px solid #e2e8f0; border-radius: 0.625rem;
      padding: 2rem; margin-block-end: 1.5rem;
    }
    .demo-section h3 { margin-block: 0 1rem; font-size: 1rem; font-weight: 600; color: #334155; }
    .section-desc { color: #64748b; font-size: 0.875rem; margin-block: -0.5rem 1rem; }
    .row { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; }
    .stack { display: flex; flex-direction: column; gap: 1rem; }
    .output { margin-block-start: 1rem; padding: 0.75rem 1rem; background: #f8fafc;
      border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.875rem; color: #64748b; }
    .context-target {
      display: flex;
      align-items: center;
      justify-content: center;
      block-size: 10rem;
      border: 2px dashed #cbd5e1;
      border-radius: 0.5rem;
      color: #64748b;
      font-size: 0.875rem;
      user-select: none;
      cursor: context-menu;
      transition: border-color 150ms ease, background-color 150ms ease;
    }
    .context-target:hover {
      border-color: #94a3b8;
      background: #f8fafc;
    }
    .speed-dial-row {
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
      align-items: flex-end;
    }
    .speed-dial-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }
    .speed-dial-label {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 500;
    }
    .speed-dial-wrapper {
      position: relative;
      block-size: 14rem;
      inline-size: 5rem;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }
    .speed-dial-wrapper.horizontal {
      block-size: 5rem;
      inline-size: 20rem;
      align-items: center;
      justify-content: flex-start;
    }
    .speed-dial-wrapper.circle {
      block-size: 14rem;
      inline-size: 14rem;
      align-items: center;
      justify-content: center;
    }
  `,
})
export class AdvancedMenusDemoComponent {
  lastTieredAction = '';
  lastMenuBarAction = '';
  lastPanelAction = '';
  lastContextAction = '';
  lastDockAction = '';
  lastSpeedDialAction = '';

  tieredMenuItems: GlintMenuItem[] = [
    {
      label: 'File',
      items: [
        { label: 'New', command: () => { this.lastTieredAction = 'File > New'; } },
        { label: 'Open', command: () => { this.lastTieredAction = 'File > Open'; } },
        {
          label: 'Export',
          items: [
            { label: 'PDF', command: () => { this.lastTieredAction = 'File > Export > PDF'; } },
            { label: 'CSV', command: () => { this.lastTieredAction = 'File > Export > CSV'; } },
            { label: 'Excel', command: () => { this.lastTieredAction = 'File > Export > Excel'; } },
          ],
        },
        { label: 'Save', separator: true, command: () => { this.lastTieredAction = 'File > Save'; } },
        { label: 'Quit', command: () => { this.lastTieredAction = 'File > Quit'; } },
      ],
    },
    {
      label: 'Edit',
      items: [
        { label: 'Undo', command: () => { this.lastTieredAction = 'Edit > Undo'; } },
        { label: 'Redo', command: () => { this.lastTieredAction = 'Edit > Redo'; } },
        { label: 'Cut', separator: true, command: () => { this.lastTieredAction = 'Edit > Cut'; } },
        { label: 'Copy', command: () => { this.lastTieredAction = 'Edit > Copy'; } },
        { label: 'Paste', command: () => { this.lastTieredAction = 'Edit > Paste'; } },
      ],
    },
    {
      label: 'View',
      items: [
        { label: 'Zoom In', command: () => { this.lastTieredAction = 'View > Zoom In'; } },
        { label: 'Zoom Out', command: () => { this.lastTieredAction = 'View > Zoom Out'; } },
        { label: 'Full Screen', command: () => { this.lastTieredAction = 'View > Full Screen'; } },
      ],
    },
    { label: 'Help', command: () => { this.lastTieredAction = 'Help'; } },
  ];

  menuBarItems: GlintMenuItem[] = [
    {
      label: 'File',
      items: [
        { label: 'New Project', command: () => { this.lastMenuBarAction = 'File > New Project'; } },
        { label: 'Open Project', command: () => { this.lastMenuBarAction = 'File > Open Project'; } },
        { label: 'Save', command: () => { this.lastMenuBarAction = 'File > Save'; } },
        { label: 'Save As...', command: () => { this.lastMenuBarAction = 'File > Save As'; } },
        { label: 'Exit', separator: true, command: () => { this.lastMenuBarAction = 'File > Exit'; } },
      ],
    },
    {
      label: 'Edit',
      items: [
        { label: 'Undo', command: () => { this.lastMenuBarAction = 'Edit > Undo'; } },
        { label: 'Redo', command: () => { this.lastMenuBarAction = 'Edit > Redo'; } },
        { label: 'Find & Replace', separator: true, command: () => { this.lastMenuBarAction = 'Edit > Find & Replace'; } },
        { label: 'Preferences', command: () => { this.lastMenuBarAction = 'Edit > Preferences'; } },
      ],
    },
    {
      label: 'View',
      items: [
        { label: 'Sidebar', command: () => { this.lastMenuBarAction = 'View > Sidebar'; } },
        { label: 'Terminal', command: () => { this.lastMenuBarAction = 'View > Terminal'; } },
        { label: 'Status Bar', command: () => { this.lastMenuBarAction = 'View > Status Bar'; } },
      ],
    },
    {
      label: 'Build',
      items: [
        { label: 'Build Project', command: () => { this.lastMenuBarAction = 'Build > Build Project'; } },
        { label: 'Clean Build', command: () => { this.lastMenuBarAction = 'Build > Clean Build'; } },
        { label: 'Run Tests', command: () => { this.lastMenuBarAction = 'Build > Run Tests'; } },
      ],
    },
    { label: 'Help', command: () => { this.lastMenuBarAction = 'Help'; } },
  ];

  panelMenuItems: GlintMenuItem[] = [
    {
      label: 'Dashboard',
      items: [
        { label: 'Analytics', command: () => { this.lastPanelAction = 'Dashboard > Analytics'; } },
        { label: 'Reports', command: () => { this.lastPanelAction = 'Dashboard > Reports'; } },
        { label: 'Real-time', command: () => { this.lastPanelAction = 'Dashboard > Real-time'; } },
      ],
    },
    {
      label: 'Users',
      items: [
        { label: 'All Users', command: () => { this.lastPanelAction = 'Users > All Users'; } },
        { label: 'Roles & Permissions', command: () => { this.lastPanelAction = 'Users > Roles & Permissions'; } },
        { label: 'Invite User', command: () => { this.lastPanelAction = 'Users > Invite User'; } },
        { label: 'Activity Log', command: () => { this.lastPanelAction = 'Users > Activity Log'; } },
      ],
    },
    {
      label: 'Settings',
      items: [
        { label: 'General', command: () => { this.lastPanelAction = 'Settings > General'; } },
        { label: 'Security', command: () => { this.lastPanelAction = 'Settings > Security'; } },
        { label: 'Notifications', command: () => { this.lastPanelAction = 'Settings > Notifications'; } },
        { label: 'Integrations', command: () => { this.lastPanelAction = 'Settings > Integrations'; } },
      ],
    },
    {
      label: 'Billing',
      disabled: true,
      items: [
        { label: 'Invoices' },
        { label: 'Payment Methods' },
      ],
    },
  ];

  contextMenuItems: GlintMenuItem[] = [
    { label: 'Copy', command: () => { this.lastContextAction = 'Copy'; } },
    { label: 'Paste', command: () => { this.lastContextAction = 'Paste'; } },
    { label: 'Cut', separator: true, command: () => { this.lastContextAction = 'Cut'; } },
    { label: 'Select All', command: () => { this.lastContextAction = 'Select All'; } },
    { label: 'Inspect Element', separator: true, command: () => { this.lastContextAction = 'Inspect Element'; } },
    { label: 'Delete', command: () => { this.lastContextAction = 'Delete'; } },
  ];

  dockItems: GlintMenuItem[] = [
    { label: 'Finder', icon: '\uD83D\uDCC1', command: () => { this.lastDockAction = 'Finder'; } },
    { label: 'Terminal', icon: '\uD83D\uDDA5\uFE0F', command: () => { this.lastDockAction = 'Terminal'; } },
    { label: 'Browser', icon: '\uD83C\uDF10', command: () => { this.lastDockAction = 'Browser'; } },
    { label: 'Mail', icon: '\u2709\uFE0F', command: () => { this.lastDockAction = 'Mail'; } },
    { label: 'Calendar', icon: '\uD83D\uDCC5', command: () => { this.lastDockAction = 'Calendar'; } },
    { label: 'Music', icon: '\uD83C\uDFB5', command: () => { this.lastDockAction = 'Music'; } },
    { label: 'Photos', icon: '\uD83D\uDDBC\uFE0F', command: () => { this.lastDockAction = 'Photos'; } },
    { label: 'Settings', icon: '\u2699\uFE0F', command: () => { this.lastDockAction = 'Settings'; } },
  ];

  speedDialItems: GlintMenuItem[] = [
    { label: 'Add', icon: '\u2795', command: () => { this.lastSpeedDialAction = 'Add'; } },
    { label: 'Edit', icon: '\u270F\uFE0F', command: () => { this.lastSpeedDialAction = 'Edit'; } },
    { label: 'Share', icon: '\uD83D\uDD17', command: () => { this.lastSpeedDialAction = 'Share'; } },
    { label: 'Delete', icon: '\uD83D\uDDD1\uFE0F', command: () => { this.lastSpeedDialAction = 'Delete'; } },
  ];
}
