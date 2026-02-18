import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { GlintTreeTableComponent } from './tree-table.component';
import { GlintTreeTableColumnDirective } from './tree-table-column.directive';
import { GlintTreeNode } from '../core/tree/tree-node.model';

function createTestNodes(): GlintTreeNode[] {
  return [
    {
      key: '1',
      label: 'Documents',
      data: { name: 'Documents', size: '75kb', type: 'Folder' },
      expanded: false,
      children: [
        {
          key: '1-1',
          label: 'Work',
          data: { name: 'Work', size: '55kb', type: 'Folder' },
          children: [
            {
              key: '1-1-1',
              label: 'Resume.pdf',
              data: { name: 'Resume.pdf', size: '25kb', type: 'PDF' },
            },
          ],
        },
        {
          key: '1-2',
          label: 'Home',
          data: { name: 'Home', size: '20kb', type: 'Folder' },
          children: [],
        },
      ],
    },
    {
      key: '2',
      label: 'Pictures',
      data: { name: 'Pictures', size: '150kb', type: 'Folder' },
      children: [
        {
          key: '2-1',
          label: 'photo.jpg',
          data: { name: 'photo.jpg', size: '150kb', type: 'Image' },
        },
      ],
    },
    {
      key: '3',
      label: 'notes.txt',
      data: { name: 'notes.txt', size: '5kb', type: 'Text' },
    },
  ];
}

@Component({
  selector: 'glint-test-tree-table-host',
  standalone: true,
  imports: [GlintTreeTableComponent, GlintTreeTableColumnDirective],
  template: `
    <glint-tree-table [value]="nodes">
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
  `,
})
class TestTreeTableHostComponent {
  nodes = createTestNodes();
}

@Component({
  selector: 'glint-test-tree-table-selection',
  standalone: true,
  imports: [GlintTreeTableComponent, GlintTreeTableColumnDirective],
  template: `
    <glint-tree-table [value]="nodes" [selectionMode]="mode" [(selection)]="selection">
      <ng-template glintTreeTableColumn="name" header="Name" let-node>
        {{ node.data.name }}
      </ng-template>
    </glint-tree-table>
  `,
})
class TestTreeTableSelectionHostComponent {
  nodes = createTestNodes();
  mode: 'single' | 'multiple' | null = 'single';
  selection = signal<GlintTreeNode | GlintTreeNode[] | null>(null);
}

describe('GlintTreeTableComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestTreeTableHostComponent,
        TestTreeTableSelectionHostComponent,
      ],
    });
  });

  it('should render column headers', () => {
    const fixture = TestBed.createComponent(TestTreeTableHostComponent);
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll('th');
    expect(headers.length).toBe(3);
    expect(headers[0].textContent).toContain('Name');
    expect(headers[1].textContent).toContain('Size');
    expect(headers[2].textContent).toContain('Type');
  });

  it('should render tree nodes as rows', () => {
    const fixture = TestBed.createComponent(TestTreeTableHostComponent);
    fixture.detectChanges();
    // Only root nodes visible initially (none expanded)
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(3);
    expect(rows[0].textContent).toContain('Documents');
    expect(rows[1].textContent).toContain('Pictures');
    expect(rows[2].textContent).toContain('notes.txt');
  });

  it('should expand node on toggle click', () => {
    const fixture = TestBed.createComponent(TestTreeTableHostComponent);
    fixture.detectChanges();

    // Click toggle on first node (Documents)
    const toggle = fixture.nativeElement.querySelector('button.toggle');
    expect(toggle).toBeTruthy();
    toggle.click();
    fixture.detectChanges();

    // Documents has 2 children (Work, Home) - now 5 rows total
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(5);
    expect(rows[1].textContent).toContain('Work');
    expect(rows[2].textContent).toContain('Home');
  });

  it('should indent first column based on depth', () => {
    const fixture = TestBed.createComponent(TestTreeTableHostComponent);
    fixture.detectChanges();

    // Expand Documents
    const toggle = fixture.nativeElement.querySelector('button.toggle');
    toggle.click();
    fixture.detectChanges();

    // Root row (depth 0) should have 0 padding
    const treeCells = fixture.nativeElement.querySelectorAll('.tree-cell');
    expect(treeCells[0].style.paddingInlineStart).toBe('0rem');

    // Child row (depth 1) should have 1.5rem padding
    expect(treeCells[1].style.paddingInlineStart).toBe('1.5rem');
  });

  it('should select node in single mode', () => {
    const fixture = TestBed.createComponent(TestTreeTableSelectionHostComponent);
    fixture.detectChanges();

    // Click on first row
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    rows[0].click();
    fixture.detectChanges();

    expect(rows[0].classList.contains('selected')).toBe(true);

    // Click on second row - deselects first, selects second
    rows[1].click();
    fixture.detectChanges();

    expect(rows[0].classList.contains('selected')).toBe(false);
    expect(rows[1].classList.contains('selected')).toBe(true);
  });

  it('should have treegrid role', () => {
    const fixture = TestBed.createComponent(TestTreeTableHostComponent);
    fixture.detectChanges();
    const table = fixture.nativeElement.querySelector('table');
    expect(table.getAttribute('role')).toBe('treegrid');
  });

  it('should show expand toggle for nodes with children', () => {
    const fixture = TestBed.createComponent(TestTreeTableHostComponent);
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');

    // Documents (row 0) has children - should have toggle button
    const docToggle = rows[0].querySelector('button.toggle');
    expect(docToggle).toBeTruthy();

    // Pictures (row 1) has children - should have toggle button
    const picToggle = rows[1].querySelector('button.toggle');
    expect(picToggle).toBeTruthy();

    // notes.txt (row 2) has no children - should have placeholder
    const notesToggle = rows[2].querySelector('button.toggle');
    expect(notesToggle).toBeNull();
    const placeholder = rows[2].querySelector('.toggle-placeholder');
    expect(placeholder).toBeTruthy();
  });

  it('should collapse a previously expanded node', () => {
    const fixture = TestBed.createComponent(TestTreeTableHostComponent);
    fixture.detectChanges();

    const toggle = fixture.nativeElement.querySelector('button.toggle');

    // Expand
    toggle.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(5);

    // Collapse
    toggle.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(3);
  });

  it('should set aria-level based on depth', () => {
    const fixture = TestBed.createComponent(TestTreeTableHostComponent);
    fixture.detectChanges();

    // Expand Documents
    const toggle = fixture.nativeElement.querySelector('button.toggle');
    toggle.click();
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    // Root level: aria-level="1"
    expect(rows[0].getAttribute('aria-level')).toBe('1');
    // Child level: aria-level="2"
    expect(rows[1].getAttribute('aria-level')).toBe('2');
  });

  it('should set aria-expanded on nodes with children', () => {
    const fixture = TestBed.createComponent(TestTreeTableHostComponent);
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    // Documents is collapsed
    expect(rows[0].getAttribute('aria-expanded')).toBe('false');
    // notes.txt has no children - no aria-expanded
    expect(rows[2].getAttribute('aria-expanded')).toBeNull();

    // Expand Documents
    const toggle = fixture.nativeElement.querySelector('button.toggle');
    toggle.click();
    fixture.detectChanges();

    const updatedRows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(updatedRows[0].getAttribute('aria-expanded')).toBe('true');
  });

  it('should deselect node on second click in single mode', () => {
    const fixture = TestBed.createComponent(TestTreeTableSelectionHostComponent);
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    rows[0].click();
    fixture.detectChanges();
    expect(rows[0].classList.contains('selected')).toBe(true);

    // Click same row again to deselect
    rows[0].click();
    fixture.detectChanges();
    expect(rows[0].classList.contains('selected')).toBe(false);
  });
});
