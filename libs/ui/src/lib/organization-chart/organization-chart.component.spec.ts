import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { GlintOrganizationChartComponent } from './organization-chart.component';
import { GlintTreeNode } from '../core/tree/tree-node.model';

const TEST_ORG: GlintTreeNode = {
  key: 'ceo',
  label: 'CEO',
  expanded: true,
  children: [
    {
      key: 'cto',
      label: 'CTO',
      expanded: true,
      children: [
        { key: 'dev1', label: 'Developer 1', leaf: true },
        { key: 'dev2', label: 'Developer 2', leaf: true },
      ],
    },
    {
      key: 'cfo',
      label: 'CFO',
      expanded: true,
      children: [
        { key: 'acct', label: 'Accountant', leaf: true },
      ],
    },
  ],
};

@Component({
  selector: 'glint-test-org-chart-host',
  standalone: true,
  imports: [GlintOrganizationChartComponent],
  template: `
    <glint-organization-chart
      [value]="orgData"
      [selectionMode]="selectionMode"
      [(selection)]="selection"
      (nodeSelect)="onSelect($event)"
      (nodeUnselect)="onUnselect($event)"
    />
  `,
})
class TestOrgChartHostComponent {
  orgData: GlintTreeNode = TEST_ORG;
  selectionMode: 'single' | 'multiple' | null = null;
  selection = signal<GlintTreeNode | GlintTreeNode[] | null>(null);
  selectedEvents: GlintTreeNode[] = [];
  unselectedEvents: GlintTreeNode[] = [];

  onSelect(node: GlintTreeNode): void {
    this.selectedEvents.push(node);
  }

  onUnselect(node: GlintTreeNode): void {
    this.unselectedEvents.push(node);
  }
}

describe('GlintOrganizationChartComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestOrgChartHostComponent] });
  });

  it('should render root node', () => {
    const fixture = TestBed.createComponent(TestOrgChartHostComponent);
    fixture.detectChanges();
    const labels = fixture.nativeElement.querySelectorAll('.org-label');
    expect(labels.length).toBeGreaterThanOrEqual(1);
    expect(labels[0].textContent?.trim()).toBe('CEO');
  });

  it('should render children recursively', () => {
    const fixture = TestBed.createComponent(TestOrgChartHostComponent);
    fixture.detectChanges();
    const labels = fixture.nativeElement.querySelectorAll('.org-label');
    const labelTexts = Array.from(labels).map(
      (el: unknown) => (el as HTMLElement).textContent?.trim()
    );
    expect(labelTexts).toContain('CEO');
    expect(labelTexts).toContain('CTO');
    expect(labelTexts).toContain('CFO');
    expect(labelTexts).toContain('Developer 1');
    expect(labelTexts).toContain('Developer 2');
    expect(labelTexts).toContain('Accountant');
    expect(labels.length).toBe(6);
  });

  it('should have correct label text', () => {
    const fixture = TestBed.createComponent(TestOrgChartHostComponent);
    fixture.detectChanges();
    const labels = fixture.nativeElement.querySelectorAll('.org-label');
    const labelTexts = Array.from(labels).map(
      (el: unknown) => (el as HTMLElement).textContent?.trim()
    );
    expect(labelTexts).toEqual([
      'CEO',
      'CTO',
      'Developer 1',
      'Developer 2',
      'CFO',
      'Accountant',
    ]);
  });

  it('should select node in single mode', () => {
    const fixture = TestBed.createComponent(TestOrgChartHostComponent);
    fixture.componentInstance.selectionMode = 'single';
    fixture.detectChanges();

    const nodes = fixture.nativeElement.querySelectorAll('.org-node');
    // Click the root node (CEO)
    nodes[0].click();
    fixture.detectChanges();

    expect(nodes[0].classList.contains('selected')).toBe(true);
    expect(fixture.componentInstance.selectedEvents.length).toBe(1);
    expect(fixture.componentInstance.selectedEvents[0].label).toBe('CEO');
  });

  it('should deselect node in single mode when clicking same node', () => {
    const fixture = TestBed.createComponent(TestOrgChartHostComponent);
    fixture.componentInstance.selectionMode = 'single';
    fixture.detectChanges();

    const nodes = fixture.nativeElement.querySelectorAll('.org-node');
    // Click CEO to select
    nodes[0].click();
    fixture.detectChanges();
    expect(nodes[0].classList.contains('selected')).toBe(true);

    // Click CEO again to deselect
    nodes[0].click();
    fixture.detectChanges();
    expect(nodes[0].classList.contains('selected')).toBe(false);
    expect(fixture.componentInstance.unselectedEvents.length).toBe(1);
  });

  it('should replace selection in single mode when clicking different node', () => {
    const fixture = TestBed.createComponent(TestOrgChartHostComponent);
    fixture.componentInstance.selectionMode = 'single';
    fixture.detectChanges();

    const nodes = fixture.nativeElement.querySelectorAll('.org-node');
    // Click CEO
    nodes[0].click();
    fixture.detectChanges();
    expect(nodes[0].classList.contains('selected')).toBe(true);

    // Click CTO — should replace CEO
    nodes[1].click();
    fixture.detectChanges();
    expect(nodes[0].classList.contains('selected')).toBe(false);
    expect(nodes[1].classList.contains('selected')).toBe(true);
  });

  it('should toggle selection in multiple mode', () => {
    const fixture = TestBed.createComponent(TestOrgChartHostComponent);
    fixture.componentInstance.selectionMode = 'multiple';
    fixture.detectChanges();

    const nodes = fixture.nativeElement.querySelectorAll('.org-node');
    // Click CEO
    nodes[0].click();
    fixture.detectChanges();
    expect(nodes[0].classList.contains('selected')).toBe(true);

    // Click CTO — both should be selected
    nodes[1].click();
    fixture.detectChanges();
    expect(nodes[0].classList.contains('selected')).toBe(true);
    expect(nodes[1].classList.contains('selected')).toBe(true);
  });

  it('should have treeitem role on nodes', () => {
    const fixture = TestBed.createComponent(TestOrgChartHostComponent);
    fixture.detectChanges();
    const nodes = fixture.nativeElement.querySelectorAll('[role="treeitem"]');
    expect(nodes.length).toBe(6);
  });

  it('should render connector lines', () => {
    const fixture = TestBed.createComponent(TestOrgChartHostComponent);
    fixture.detectChanges();
    const linesDown = fixture.nativeElement.querySelectorAll('.org-line-down');
    const linesTop = fixture.nativeElement.querySelectorAll('.org-line-top');
    const childrenConnectors = fixture.nativeElement.querySelectorAll('.org-children-connector');

    // CEO and CTO and CFO have children — 3 downward lines
    expect(linesDown.length).toBe(3);
    // CTO has 2 children, CFO has 1, CEO has 2 — 5 top lines
    expect(linesTop.length).toBe(5);
    // 3 nodes with children expanded
    expect(childrenConnectors.length).toBe(3);
  });

  it('should not render children when expanded is false', () => {
    const fixture = TestBed.createComponent(TestOrgChartHostComponent);
    fixture.componentInstance.orgData = {
      key: 'root',
      label: 'Root',
      expanded: false,
      children: [
        { key: 'child', label: 'Child', leaf: true },
      ],
    };
    fixture.detectChanges();

    const labels = fixture.nativeElement.querySelectorAll('.org-label');
    expect(labels.length).toBe(1);
    expect(labels[0].textContent?.trim()).toBe('Root');
  });

  it('should not select when selectionMode is null', () => {
    const fixture = TestBed.createComponent(TestOrgChartHostComponent);
    fixture.componentInstance.selectionMode = null;
    fixture.detectChanges();

    const nodes = fixture.nativeElement.querySelectorAll('.org-node');
    nodes[0].click();
    fixture.detectChanges();

    expect(nodes[0].classList.contains('selected')).toBe(false);
    expect(fixture.componentInstance.selectedEvents.length).toBe(0);
  });

  it('should not select node with selectable false', () => {
    const fixture = TestBed.createComponent(TestOrgChartHostComponent);
    fixture.componentInstance.selectionMode = 'single';
    fixture.componentInstance.orgData = {
      key: 'root',
      label: 'Root',
      selectable: false,
    };
    fixture.detectChanges();

    const node = fixture.nativeElement.querySelector('.org-node');
    node.click();
    fixture.detectChanges();

    expect(node.classList.contains('selected')).toBe(false);
    expect(fixture.componentInstance.selectedEvents.length).toBe(0);
  });

  it('should have tree role on host element', () => {
    const fixture = TestBed.createComponent(TestOrgChartHostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('glint-organization-chart');
    expect(host.getAttribute('role')).toBe('tree');
  });
});
