import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import {
  GlintTieredMenuComponent,
  GlintMenuBarComponent,
  GlintPanelMenuComponent,
  GlintContextMenuDirective,
  GlintDockComponent,
  GlintSpeedDialComponent,
  GlintTabMenuComponent,
} from '@glint-ng/core';
import type { GlintMenuItem } from '@glint-ng/core';

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
    GlintTabMenuComponent,
  ],
  host: { class: 'demo-page' },
  template: `
    <h2>Advanced Menus</h2>
    <p class="page-desc">Tiered menus, menu bars, panel menus, context menus, tab menus, docks, and speed dials.</p>

    <div class="demo-section">
      <h3>Tab Menu</h3>
      <p class="section-desc">Horizontal tab-style navigation. Supports route-based links and command-based actions.</p>
      <glint-tab-menu [items]="tabMenuItems" />
      @if (lastAction()['tab']; as action) {
        <div class="output">Last action: {{ action }}</div>
      }
    </div>

    <div class="demo-section">
      <h3>Tiered Menu (Inline)</h3>
      <p class="section-desc">Nested menu with submenus that expand on hover or keyboard navigation.</p>
      <glint-tiered-menu [items]="tieredMenuItems" />
      @if (lastAction()['tiered']; as action) {
        <div class="output">Last action: {{ action }}</div>
      }
    </div>

    <div class="demo-section">
      <h3>Menu Bar</h3>
      <p class="section-desc">Horizontal desktop-style menu bar with dropdown submenus.</p>
      <glint-menubar [items]="menuBarItems" />
      @if (lastAction()['menubar']; as action) {
        <div class="output">Last action: {{ action }}</div>
      }
    </div>

    <div class="demo-section">
      <h3>Panel Menu</h3>
      <p class="section-desc">Accordion-style vertical menu with expandable sections. Multiple panels can be open simultaneously.</p>
      <div style="max-inline-size: 20rem;">
        <glint-panel-menu [items]="panelMenuItems" [multiple]="true" />
      </div>
      @if (lastAction()['panel']; as action) {
        <div class="output">Last action: {{ action }}</div>
      }
    </div>

    <div class="demo-section">
      <h3>Context Menu</h3>
      <p class="section-desc">Right-click the area below to open a context menu.</p>
      <div class="context-target" [glintContextMenu]="contextMenuItems">
        Right-click here to open context menu
      </div>
      @if (lastAction()['context']; as action) {
        <div class="output">Last action: {{ action }}</div>
      }
    </div>

    <div class="demo-section">
      <h3>Dock</h3>
      <p class="section-desc">macOS-style icon dock with hover magnification effect.</p>
      <div class="row">
        <glint-dock [items]="dockItems" position="bottom" />
      </div>
      @if (lastAction()['dock']; as action) {
        <div class="output">Last action: {{ action }}</div>
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
      @if (lastAction()['speedDial']; as action) {
        <div class="output">Last action: {{ action }}</div>
      }
    </div>
  `,
  styles: `
    :host { display: block; }
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
  lastAction = signal<Record<string, string>>({});

  private track(section: string, label: string): () => void {
    return () => this.lastAction.update(a => ({ ...a, [section]: label }));
  }

  tabMenuItems: GlintMenuItem[] = [
    { label: 'Overview', icon: 'home', command: this.track('tab', 'Overview') },
    { label: 'Features', icon: 'star', command: this.track('tab', 'Features') },
    { label: 'Pricing', icon: 'creditCard', command: this.track('tab', 'Pricing') },
    { label: 'Documentation', icon: 'fileText', command: this.track('tab', 'Documentation') },
    { label: 'Support', icon: 'messageCircle', disabled: true },
  ];

  tieredMenuItems: GlintMenuItem[] = [
    {
      label: 'File',
      items: [
        { label: 'New', command: this.track('tiered', 'File > New') },
        { label: 'Open', command: this.track('tiered', 'File > Open') },
        {
          label: 'Export',
          items: [
            { label: 'PDF', command: this.track('tiered', 'File > Export > PDF') },
            { label: 'CSV', command: this.track('tiered', 'File > Export > CSV') },
            { label: 'Excel', command: this.track('tiered', 'File > Export > Excel') },
          ],
        },
        { label: 'Save', separator: true, command: this.track('tiered', 'File > Save') },
        { label: 'Quit', command: this.track('tiered', 'File > Quit') },
      ],
    },
    {
      label: 'Edit',
      items: [
        { label: 'Undo', command: this.track('tiered', 'Edit > Undo') },
        { label: 'Redo', command: this.track('tiered', 'Edit > Redo') },
        { label: 'Cut', separator: true, command: this.track('tiered', 'Edit > Cut') },
        { label: 'Copy', command: this.track('tiered', 'Edit > Copy') },
        { label: 'Paste', command: this.track('tiered', 'Edit > Paste') },
      ],
    },
    {
      label: 'View',
      items: [
        { label: 'Zoom In', command: this.track('tiered', 'View > Zoom In') },
        { label: 'Zoom Out', command: this.track('tiered', 'View > Zoom Out') },
        { label: 'Full Screen', command: this.track('tiered', 'View > Full Screen') },
      ],
    },
    { label: 'Help', command: this.track('tiered', 'Help') },
  ];

  menuBarItems: GlintMenuItem[] = [
    {
      label: 'File',
      items: [
        { label: 'New Project', command: this.track('menubar', 'File > New Project') },
        { label: 'Open Project', command: this.track('menubar', 'File > Open Project') },
        { label: 'Save', command: this.track('menubar', 'File > Save') },
        { label: 'Save As...', command: this.track('menubar', 'File > Save As') },
        { label: 'Exit', separator: true, command: this.track('menubar', 'File > Exit') },
      ],
    },
    {
      label: 'Edit',
      items: [
        { label: 'Undo', command: this.track('menubar', 'Edit > Undo') },
        { label: 'Redo', command: this.track('menubar', 'Edit > Redo') },
        { label: 'Find & Replace', separator: true, command: this.track('menubar', 'Edit > Find & Replace') },
        { label: 'Preferences', command: this.track('menubar', 'Edit > Preferences') },
      ],
    },
    {
      label: 'View',
      items: [
        { label: 'Sidebar', command: this.track('menubar', 'View > Sidebar') },
        { label: 'Terminal', command: this.track('menubar', 'View > Terminal') },
        { label: 'Status Bar', command: this.track('menubar', 'View > Status Bar') },
      ],
    },
    {
      label: 'Build',
      items: [
        { label: 'Build Project', command: this.track('menubar', 'Build > Build Project') },
        { label: 'Clean Build', command: this.track('menubar', 'Build > Clean Build') },
        { label: 'Run Tests', command: this.track('menubar', 'Build > Run Tests') },
      ],
    },
    { label: 'Help', command: this.track('menubar', 'Help') },
  ];

  panelMenuItems: GlintMenuItem[] = [
    {
      label: 'Dashboard',
      items: [
        { label: 'Analytics', command: this.track('panel', 'Dashboard > Analytics') },
        { label: 'Reports', command: this.track('panel', 'Dashboard > Reports') },
        { label: 'Real-time', command: this.track('panel', 'Dashboard > Real-time') },
      ],
    },
    {
      label: 'Users',
      items: [
        { label: 'All Users', command: this.track('panel', 'Users > All Users') },
        { label: 'Roles & Permissions', command: this.track('panel', 'Users > Roles & Permissions') },
        { label: 'Invite User', command: this.track('panel', 'Users > Invite User') },
        { label: 'Activity Log', command: this.track('panel', 'Users > Activity Log') },
      ],
    },
    {
      label: 'Settings',
      items: [
        { label: 'General', command: this.track('panel', 'Settings > General') },
        { label: 'Security', command: this.track('panel', 'Settings > Security') },
        { label: 'Notifications', command: this.track('panel', 'Settings > Notifications') },
        { label: 'Integrations', command: this.track('panel', 'Settings > Integrations') },
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
    { label: 'Copy', command: this.track('context', 'Copy') },
    { label: 'Paste', command: this.track('context', 'Paste') },
    { label: 'Cut', separator: true, command: this.track('context', 'Cut') },
    { label: 'Select All', command: this.track('context', 'Select All') },
    { label: 'Inspect Element', separator: true, command: this.track('context', 'Inspect Element') },
    { label: 'Delete', command: this.track('context', 'Delete') },
  ];

  dockItems: GlintMenuItem[] = [
    { label: 'Finder', icon: '📁', command: this.track('dock', 'Finder') },
    { label: 'Terminal', icon: '🖥️', command: this.track('dock', 'Terminal') },
    { label: 'Browser', icon: '🌐', command: this.track('dock', 'Browser') },
    { label: 'Mail', icon: '✉️', command: this.track('dock', 'Mail') },
    { label: 'Calendar', icon: '📅', command: this.track('dock', 'Calendar') },
    { label: 'Music', icon: '🎵', command: this.track('dock', 'Music') },
    { label: 'Photos', icon: '🖼️', command: this.track('dock', 'Photos') },
    { label: 'Settings', icon: '⚙️', command: this.track('dock', 'Settings') },
  ];

  speedDialItems: GlintMenuItem[] = [
    { label: 'Add', icon: '➕', command: this.track('speedDial', 'Add') },
    { label: 'Edit', icon: '✏️', command: this.track('speedDial', 'Edit') },
    { label: 'Share', icon: '🔗', command: this.track('speedDial', 'Share') },
    { label: 'Delete', icon: '🗑️', command: this.track('speedDial', 'Delete') },
  ];
}
