import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { GlintTreeComponent } from './tree.component';
import { GlintTreeNode } from '../core/tree/tree-node.model';

function buildNodes(): GlintTreeNode[] {
  return [
    {
      key: '1',
      label: 'Documents',
      children: [
        { key: '1-1', label: 'Work', children: [{ key: '1-1-1', label: 'Report.pdf' }] },
        { key: '1-2', label: 'Personal' },
      ],
    },
    {
      key: '2',
      label: 'Photos',
      children: [
        { key: '2-1', label: 'Vacation.jpg' },
        { key: '2-2', label: 'Family.png' },
      ],
    },
    { key: '3', label: 'Music' },
  ];
}

@Component({
  selector: 'glint-test-tree-host',
  standalone: true,
  imports: [GlintTreeComponent],
  template: `
    <glint-tree
      [value]="nodes"
      [selectionMode]="selectionMode"
      [(selection)]="selected"
      [filter]="showFilter"
    />
  `,
})
class TestTreeHostComponent {
  nodes: GlintTreeNode[] = buildNodes();
  selectionMode: 'single' | 'multiple' | 'checkbox' | null = null;
  selected = signal<GlintTreeNode | GlintTreeNode[] | null>(null);
  showFilter = false;
}

describe('GlintTreeComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestTreeHostComponent] });
  });

  it('should render tree nodes', () => {
    const fixture = TestBed.createComponent(TestTreeHostComponent);
    fixture.detectChanges();
    const nodes = fixture.nativeElement.querySelectorAll('.tree-node');
    // Only root-level nodes visible (children collapsed by default)
    expect(nodes.length).toBe(3);
    expect(nodes[0].textContent).toContain('Documents');
    expect(nodes[1].textContent).toContain('Photos');
    expect(nodes[2].textContent).toContain('Music');
  });

  it('should render nested children when expanded', () => {
    const fixture = TestBed.createComponent(TestTreeHostComponent);
    fixture.componentInstance.nodes[0].expanded = true;
    fixture.detectChanges();
    const nodes = fixture.nativeElement.querySelectorAll('.tree-node');
    // Documents (expanded) + Work + Personal + Photos + Music = 5
    expect(nodes.length).toBe(5);
    expect(nodes[1].textContent).toContain('Work');
    expect(nodes[2].textContent).toContain('Personal');
  });

  it('should expand node on toggle click', () => {
    const fixture = TestBed.createComponent(TestTreeHostComponent);
    fixture.detectChanges();
    const toggle = fixture.nativeElement.querySelector('.toggle');
    toggle.click();
    fixture.detectChanges();
    const nodes = fixture.nativeElement.querySelectorAll('.tree-node');
    // Documents is now expanded: Documents + Work + Personal + Photos + Music = 5
    expect(nodes.length).toBe(5);
  });

  it('should collapse node on toggle click', () => {
    const fixture = TestBed.createComponent(TestTreeHostComponent);
    fixture.componentInstance.nodes[0].expanded = true;
    fixture.detectChanges();
    let nodes = fixture.nativeElement.querySelectorAll('.tree-node');
    expect(nodes.length).toBe(5);

    const toggle = fixture.nativeElement.querySelector('.toggle');
    toggle.click();
    fixture.detectChanges();
    nodes = fixture.nativeElement.querySelectorAll('.tree-node');
    expect(nodes.length).toBe(3);
  });

  it('should select node in single mode', () => {
    const fixture = TestBed.createComponent(TestTreeHostComponent);
    fixture.componentInstance.selectionMode = 'single';
    fixture.detectChanges();

    const nodes = fixture.nativeElement.querySelectorAll('.tree-node');
    nodes[2].click(); // Click "Music"
    fixture.detectChanges();

    expect(nodes[2].classList.contains('selected')).toBe(true);
    expect(fixture.componentInstance.selected()).toBe(
      fixture.componentInstance.nodes[2]
    );
  });

  it('should select multiple nodes in multiple mode', () => {
    const fixture = TestBed.createComponent(TestTreeHostComponent);
    fixture.componentInstance.selectionMode = 'multiple';
    fixture.detectChanges();

    const nodes = fixture.nativeElement.querySelectorAll('.tree-node');
    nodes[0].click(); // Documents
    fixture.detectChanges();
    nodes[2].click(); // Music
    fixture.detectChanges();

    expect(nodes[0].classList.contains('selected')).toBe(true);
    expect(nodes[2].classList.contains('selected')).toBe(true);
    const sel = fixture.componentInstance.selected() as GlintTreeNode[];
    expect(sel.length).toBe(2);
  });

  it('should filter nodes by label', () => {
    const fixture = TestBed.createComponent(TestTreeHostComponent);
    fixture.componentInstance.showFilter = true;
    fixture.detectChanges();

    const filterInput: HTMLInputElement =
      fixture.nativeElement.querySelector('.tree-filter');
    filterInput.value = 'Music';
    filterInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const nodes = fixture.nativeElement.querySelectorAll('.tree-node');
    expect(nodes.length).toBe(1);
    expect(nodes[0].textContent).toContain('Music');
  });

  it('should have tree role', () => {
    const fixture = TestBed.createComponent(TestTreeHostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('glint-tree');
    expect(host.getAttribute('role')).toBe('tree');
  });

  it('should have treeitem role on nodes', () => {
    const fixture = TestBed.createComponent(TestTreeHostComponent);
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('[role="treeitem"]');
    expect(items.length).toBe(3);
  });

  it('should indent children based on depth', () => {
    const fixture = TestBed.createComponent(TestTreeHostComponent);
    fixture.componentInstance.nodes[0].expanded = true;
    fixture.detectChanges();

    const nodes = fixture.nativeElement.querySelectorAll('.tree-node');
    // Root node (depth 0) should have 0rem padding
    expect(nodes[0].style.paddingInlineStart).toBe('0rem');
    // Child node (depth 1) should have 1.5rem padding
    expect(nodes[1].style.paddingInlineStart).toBe('1.5rem');
  });
});
