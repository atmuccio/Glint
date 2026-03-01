import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import {
  GlintTreeComponent,
  GlintTreeTableComponent,
  GlintTreeTableColumnDirective,
  GlintOrganizationChartComponent,
} from '@glint-ng/core';
import type { GlintTreeNode } from '@glint-ng/core';

@Component({
  selector: 'glint-trees-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GlintTreeComponent,
    GlintTreeTableComponent,
    GlintTreeTableColumnDirective,
    GlintOrganizationChartComponent,
  ],
  template: `
    <h2>Trees</h2>
    <p class="page-desc">Hierarchical tree views, tree tables, and organization charts.</p>

    <div class="demo-section">
      <h3>Basic Tree</h3>
      <p class="section-desc">Expandable tree view with nested nodes. Click the chevron to expand or collapse.</p>
      <glint-tree [value]="fileSystemNodes" />
    </div>

    <div class="demo-section">
      <h3>Tree with Single Selection</h3>
      <p class="section-desc">Click a node to select it. The selected node is highlighted.</p>
      <glint-tree
        [value]="fileSystemNodes"
        selectionMode="single"
        [(selection)]="selectedNode"
        (nodeSelect)="onNodeSelect($event)"
      />
      @if (selectedNode()) {
        <div class="output">Selected: {{ getNodeLabel(selectedNode()) }}</div>
      }
    </div>

    <div class="demo-section">
      <h3>Tree with Checkbox Selection</h3>
      <p class="section-desc">Use checkboxes to select multiple nodes.</p>
      <glint-tree
        [value]="checkboxTreeNodes"
        selectionMode="checkbox"
        [(selection)]="checkedNodes"
      />
      @if (getCheckedLabels().length) {
        <div class="output">Checked: {{ getCheckedLabels().join(', ') }}</div>
      }
    </div>

    <div class="demo-section">
      <h3>Tree with Filter</h3>
      <p class="section-desc">Search and filter tree nodes using the input field above the tree.</p>
      <glint-tree [value]="filterableNodes" [filter]="true" filterPlaceholder="Search files..." />
    </div>

    <div class="demo-section">
      <h3>Tree Table</h3>
      <p class="section-desc">Tree data displayed in a tabular format with columns for additional metadata.</p>
      <glint-tree-table [value]="treeTableNodes" selectionMode="single" [(selection)]="selectedTableNode">
        <ng-template glintTreeTableColumn="name" header="Name" let-node>
          {{ node.data.name }}
        </ng-template>
        <ng-template glintTreeTableColumn="size" header="Size" let-node>
          {{ node.data.size }}
        </ng-template>
        <ng-template glintTreeTableColumn="type" header="Type" let-node>
          {{ node.data.type }}
        </ng-template>
      </glint-tree-table>
      @if (selectedTableNode()) {
        <div class="output">Selected: {{ getTableNodeLabel(selectedTableNode()) }}</div>
      }
    </div>

    <div class="demo-section">
      <h3>Organization Chart</h3>
      <p class="section-desc">Top-down organizational hierarchy with selectable nodes and connector lines.</p>
      <glint-organization-chart
        [value]="orgChartRoot"
        selectionMode="single"
        [(selection)]="selectedOrgNode"
        (nodeSelect)="onOrgSelect($event)"
      />
      @if (selectedOrgNode()) {
        <div class="output">Selected: {{ getNodeLabel(selectedOrgNode()) }}</div>
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
  `,
})
export class TreesDemoComponent {
  selectedNode = signal<GlintTreeNode | null>(null);
  checkedNodes = signal<GlintTreeNode[] | null>(null);
  selectedTableNode = signal<GlintTreeNode | null>(null);
  selectedOrgNode = signal<GlintTreeNode | null>(null);

  fileSystemNodes: GlintTreeNode[] = [
    {
      key: 'src',
      label: 'src',
      expanded: true,
      children: [
        {
          key: 'app',
          label: 'app',
          expanded: true,
          children: [
            {
              key: 'components',
              label: 'components',
              children: [
                { key: 'header', label: 'header.component.ts', leaf: true },
                { key: 'footer', label: 'footer.component.ts', leaf: true },
                { key: 'sidebar', label: 'sidebar.component.ts', leaf: true },
              ],
            },
            {
              key: 'services',
              label: 'services',
              children: [
                { key: 'auth', label: 'auth.service.ts', leaf: true },
                { key: 'api', label: 'api.service.ts', leaf: true },
              ],
            },
            { key: 'app-component', label: 'app.component.ts', leaf: true },
            { key: 'app-module', label: 'app.config.ts', leaf: true },
          ],
        },
        {
          key: 'assets',
          label: 'assets',
          children: [
            { key: 'images', label: 'images', children: [
              { key: 'logo', label: 'logo.svg', leaf: true },
              { key: 'bg', label: 'background.png', leaf: true },
            ]},
            { key: 'fonts', label: 'fonts', children: [
              { key: 'inter', label: 'Inter-Regular.woff2', leaf: true },
            ]},
          ],
        },
        { key: 'main', label: 'main.ts', leaf: true },
        { key: 'styles', label: 'styles.css', leaf: true },
        { key: 'index', label: 'index.html', leaf: true },
      ],
    },
    {
      key: 'package',
      label: 'package.json',
      leaf: true,
    },
    {
      key: 'tsconfig',
      label: 'tsconfig.json',
      leaf: true,
    },
    {
      key: 'readme',
      label: 'README.md',
      leaf: true,
    },
  ];

  checkboxTreeNodes: GlintTreeNode[] = [
    {
      key: 'permissions',
      label: 'Permissions',
      expanded: true,
      children: [
        {
          key: 'read',
          label: 'Read',
          children: [
            { key: 'read-docs', label: 'Documents', leaf: true },
            { key: 'read-reports', label: 'Reports', leaf: true },
            { key: 'read-analytics', label: 'Analytics', leaf: true },
          ],
        },
        {
          key: 'write',
          label: 'Write',
          children: [
            { key: 'write-docs', label: 'Documents', leaf: true },
            { key: 'write-reports', label: 'Reports', leaf: true },
          ],
        },
        {
          key: 'admin',
          label: 'Admin',
          children: [
            { key: 'manage-users', label: 'Manage Users', leaf: true },
            { key: 'manage-settings', label: 'Manage Settings', leaf: true },
            { key: 'manage-billing', label: 'Manage Billing', leaf: true },
          ],
        },
      ],
    },
  ];

  filterableNodes: GlintTreeNode[] = [
    {
      key: 'documents',
      label: 'Documents',
      expanded: true,
      children: [
        {
          key: 'work',
          label: 'Work',
          children: [
            { key: 'proposal', label: 'Project Proposal.docx', leaf: true },
            { key: 'budget', label: 'Budget Report.xlsx', leaf: true },
            { key: 'timeline', label: 'Timeline.pdf', leaf: true },
            { key: 'meeting-notes', label: 'Meeting Notes.docx', leaf: true },
          ],
        },
        {
          key: 'personal',
          label: 'Personal',
          children: [
            { key: 'resume', label: 'Resume.pdf', leaf: true },
            { key: 'cover-letter', label: 'Cover Letter.docx', leaf: true },
            { key: 'tax', label: 'Tax Return 2025.pdf', leaf: true },
          ],
        },
        {
          key: 'photos',
          label: 'Photos',
          children: [
            { key: 'vacation', label: 'Vacation 2025', children: [
              { key: 'beach', label: 'beach_sunset.jpg', leaf: true },
              { key: 'mountain', label: 'mountain_view.jpg', leaf: true },
            ]},
            { key: 'family', label: 'Family Reunion.jpg', leaf: true },
          ],
        },
      ],
    },
    {
      key: 'downloads',
      label: 'Downloads',
      children: [
        { key: 'installer', label: 'node-v22-installer.msi', leaf: true },
        { key: 'archive', label: 'project-backup.zip', leaf: true },
      ],
    },
  ];

  treeTableNodes: GlintTreeNode[] = [
    {
      key: 'src',
      label: 'src',
      expanded: true,
      data: { name: 'src', size: '4.2 MB', type: 'Folder' },
      children: [
        {
          key: 'app',
          label: 'app',
          expanded: true,
          data: { name: 'app', size: '3.1 MB', type: 'Folder' },
          children: [
            {
              key: 'main-ts',
              label: 'main.ts',
              leaf: true,
              data: { name: 'main.ts', size: '1.2 KB', type: 'TypeScript' },
            },
            {
              key: 'app-comp',
              label: 'app.component.ts',
              leaf: true,
              data: { name: 'app.component.ts', size: '3.4 KB', type: 'TypeScript' },
            },
            {
              key: 'app-config',
              label: 'app.config.ts',
              leaf: true,
              data: { name: 'app.config.ts', size: '0.8 KB', type: 'TypeScript' },
            },
          ],
        },
        {
          key: 'assets',
          label: 'assets',
          data: { name: 'assets', size: '1.1 MB', type: 'Folder' },
          children: [
            {
              key: 'logo-svg',
              label: 'logo.svg',
              leaf: true,
              data: { name: 'logo.svg', size: '12 KB', type: 'SVG Image' },
            },
            {
              key: 'styles-css',
              label: 'styles.css',
              leaf: true,
              data: { name: 'styles.css', size: '48 KB', type: 'Stylesheet' },
            },
          ],
        },
      ],
    },
    {
      key: 'package-json',
      label: 'package.json',
      leaf: true,
      data: { name: 'package.json', size: '2.1 KB', type: 'JSON' },
    },
    {
      key: 'tsconfig-json',
      label: 'tsconfig.json',
      leaf: true,
      data: { name: 'tsconfig.json', size: '0.6 KB', type: 'JSON' },
    },
  ];

  orgChartRoot: GlintTreeNode = {
    key: 'ceo',
    label: 'Sarah Chen (CEO)',
    expanded: true,
    children: [
      {
        key: 'cto',
        label: 'James Park (CTO)',
        expanded: true,
        children: [
          {
            key: 'frontend-lead',
            label: 'Maria Garcia (Frontend Lead)',
            children: [
              { key: 'dev1', label: 'Alex Kim (Developer)' },
              { key: 'dev2', label: 'Sam Liu (Developer)' },
            ],
          },
          {
            key: 'backend-lead',
            label: 'David Johnson (Backend Lead)',
            children: [
              { key: 'dev3', label: 'Priya Patel (Developer)' },
              { key: 'dev4', label: 'Omar Hassan (Developer)' },
            ],
          },
          {
            key: 'devops-lead',
            label: 'Lisa Wang (DevOps Lead)',
          },
        ],
      },
      {
        key: 'cfo',
        label: 'Robert Miller (CFO)',
        expanded: true,
        children: [
          { key: 'finance-mgr', label: 'Emily Brown (Finance Mgr)' },
          { key: 'accounting', label: 'Chris Taylor (Accounting)' },
        ],
      },
      {
        key: 'cmo',
        label: 'Jennifer Lee (CMO)',
        expanded: true,
        children: [
          { key: 'marketing-mgr', label: 'Ryan Wilson (Marketing Mgr)' },
          { key: 'brand-mgr', label: 'Aisha Khan (Brand Mgr)' },
        ],
      },
    ],
  };

  onNodeSelect(node: GlintTreeNode): void {
    this.selectedNode.set(node);
  }

  onOrgSelect(node: GlintTreeNode): void {
    this.selectedOrgNode.set(node);
  }

  getNodeLabel(node: GlintTreeNode | null): string {
    if (!node) return '';
    return node.label ?? '';
  }

  getTableNodeLabel(node: GlintTreeNode | null): string {
    if (!node) return '';
    const data = node.data as Record<string, string> | undefined;
    return data?.['name'] ?? node.label ?? '';
  }

  getCheckedLabels(): string[] {
    const nodes = this.checkedNodes();
    if (!nodes || !Array.isArray(nodes)) return [];
    return nodes.map(n => n.label ?? '');
  }
}
