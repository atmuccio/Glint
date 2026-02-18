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

/** Flat entry representing a visible tree row with its depth level. */
interface FlatTreeEntry {
  node: GlintTreeNode;
  depth: number;
}

/**
 * TreeTable combines table columns with hierarchical tree indentation.
 * The first column renders an expand/collapse toggle and depth-based indentation.
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
  imports: [NgTemplateOutlet],
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
            (click)="onNodeClick(entry.node)"
          >
            @for (col of columns(); track col.field(); let first = $first) {
              <td>
                @if (first) {
                  <span [style.padding-inline-start.rem]="entry.depth * 1.5" class="tree-cell">
                    @if (entry.node.children?.length && !entry.node.leaf) {
                      <button class="toggle" (click)="toggleNode(entry.node); $event.stopPropagation()" type="button">
                        <span class="chevron" [class.expanded]="entry.node.expanded">&#9654;</span>
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

  /** Recursively flatten tree nodes into a flat list */
  private flattenRecursive(nodes: GlintTreeNode[], depth: number, result: FlatTreeEntry[]): void {
    for (const node of nodes) {
      result.push({ node, depth });
      if (node.expanded && node.children?.length) {
        this.flattenRecursive(node.children, depth + 1, result);
      }
    }
  }
}
