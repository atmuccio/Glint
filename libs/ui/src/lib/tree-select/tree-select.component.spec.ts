import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { GlintTreeSelectComponent } from './tree-select.component';
import type { GlintTreeNode } from '../core/tree/tree-node.model';

const TREE_DATA: GlintTreeNode[] = [
  {
    key: 'documents',
    label: 'Documents',
    children: [
      { key: 'resume', label: 'Resume.pdf', leaf: true },
      { key: 'cover', label: 'Cover Letter.pdf', leaf: true },
    ],
  },
  {
    key: 'photos',
    label: 'Photos',
    children: [
      { key: 'vacation', label: 'Vacation.jpg', leaf: true },
      { key: 'family', label: 'Family.jpg', leaf: true },
    ],
  },
  { key: 'notes', label: 'Notes.txt', leaf: true },
];

@Component({
  selector: 'glint-test-tree-select-host',
  standalone: true,
  imports: [GlintTreeSelectComponent, ReactiveFormsModule],
  template: `
    <glint-tree-select
      [options]="options"
      [placeholder]="placeholder"
      [selectionMode]="selectionMode"
      [filter]="filter"
      [disabled]="disabled"
      [formControl]="ctrl"
    />
  `,
})
class TestTreeSelectHostComponent {
  ctrl = new FormControl<GlintTreeNode | GlintTreeNode[] | null>(null);
  options = TREE_DATA;
  placeholder = 'Select...';
  selectionMode: 'single' | 'multiple' | 'checkbox' = 'single';
  filter = false;
  disabled = false;
}

describe('GlintTreeSelectComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestTreeSelectHostComponent, OverlayModule],
    });
  });

  function createFixture(overrides?: Partial<TestTreeSelectHostComponent>) {
    const fixture = TestBed.createComponent(TestTreeSelectHostComponent);
    if (overrides) {
      Object.assign(fixture.componentInstance, overrides);
    }
    fixture.detectChanges();
    return fixture;
  }

  function getTrigger(fixture: ReturnType<typeof createFixture>) {
    return fixture.nativeElement.querySelector('.tree-select-trigger') as HTMLElement;
  }

  async function openPanel(fixture: ReturnType<typeof createFixture>) {
    getTrigger(fixture).click();
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function getPanel() {
    return document.querySelector('.tree-select-panel') as HTMLElement;
  }

  function getTreeNodes() {
    return Array.from(document.querySelectorAll('.tree-node')) as HTMLElement[];
  }

  // ── Basic rendering ─────────────────────────────

  it('should render trigger with placeholder', () => {
    const fixture = createFixture();
    const trigger = getTrigger(fixture);
    expect(trigger).toBeTruthy();
    expect(trigger.textContent).toContain('Select...');
  });

  it('should show selected node label', async () => {
    const fixture = createFixture();
    const leafNode: GlintTreeNode = { key: 'notes', label: 'Notes.txt', leaf: true };
    fixture.componentInstance.ctrl.setValue(leafNode);
    fixture.detectChanges();
    await fixture.whenStable();

    const trigger = getTrigger(fixture);
    expect(trigger.textContent).toContain('Notes.txt');
  });

  it('should have combobox role', () => {
    const fixture = createFixture();
    const trigger = getTrigger(fixture);
    expect(trigger.getAttribute('role')).toBe('combobox');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  // ── Open / Close ────────────────────────────────

  it('should open panel on click', async () => {
    const fixture = createFixture();
    await openPanel(fixture);

    expect(getPanel()).toBeTruthy();
    expect(getTrigger(fixture).getAttribute('aria-expanded')).toBe('true');
  });

  it('should not open when disabled', async () => {
    const fixture = createFixture({ disabled: true });

    getTrigger(fixture).click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(getPanel()).toBeFalsy();
  });

  // ── CVA ─────────────────────────────────────────

  it('should work with FormControl (CVA)', async () => {
    const fixture = createFixture();
    await openPanel(fixture);

    // Panel should show tree nodes
    const nodes = getTreeNodes();
    expect(nodes.length).toBeGreaterThan(0);

    // Click the leaf node "Notes.txt" (last top-level item, rendered at index 2 since children are collapsed)
    const noteNode = nodes.find(n => n.textContent?.includes('Notes.txt'));
    expect(noteNode).toBeTruthy();
    noteNode!.click();
    fixture.detectChanges();
    await fixture.whenStable();

    // FormControl should have the node value
    const val = fixture.componentInstance.ctrl.value as GlintTreeNode;
    expect(val).toBeTruthy();
    expect(val.label).toBe('Notes.txt');
  });

  it('should set disabled state from FormControl', () => {
    const fixture = createFixture();
    fixture.componentInstance.ctrl.disable();
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('glint-tree-select') as HTMLElement;
    expect(host.classList.contains('disabled')).toBe(true);
  });

  // ── Single selection ────────────────────────────

  it('should close on node selection in single mode', async () => {
    const fixture = createFixture();
    await openPanel(fixture);

    const nodes = getTreeNodes();
    const noteNode = nodes.find(n => n.textContent?.includes('Notes.txt'));
    noteNode!.click();
    fixture.detectChanges();
    await fixture.whenStable();

    // Panel should be closed in single mode
    expect(getPanel()).toBeFalsy();
  });
});
