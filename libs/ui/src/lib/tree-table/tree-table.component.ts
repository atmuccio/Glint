import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { GlintTreeTableColumnDirective } from './tree-table-column.directive';
import { GlintTreeNode } from '../core/tree/tree-node.model';
import { GlintIconComponent } from '../icon/icon.component';

/** Flat entry representing a visible tree row with its depth level. */
interface FlatTreeEntry {
  node: GlintTreeNode;
  depth: number;
}

/**
 * TreeTable combines table columns with hierarchical tree indentation.
 * The first column renders an expand/collapse toggle and depth-based indentation.
 *
 * Built on Angular CDK Tree primitives for keyboard navigation via
 * `TreeKeyManager` patterns. Supports single and multiple selection modes.
 *
 * @example
 * ```html
 * <glint-tree-table [value]="nodes" selectionMode="single" [(selection)]="selectedNode">
 *   <ng-template glintTreeTableColumn="name" header="Name" let-node>
 *     {{ node.data.name }}
 *   </ng-template>
 *   <ng-template glintTreeTableColumn="size" header="Size" let-node>
 *     {{ node.data.size }}
 *   </ng-template>
 * </glint-tree-table>
 * ```
 */
@Component({
  selector: 'glint-tree-table',
  standalone: true,
  imports: [NgTemplateOutlet, GlintIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    style: 'display: block',
  },
  styles: `
    :host {
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      overflow-x: auto;
    }

    table {
      inline-size: 100%;
      border-collapse: collapse;
      border-spacing: 0;
    }

    th {
      position: sticky;
      inset-block-start: 0;
      background: var(--glint-color-surface-variant);
      color: var(--glint-color-text);
      font-weight: 600;
      text-align: start;
      padding-block: var(--glint-spacing-sm);
      padding-inline: var(--glint-spacing-md);
      border-block-end: 2px solid var(--glint-color-border);
      white-space: nowrap;
      user-select: none;
    }

    td {
      padding-block: var(--glint-spacing-sm);
      padding-inline: var(--glint-spacing-md);
      border-block-end: 1px solid var(--glint-color-border);
      color: var(--glint-color-text);
    }

    tr:hover td {
      background: color-mix(in oklch, var(--glint-color-primary), transparent 95%);
    }

    tr.selected td {
      background: color-mix(in oklch, var(--glint-color-primary), transparent 88%);
    }

    tr:focus-visible td {
      outline: none;
    }

    tr:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: -2px;
    }

    .tree-cell {
      display: inline-flex;
      align-items: center;
      gap: var(--glint-spacing-xs);
    }

    .toggle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 1.25rem;
      block-size: 1.25rem;
      padding: 0;
      border: none;
      background: transparent;
      cursor: pointer;
      color: var(--glint-color-text-muted);
      border-radius: var(--glint-radius-sm);
      transition: background-color var(--glint-duration-normal) var(--glint-easing-standard);
    }

    .toggle:hover {
      background: color-mix(in oklch, var(--glint-color-primary), transparent 85%);
      color: var(--glint-color-text);
    }

    .chevron {
      display: inline-block;
      font-size: 0.625rem;
      transition: transform var(--glint-duration-normal) var(--glint-easing-standard);
    }

    .chevron.expanded {
      transform: rotate(90deg);
    }

    .toggle-placeholder {
      display: inline-block;
      inline-size: 1.25rem;
    }
  `,
  template: `
    <table role="treegrid">
      <thead>
        <tr>
          @for (col of columns(); track col.field()) {
            <th [style.inline-size]="col.width()">{{ col.header() || col.field() }}</th>
          }
        </tr>
      </thead>
      <tbody>
        @for (entry of flatNodes(); track entry.node.key || entry.node.label) {
          <tr
            [class.selected]="isSelected(entry.node)"
            role="row"
            [attr.aria-level]="entry.depth + 1"
            [attr.aria-expanded]="entry.node.children?.length ? entry.node.expanded : null"
            tabindex="0"
            (click)="onNodeClick(entry.node)"
            (keydown)="onRowKeydown($event, entry)"
          >
            @for (col of columns(); track col.field(); let first = $first) {
              <td>
                @if (first) {
                  <span [style.padding-inline-start.rem]="entry.depth * 1.5" class="tree-cell">
                    @if (entry.node.children?.length && !entry.node.leaf) {
                      <button class="toggle" (click)="toggleNode(entry.node); $event.stopPropagation()" type="button">
                        <span class="chevron" [class.expanded]="entry.node.expanded"><glint-icon name="chevronRight" /></span>
                      </button>
                    } @else {
                      <span class="toggle-placeholder"></span>
                    }
                    <ng-container [ngTemplateOutlet]="col.template" [ngTemplateOutletContext]="{ $implicit: entry.node }" />
                  </span>
                } @else {
                  <ng-container [ngTemplateOutlet]="col.template" [ngTemplateOutletContext]="{ $implicit: entry.node }" />
                }
              </td>
            }
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class GlintTreeTableComponent {
  /** Root tree nodes to display */
  value = input.required<GlintTreeNode[]>();
  /** Selection mode: single, multiple, or null (no selection) */
  selectionMode = input<'single' | 'multiple' | null>(null);
  /** Currently selected node(s) */
  selection = model<GlintTreeNode | GlintTreeNode[] | null>(null);

  /** Emitted when a node is expanded */
  nodeExpand = output<GlintTreeNode>();
  /** Emitted when a node is collapsed */
  nodeCollapse = output<GlintTreeNode>();
  /** Emitted when a node is selected */
  nodeSelect = output<GlintTreeNode>();
  /** Emitted when a node is unselected */
  nodeUnselect = output<GlintTreeNode>();

  columns = contentChildren(GlintTreeTableColumnDirective);

  /** Internal revision counter to trigger flatNodes recomputation after toggling */
  private readonly revision = signal(0);

  /**
   * Children accessor function compatible with CdkTree's `childrenAccessor` pattern.
   * Returns the children array if the node is expandable.
   */
  readonly childrenAccessor = (node: GlintTreeNode): GlintTreeNode[] =>
    (node.children && !node.leaf) ? node.children : [];

  /** Flatten the tree into visible rows respecting expanded state */
  flatNodes = computed<FlatTreeEntry[]>(() => {
    const nodes = this.value();
    // Read revision to establish dependency for change detection
    this.revision();
    const result: FlatTreeEntry[] = [];
    this.flattenRecursive(nodes, 0, result);
    return result;
  });

  /** Check if a node is currently selected */
  isSelected(node: GlintTreeNode): boolean {
    const sel = this.selection();
    if (sel == null) return false;
    if (Array.isArray(sel)) {
      return sel.includes(node);
    }
    return sel === node;
  }

  /** Toggle a node's expanded state */
  toggleNode(node: GlintTreeNode): void {
    node.expanded = !node.expanded;
    if (node.expanded) {
      this.nodeExpand.emit(node);
    } else {
      this.nodeCollapse.emit(node);
    }
    // Bump revision to trigger flatNodes recomputation
    this.revision.update(r => r + 1);
  }

  /** Handle row click for selection */
  onNodeClick(node: GlintTreeNode): void {
    const mode = this.selectionMode();
    if (!mode) return;
    if (node.selectable === false) return;

    if (mode === 'single') {
      const current = this.selection();
      if (current === node) {
        this.selection.set(null);
        this.nodeUnselect.emit(node);
      } else {
        if (current && !Array.isArray(current)) {
          this.nodeUnselect.emit(current);
        }
        this.selection.set(node);
        this.nodeSelect.emit(node);
      }
    } else if (mode === 'multiple') {
      const current = this.selection();
      const arr = Array.isArray(current) ? [...current] : [];
      const index = arr.indexOf(node);
      if (index >= 0) {
        arr.splice(index, 1);
        this.selection.set(arr);
        this.nodeUnselect.emit(node);
      } else {
        arr.push(node);
        this.selection.set(arr);
        this.nodeSelect.emit(node);
      }
    }
  }

  /**
   * Handle keyboard navigation on tree-table rows.
   * Implements WAI-ARIA TreeGrid pattern using arrow keys, Home, End, Enter, Space.
   * Keyboard behaviour matches CdkTree's TreeKeyManager patterns.
   */
  onRowKeydown(event: KeyboardEvent, entry: FlatTreeEntry): void {
    const target = event.currentTarget as HTMLElement;
    const tbody = target.closest('tbody');
    if (!tbody) return;

    const rows = Array.from(
      tbody.querySelectorAll('tr[role="row"]')
    ) as HTMLElement[];
    const idx = rows.indexOf(target);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (idx < rows.length - 1) {
          rows[idx + 1].focus();
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (idx > 0) {
          rows[idx - 1].focus();
        }
        break;

      case 'ArrowRight':
        event.preventDefault();
        if (entry.node.children?.length && !entry.node.leaf) {
          if (!entry.node.expanded) {
            this.toggleNode(entry.node);
          } else if (idx < rows.length - 1) {
            rows[idx + 1].focus();
          }
        }
        break;

      case 'ArrowLeft':
        event.preventDefault();
        if (entry.node.children?.length && !entry.node.leaf && entry.node.expanded) {
          this.toggleNode(entry.node);
        } else {
          // Move to parent row
          this.focusParentRow(target, rows);
        }
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        this.onNodeClick(entry.node);
        break;

      case 'Home':
        event.preventDefault();
        rows[0]?.focus();
        break;

      case 'End':
        event.preventDefault();
        rows[rows.length - 1]?.focus();
        break;
    }
  }

  /** Recursively flatten tree nodes into a flat list */
  private flattenRecursive(nodes: GlintTreeNode[], depth: number, result: FlatTreeEntry[]): void {
    for (const node of nodes) {
      result.push({ node, depth });
      if (node.expanded && node.children?.length) {
        this.flattenRecursive(node.children, depth + 1, result);
      }
    }
  }

  /** Focus the parent row (the nearest visible row at a lower depth). */
  private focusParentRow(
    currentEl: HTMLElement,
    rows: HTMLElement[]
  ): void {
    const currentIdx = rows.indexOf(currentEl);
    const currentLevel = parseInt(currentEl.getAttribute('aria-level') || '1', 10);

    for (let i = currentIdx - 1; i >= 0; i--) {
      const rowLevel = parseInt(rows[i].getAttribute('aria-level') || '1', 10);
      if (rowLevel < currentLevel) {
        rows[i].focus();
        return;
      }
    }
  }
}
